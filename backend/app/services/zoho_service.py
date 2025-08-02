"""
Zoho CRM Integration Service

This service handles all interactions with Zoho CRM API including:
- OAuth 2.0 authentication flow
- Lead creation and management
- Token refresh and management
- Error handling and logging
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import requests
from urllib.parse import urlencode

logger = logging.getLogger(__name__)

class ZohoCRMService:
    """Service class for Zoho CRM API integration"""
    
    def __init__(self):
        self.client_id = os.getenv('ZOHO_CLIENT_ID')
        self.client_secret = os.getenv('ZOHO_CLIENT_SECRET')
        self.redirect_uri = os.getenv('ZOHO_REDIRECT_URI')
        self.auth_url = os.getenv('ZOHO_AUTH_URL', 'https://accounts.zoho.com/oauth/v2/auth')
        self.token_url = os.getenv('ZOHO_TOKEN_URL', 'https://accounts.zoho.com/oauth/v2/token')
        self.crm_api_url = os.getenv('ZOHO_CRM_API_URL', 'https://www.zohoapis.com/crm/v3')
        
        # Token storage (in production, use secure database storage)
        self.access_token = None
        self.refresh_token = None
        self.token_expires_at = None
        
        if not all([self.client_id, self.client_secret, self.redirect_uri]):
            logger.warning("Zoho CRM credentials not fully configured")
    
    def get_auth_url(self, state: Optional[str] = None) -> str:
        """
        Generate OAuth authorization URL
        
        Args:
            state: Optional state parameter for security
            
        Returns:
            Authorization URL for Zoho OAuth flow
        """
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL',
            'access_type': 'offline'
        }
        
        if state:
            params['state'] = state
            
        return f"{self.auth_url}?{urlencode(params)}"
    
    def exchange_code_for_token(self, authorization_code: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token
        
        Args:
            authorization_code: Code received from Zoho OAuth callback
            
        Returns:
            Token response from Zoho
        """
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'redirect_uri': self.redirect_uri,
            'code': authorization_code
        }
        
        try:
            response = requests.post(self.token_url, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            self._store_tokens(token_data)
            
            logger.info("Successfully obtained Zoho access token")
            return token_data
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to exchange code for token: {e}")
            raise
    
    def refresh_access_token(self) -> bool:
        """
        Refresh expired access token using refresh token
        
        Returns:
            True if successful, False otherwise
        """
        if not self.refresh_token:
            logger.error("No refresh token available")
            return False
            
        data = {
            'grant_type': 'refresh_token',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': self.refresh_token
        }
        
        try:
            response = requests.post(self.token_url, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            self._store_tokens(token_data)
            
            logger.info("Successfully refreshed Zoho access token")
            return True
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to refresh access token: {e}")
            return False
    
    def _store_tokens(self, token_data: Dict[str, Any]) -> None:
        """Store tokens securely (implement proper storage in production)"""
        self.access_token = token_data.get('access_token')
        self.refresh_token = token_data.get('refresh_token', self.refresh_token)
        
        expires_in = token_data.get('expires_in', 3600)
        self.token_expires_at = datetime.now() + timedelta(seconds=expires_in)
        
        # In production, store tokens in encrypted database
        logger.info("Tokens stored successfully")
    
    def _ensure_valid_token(self) -> bool:
        """Ensure we have a valid access token"""
        if not self.access_token:
            logger.error("No access token available")
            return False
            
        if self.token_expires_at and datetime.now() >= self.token_expires_at:
            logger.info("Access token expired, attempting refresh")
            return self.refresh_access_token()
            
        return True
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        if not self._ensure_valid_token():
            raise Exception("No valid access token available")
            
        return {
            'Authorization': f'Zoho-oauthtoken {self.access_token}',
            'Content-Type': 'application/json'
        }
    
    def create_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new lead in Zoho CRM
        
        Args:
            lead_data: Lead information dictionary
            
        Returns:
            API response from Zoho
        """
        url = f"{self.crm_api_url}/Leads"
        
        payload = {
            "data": [lead_data]
        }
        
        try:
            headers = self._get_headers()
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"Successfully created lead: {result}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create lead: {e}")
            raise
    
    def update_lead(self, lead_id: str, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing lead in Zoho CRM
        
        Args:
            lead_id: Zoho lead ID
            lead_data: Updated lead information
            
        Returns:
            API response from Zoho
        """
        url = f"{self.crm_api_url}/Leads/{lead_id}"
        
        payload = {
            "data": [lead_data]
        }
        
        try:
            headers = self._get_headers()
            response = requests.put(url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"Successfully updated lead {lead_id}: {result}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to update lead {lead_id}: {e}")
            raise
    
    def get_lead(self, lead_id: str) -> Dict[str, Any]:
        """
        Retrieve a lead from Zoho CRM
        
        Args:
            lead_id: Zoho lead ID
            
        Returns:
            Lead data from Zoho
        """
        url = f"{self.crm_api_url}/Leads/{lead_id}"
        
        try:
            headers = self._get_headers()
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"Successfully retrieved lead {lead_id}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get lead {lead_id}: {e}")
            raise
    
    def search_leads(self, search_criteria: Dict[str, Any]) -> Dict[str, Any]:
        """
        Search for leads in Zoho CRM
        
        Args:
            search_criteria: Search parameters
            
        Returns:
            Search results from Zoho
        """
        url = f"{self.crm_api_url}/Leads/search"
        
        try:
            headers = self._get_headers()
            response = requests.post(url, headers=headers, json=search_criteria)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"Successfully searched leads: {len(result.get('data', []))} results")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to search leads: {e}")
            raise
    
    def convert_movedin_data_to_zoho_lead(self, movedin_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert MovedIn application data to Zoho CRM lead format
        
        Args:
            movedin_data: Data from MovedIn application
            
        Returns:
            Formatted data for Zoho CRM
        """
        # Extract contact information
        contact = movedin_data.get('contact', {})
        from_details = movedin_data.get('fromDetails', {})
        to_details = movedin_data.get('toDetails', {})
        selected_quote = movedin_data.get('selectedQuote', {})
        
        # Format move date and time
        move_date = movedin_data.get('date')
        move_time = movedin_data.get('time')
        
        # Combine date and time for Move_Time field
        move_datetime = None
        if move_date and move_time:
            try:
                move_datetime = f"{move_date}T{move_time}:00Z"
            except:
                move_datetime = move_date
        
        # Format heavy items
        heavy_items = from_details.get('heavyItems', {})
        heavy_items_list = []
        if heavy_items.get('piano'):
            heavy_items_list.append('Piano')
        if heavy_items.get('safe'):
            heavy_items_list.append('Safe')
        if heavy_items.get('treadmill'):
            heavy_items_list.append('Treadmill')
        
        # Format additional services
        additional_services = from_details.get('additionalServices', {})
        services_list = []
        if additional_services.get('packing'):
            services_list.append('Packing')
        if additional_services.get('storage'):
            services_list.append('Storage')
        if additional_services.get('cleaning'):
            services_list.append('Cleaning')
        if additional_services.get('junk'):
            services_list.append('Junk Removal')
        
        # Build Zoho lead data
        zoho_lead = {
            "First_Name": contact.get('firstName', ''),
            "Last_Name": contact.get('lastName', ''),
            "Email": contact.get('email', ''),
            "Phone": contact.get('phone', ''),
            "Company": "",  # Optional field
            "Move_Date": move_date,
            "Move_Time": move_datetime,
            "From_Address": movedin_data.get('from', ''),
            "To_Address": movedin_data.get('to', ''),
            "City": "",  # Extract from address if needed
            "State": "",  # Extract from address if needed
            "Country": "Canada",  # Default for Canadian market
            "Zip_Code": "",  # Extract from address if needed
            "Total_Estimate": selected_quote.get('total_cost', 0),
            "Total_amount": selected_quote.get('total_cost', 0),
            "Vendor_name": selected_quote.get('vendor_name', ''),
            "Number_of_Movers": selected_quote.get('crew_size', 0),
            "Estimated_Hours": selected_quote.get('estimated_hours', 0),
            "Travel_time": selected_quote.get('travel_time_hours', 0),
            "heavy_items": ", ".join(heavy_items_list) if heavy_items_list else "",
            "Dispchaer_location": selected_quote.get('dispatcher_info', {}).get('name', ''),
            "Geo_Distance_KM": 0,  # Calculate if needed
            "Payment_Status": "Pending",  # Initial status
            "Booking_Reference": f"MI-{datetime.now().strftime('%Y%m%d')}-{hash(movedin_data.get('from', '')) % 10000:04d}",
            "Lead_Source": "MovedIn Website",
            "Lead_Status": "New",
            "Move_Type": "Residential",  # Default, can be enhanced
            "Packing_Requested": additional_services.get('packing', False),
            "Unpacking_Requested": False,  # Not currently tracked
            "Description": f"Move from {movedin_data.get('from', '')} to {movedin_data.get('to', '')}. "
                          f"Services: {', '.join(services_list) if services_list else 'None'}. "
                          f"Special items: {', '.join(heavy_items_list) if heavy_items_list else 'None'}."
        }
        
        return zoho_lead
    
    def test_connection(self) -> bool:
        """
        Test the connection to Zoho CRM API
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            url = f"{self.crm_api_url}/Leads"
            headers = self._get_headers()
            response = requests.get(url, headers=headers, params={'per_page': 1})
            response.raise_for_status()
            
            logger.info("Zoho CRM connection test successful")
            return True
            
        except Exception as e:
            logger.error(f"Zoho CRM connection test failed: {e}")
            return False

# Global instance
zoho_service = ZohoCRMService() 