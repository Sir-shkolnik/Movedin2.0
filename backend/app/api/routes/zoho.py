"""
Zoho CRM API Routes

This module provides API endpoints for Zoho CRM integration including:
- OAuth authentication flow
- Lead creation and management
- Connection testing
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from typing import Dict, Any, Optional
import logging
from datetime import datetime

from app.services.zoho_service import zoho_service
from app.core.database import get_db
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/zoho", tags=["zoho"])

@router.get("/auth")
async def initiate_oauth(request: Request):
    """
    Initiate OAuth flow with Zoho CRM
    
    Redirects user to Zoho authorization page
    """
    try:
        # Generate state parameter for security
        state = f"movedin_{datetime.now().timestamp()}"
        
        # Store state in session or database for verification
        # For now, we'll use a simple approach
        request.session["zoho_state"] = state
        
        auth_url = zoho_service.get_auth_url(state=state)
        return RedirectResponse(url=auth_url)
        
    except Exception as e:
        logger.error(f"Failed to initiate OAuth: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate OAuth flow")

@router.get("/callback")
async def oauth_callback(
    code: str,
    state: Optional[str] = None,
    request: Request = None
):
    """
    Handle OAuth callback from Zoho
    
    Args:
        code: Authorization code from Zoho
        state: State parameter for security verification
    """
    try:
        # Verify state parameter (implement proper verification)
        # if request and request.session.get("zoho_state") != state:
        #     raise HTTPException(status_code=400, detail="Invalid state parameter")
        
        # Exchange code for token
        token_data = zoho_service.exchange_code_for_token(code)
        
        # Test connection
        if zoho_service.test_connection():
            return {
                "message": "Zoho CRM integration successful",
                "status": "connected",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to test Zoho connection")
            
    except Exception as e:
        logger.error(f"OAuth callback failed: {e}")
        raise HTTPException(status_code=500, detail="OAuth callback failed")

@router.post("/leads/create")
async def create_lead(
    lead_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Create a new lead in Zoho CRM
    
    Args:
        lead_data: Lead information in Zoho format
    """
    try:
        result = zoho_service.create_lead(lead_data)
        return {
            "message": "Lead created successfully",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to create lead: {e}")
        raise HTTPException(status_code=500, detail="Failed to create lead")

@router.post("/leads/create-from-movedin")
async def create_lead_from_movedin(
    movedin_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Create a lead in Zoho CRM from MovedIn application data
    
    Args:
        movedin_data: Data from MovedIn application
    """
    try:
        # Convert MovedIn data to Zoho format
        zoho_lead_data = zoho_service.convert_movedin_data_to_zoho_lead(movedin_data)
        
        # Create lead in Zoho
        result = zoho_service.create_lead(zoho_lead_data)
        
        return {
            "message": "Lead created successfully from MovedIn data",
            "data": result,
            "movedin_data": movedin_data,
            "zoho_data": zoho_lead_data,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to create lead from MovedIn data: {e}")
        raise HTTPException(status_code=500, detail="Failed to create lead")

@router.put("/leads/{lead_id}")
async def update_lead(
    lead_id: str,
    lead_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Update an existing lead in Zoho CRM
    
    Args:
        lead_id: Zoho lead ID
        lead_data: Updated lead information
    """
    try:
        result = zoho_service.update_lead(lead_id, lead_data)
        return {
            "message": "Lead updated successfully",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to update lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update lead")

@router.get("/leads/{lead_id}")
async def get_lead(
    lead_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve a lead from Zoho CRM
    
    Args:
        lead_id: Zoho lead ID
    """
    try:
        result = zoho_service.get_lead(lead_id)
        return {
            "message": "Lead retrieved successfully",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve lead")

@router.post("/leads/search")
async def search_leads(
    search_criteria: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Search for leads in Zoho CRM
    
    Args:
        search_criteria: Search parameters
    """
    try:
        result = zoho_service.search_leads(search_criteria)
        return {
            "message": "Leads search completed",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to search leads: {e}")
        raise HTTPException(status_code=500, detail="Failed to search leads")

@router.get("/test-connection")
async def test_zoho_connection():
    """
    Test the connection to Zoho CRM API
    """
    try:
        is_connected = zoho_service.test_connection()
        
        if is_connected:
            return {
                "message": "Zoho CRM connection successful",
                "status": "connected",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Zoho CRM connection failed")
            
    except Exception as e:
        logger.error(f"Zoho connection test failed: {e}")
        raise HTTPException(status_code=500, detail="Connection test failed")

@router.post("/refresh-token")
async def refresh_zoho_token():
    """
    Manually refresh the Zoho access token
    """
    try:
        success = zoho_service.refresh_access_token()
        
        if success:
            return {
                "message": "Token refreshed successfully",
                "status": "refreshed",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Token refresh failed")
            
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(status_code=500, detail="Token refresh failed")

@router.get("/status")
async def get_zoho_status():
    """
    Get the current status of Zoho CRM integration
    """
    try:
        # Check if credentials are configured
        has_credentials = all([
            zoho_service.client_id,
            zoho_service.client_secret,
            zoho_service.redirect_uri
        ])
        
        # Check if we have a valid token
        has_token = zoho_service.access_token is not None
        
        # Test connection if we have credentials and token
        is_connected = False
        if has_credentials and has_token:
            is_connected = zoho_service.test_connection()
        
        return {
            "credentials_configured": has_credentials,
            "has_access_token": has_token,
            "is_connected": is_connected,
            "status": "connected" if is_connected else "disconnected" if has_credentials else "not_configured",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get Zoho status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get status") 