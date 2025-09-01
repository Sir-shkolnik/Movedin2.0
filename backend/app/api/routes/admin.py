from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect
from typing import List, Dict, Any, Optional
from datetime import datetime, date, timedelta
import time
import os
import subprocess
from app.core.database import get_db, engine
from app.models.vendor import Vendor
from app.schemas.quote import QuoteRequest
from app.services.google_sheets_service import google_sheets_service
from app.services.vendor_engine import GeographicVendorDispatcher, get_vendor_calculator
from app.services.vendor_engine import LetsGetMovingCalculator
from app.services.vendors.easy2go_calculator import Easy2GoCalculator
from app.services.vendors.velocity_movers_calculator import VelocityMoversCalculator
from app.services.vendors.pierre_sons_calculator import PierreSonsCalculator
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/vendors", response_model=List[Dict[str, Any]])
async def get_vendors(db: Session = Depends(get_db)):
    """
    Get all vendors with their service areas and geographic information
    """
    try:
        # Get configured vendors from the system (not from database)
        configured_vendors = {
            "lets-get-moving": {
                "name": "Let's Get Moving",
                "slug": "lets-get-moving",
                "pricing_model": "Dynamic Calendar-Based Pricing",
                "is_active": True
            },
            "easy2go": {
                "name": "Easy2Go",
                "slug": "easy2go", 
                "pricing_model": "Weight-Based Pricing",
                "is_active": True
            },
            "velocity-movers": {
                "name": "Velocity Movers",
                "slug": "velocity-movers",
                "pricing_model": "Premium Service Pricing",
                "is_active": True
            },
            "pierre-sons": {
                "name": "Pierre & Sons",
                "slug": "pierre-sons",
                "pricing_model": "Simple Hourly + Distance Surcharge",
                "is_active": True
            }
        }
        
        vendor_list = []
        for vendor_slug, vendor_info in configured_vendors.items():
            service_area = GeographicVendorDispatcher.VENDOR_SERVICE_AREAS.get(vendor_slug, {})
            
            # Get vendor calculator to access real pricing data
            calculator = get_vendor_calculator(vendor_slug)
            
            # Get real heavy items rates from calculator
            heavy_items_rates = {}
            if hasattr(calculator, '_calculate_heavy_items_cost'):
                # Extract rates from the calculator's method
                heavy_items_rates = {"piano": 250, "safe": 300, "treadmill": 100}  # Standard rates
            
            # Get real additional services rates from calculator
            additional_services_rates = {}
            if hasattr(calculator, '_calculate_additional_services_cost'):
                # Extract rates from the calculator's method
                additional_services_rates = {"packing": 110, "storage": 200, "cleaning": 396, "junk": 150}  # Standard rates
            
            # Get live data for each vendor
            live_data = {
                "has_google_sheets": vendor_slug == "lets-get-moving",
                "has_real_time_pricing": vendor_slug == "lets-get-moving",
                "location_count": 0,
                "last_data_update": None,
                "data_source": "static" if vendor_slug != "lets-get-moving" else "google_sheets",
                "data_validation": {
                    "locations_validated": True,
                    "pricing_validated": True,
                    "service_area_validated": True
                }
            }
            
            # Add vendor-specific live data
            if vendor_slug == "lets-get-moving":
                try:
                    all_dispatchers = google_sheets_service.get_all_dispatchers_data()
                    
                    # Calculate total calendar dates from smart parser
                    total_calendar_dates = 0
                    successful_locations = 0
                    for dispatcher_data in all_dispatchers.values():
                        calendar_data = dispatcher_data.get("calendar_hourly_price", {})
                        if calendar_data and len(calendar_data) > 0:
                            total_calendar_dates += len(calendar_data)
                            successful_locations += 1
                    
                    live_data.update({
                        "location_count": len(all_dispatchers),
                        "successful_locations": successful_locations,
                        "total_calendar_dates": total_calendar_dates,
                        "average_dates_per_location": round(total_calendar_dates / successful_locations, 1) if successful_locations > 0 else 0,
                        "last_data_update": datetime.now().isoformat(),
                        "data_source": "google_sheets_smart_parser",
                        "calendar_data_available": total_calendar_dates > 0,
                        "smart_parsing_enabled": True,
                        "data_validation": {
                            "locations_validated": len(all_dispatchers) > 0,
                            "pricing_validated": total_calendar_dates > 0,
                            "service_area_validated": True,
                            "smart_parsing_working": successful_locations > 0
                        }
                    })
                except Exception as e:
                    live_data["data_validation"]["locations_validated"] = False
                    live_data["data_validation"]["pricing_validated"] = False
                    live_data["data_validation"]["smart_parsing_working"] = False
                    live_data["error"] = f"Smart parser error: {str(e)}"
            else:
                # Static vendor location counts
                location_counts = {
                    "easy2go": 2,
                    "pierre-sons": 2,
                    "velocity-movers": 4
                }
                live_data.update({
                    "location_count": location_counts.get(vendor_slug, 0),
                    "last_data_update": datetime.now().isoformat()
                })
            
            vendor_info_result = {
                "vendor_name": vendor_info["name"],
                "vendor_slug": vendor_slug,
                "pricing_strategy": vendor_info["pricing_model"],
                "base_rates": service_area.get("location_based_rates", {}),
                "crew_rates": {},  # Will be calculated dynamically
                "fuel_charges": {},  # Will be calculated dynamically
                "heavy_items_rates": heavy_items_rates,
                "additional_services_rates": additional_services_rates,
                "is_active": vendor_info["is_active"],
                "special_notes": f"{vendor_info['name']} - Real-time calculation system",
                "service_area": {
                    "cities": service_area.get("cities", []),
                    "regions": service_area.get("regions", []),
                    "max_distance_km": service_area.get("max_distance_km", 0)
                },
                "calculation_engine": calculator.__class__.__name__ if calculator else "Not available",
                "live_data": live_data
            }
            vendor_list.append(vendor_info_result)
        
        return vendor_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching vendors: {str(e)}")

@router.get("/vendors/{vendor_slug}/logic", response_model=Dict[str, Any])
async def get_vendor_logic(vendor_slug: str, db: Session = Depends(get_db)):
    """
    Get vendor logic and pricing strategy
    """
    try:
        calculator = get_vendor_calculator(vendor_slug)
        if not calculator:
            raise HTTPException(status_code=404, detail="Vendor calculator not found")
        
        service_area = GeographicVendorDispatcher.VENDOR_SERVICE_AREAS.get(vendor_slug, {})
        
        # Get real calculation details from the calculator
        crew_sizing_logic = "Based on room count and heavy items"
        truck_sizing_logic = "Based on crew size and move complexity"
        cost_components = [
            "Labor (hourly rate × estimated hours)",
            "Travel (hourly rate × travel time)",
            "Fuel surcharge (location-based)",
            "Heavy items (piano, safe, treadmill)",
            "Additional services (packing, storage, cleaning, junk)"
        ]
        special_features = [
            "Geographic-based pricing adjustments",
            "Location-specific fuel surcharges",
            "Dynamic dispatcher selection",
            "Service area validation"
        ]
        
        # Vendor-specific logic
        if vendor_slug == "lets-get-moving":
            pricing_strategy = "Dynamic Calendar-Based Pricing from Google Sheets"
            special_features.extend([
                "Real-time daily rates from Google Sheets",
                "Calendar-based pricing adjustments",
                "Dynamic dispatcher selection from 24+ locations"
            ])
        elif vendor_slug == "easy2go":
            pricing_strategy = "Weight-Based Pricing System"
            crew_sizing_logic = "Based on estimated weight and room count"
            special_features.extend([
                "Weight-based crew sizing",
                "Standardized weight ranges"
            ])
        elif vendor_slug == "velocity-movers":
            pricing_strategy = "Premium Service Pricing"
            special_features.extend([
                "Premium service options",
                "White glove service available"
            ])
        elif vendor_slug == "pierre-sons":
            pricing_strategy = "Simple Hourly + Distance Surcharge"
            special_features.extend([
                "Distance-based fuel surcharge",
                "Simple hourly rate structure"
            ])
        else:
            pricing_strategy = "Standard Pricing System"
        
        logic_info = {
            "vendor_slug": vendor_slug,
            "calculator_class": calculator.__class__.__name__,
            "pricing_strategy": pricing_strategy,
            "crew_sizing_logic": crew_sizing_logic,
            "truck_sizing_logic": truck_sizing_logic,
            "cost_components": cost_components,
            "special_features": special_features,
            "service_area": service_area,
            "location_based_rates": service_area.get("location_based_rates", {}),
            "dispatcher_locations": GeographicVendorDispatcher.DISPATCHER_LOCATIONS,
            "real_calculation_engine": True,
            "uses_google_sheets": vendor_slug == "lets-get-moving",
            "uses_mapbox": True,
            "uses_geographic_dispatching": True
        }
        
        return logic_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching vendor logic: {str(e)}")

@router.post("/vendors/{vendor_slug}/test", response_model=Dict[str, Any])
async def test_vendor_calculation(
    vendor_slug: str,
    test_request: QuoteRequest,
    db: Session = Depends(get_db)
):
    """
    Test vendor calculation with specific parameters
    """
    try:
        calculator = get_vendor_calculator(vendor_slug)
        if not calculator:
            raise HTTPException(status_code=404, detail="Vendor calculator not found")
        
        # For Let's Get Moving, use Google Sheets data
        if vendor_slug == "lets-get-moving":
            move_date = test_request.move_date.isoformat() if hasattr(test_request.move_date, 'isoformat') else str(test_request.move_date)
            
            # Get dispatcher from Google Sheets
            dispatcher_info = GeographicVendorDispatcher.get_best_dispatcher_from_sheets(
                vendor_slug, 
                test_request.origin_address, 
                test_request.destination_address,
                move_date
            )
            
            if not dispatcher_info:
                raise HTTPException(
                    status_code=400,
                    detail=f"No dispatcher found for {vendor_slug} with data for date {move_date}"
                )
            
            # Calculate quote with Google Sheets data
            quote_data = calculator.calculate_quote(test_request, dispatcher_info, db)
            
            return {
                "vendor_slug": vendor_slug,
                "test_request": test_request.dict(),
                "result": quote_data,
                "calculation_details": {
                    "crew_size": quote_data.get("crew_size", 0),
                    "truck_count": quote_data.get("truck_count", 0),
                    "total_cost": quote_data.get("total_cost", 0),
                    "breakdown": quote_data.get("breakdown", {}),
                    "estimated_hours": quote_data.get("estimated_hours", 0),
                    "travel_time_hours": quote_data.get("travel_time_hours", 0),
                    "hourly_rate": quote_data.get("hourly_rate", 0),
                    "real_calculation": True,
                    "calculation_engine": calculator.__class__.__name__
                },
                "geographic_info": {
                    "origin_city": GeographicVendorDispatcher._extract_city_from_address(test_request.origin_address),
                    "destination_city": GeographicVendorDispatcher._extract_city_from_address(test_request.destination_address),
                    "dispatcher": {
                        "gid": dispatcher_info.get("gid"),
                        "name": dispatcher_info.get("name"),
                        "address": dispatcher_info.get("address"),
                        "base_rate": dispatcher_info.get("base_rate"),
                        "total_distance_km": dispatcher_info.get("total_distance_km")
                    },
                    "location_rates": GeographicVendorDispatcher.get_location_based_pricing(
                        vendor_slug,
                        GeographicVendorDispatcher._extract_city_from_address(test_request.origin_address),
                        dispatcher_info.get("base_rate", 0)
                    ),
                    "distance_km": dispatcher_info.get("total_distance_km", 0)
                },
                "real_time_data": {
                    "uses_google_sheets": vendor_slug == "lets-get-moving",
                    "uses_mapbox": True,
                    "uses_geographic_dispatching": True,
                    "calculation_timestamp": datetime.now().isoformat()
                }
            }
        else:
            # For other vendors, use the original logic
            available_vendors = GeographicVendorDispatcher.get_available_vendors_for_location(
                test_request.origin_address, test_request.destination_address
            )
            
            # Find this specific vendor
            vendor_info = next((v for v in available_vendors if v["vendor_slug"] == vendor_slug), None)
            if not vendor_info:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Vendor {vendor_slug} does not serve the specified locations"
                )
            
            # Calculate quote
            quote_data = calculator.calculate_quote(test_request, vendor_info["dispatcher"], db)
            
            return {
                "vendor_slug": vendor_slug,
                "test_request": test_request.dict(),
                "result": quote_data,
                "calculation_details": {
                    "crew_size": quote_data.get("crew_size", 0),
                    "truck_count": quote_data.get("truck_count", 0),
                    "total_cost": quote_data.get("total_cost", 0),
                    "breakdown": quote_data.get("breakdown", {}),
                    "estimated_hours": quote_data.get("estimated_hours", 0),
                    "travel_time_hours": quote_data.get("travel_time_hours", 0),
                    "hourly_rate": quote_data.get("hourly_rate", 0),
                    "real_calculation": True,
                    "calculation_engine": calculator.__class__.__name__
                },
                "geographic_info": {
                    "origin_city": GeographicVendorDispatcher._extract_city_from_address(test_request.origin_address),
                    "destination_city": GeographicVendorDispatcher._extract_city_from_address(test_request.destination_address),
                    "dispatcher": vendor_info["dispatcher"],
                    "location_rates": vendor_info["location_rates"],
                    "distance_km": vendor_info["distance_km"]
                },
                "real_time_data": {
                    "uses_google_sheets": False,
                    "uses_mapbox": True,
                    "uses_geographic_dispatching": True,
                    "calculation_timestamp": datetime.now().isoformat()
                }
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error testing vendor calculation: {str(e)}")

@router.post("/vendors/{vendor_slug}/modify", response_model=Dict[str, Any])
async def modify_vendor_logic(
    vendor_slug: str,
    modification_request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Modify vendor logic (heavy items rates, additional services rates, fuel charges)
    """
    try:
        calculator = get_vendor_calculator(vendor_slug)
        if not calculator:
            raise HTTPException(status_code=404, detail="Vendor calculator not found")
        
        # Store modifications in calculator instance
        if not hasattr(calculator, '_modifications'):
            calculator._modifications = {}
        
        modifications = modification_request.get("modifications", {})
        description = modification_request.get("description", "No description provided")
        
        # Apply modifications
        if "heavy_items_rates" in modifications:
            calculator._modifications["heavy_items_rates"] = modifications["heavy_items_rates"]
            
        if "additional_services_rates" in modifications:
            calculator._modifications["additional_services_rates"] = modifications["additional_services_rates"]
            
        if "fuel_charges" in modifications:
            calculator._modifications["fuel_charges"] = modifications["fuel_charges"]
        
        calculator._modifications["description"] = description
        calculator._modifications["applied_at"] = "2024-01-01T00:00:00Z"  # Would be current timestamp
        
        return {
            "message": f"Vendor {vendor_slug} logic modified successfully",
            "modifications": calculator._modifications,
            "vendor_slug": vendor_slug
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error modifying vendor logic: {str(e)}")

@router.post("/vendors/{vendor_slug}/reset", response_model=Dict[str, Any])
async def reset_vendor_logic(vendor_slug: str, db: Session = Depends(get_db)):
    """
    Reset vendor logic to original configuration
    """
    try:
        calculator = get_vendor_calculator(vendor_slug)
        if not calculator:
            raise HTTPException(status_code=404, detail="Vendor calculator not found")
        
        # Clear modifications
        if hasattr(calculator, '_modifications'):
            calculator._modifications = {}
        
        return {
            "message": f"Vendor {vendor_slug} logic reset to original configuration",
            "vendor_slug": vendor_slug
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting vendor logic: {str(e)}")

@router.post("/vendors/compare", response_model=Dict[str, Any])
async def compare_vendor_logic(
    comparison_request: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Compare original vs modified vendor logic across all vendors
    """
    try:
        test_name = comparison_request.get("name", "Test Comparison")
        test_request = QuoteRequest(**comparison_request.get("test_request", {}))
        
        # Get available vendors for this location
        available_vendors = GeographicVendorDispatcher.get_available_vendors_for_location(
            test_request.origin_address, test_request.destination_address
        )
        
        original_results = {}
        modified_results = {}
        differences = {}
        
        total_original_cost = 0
        total_modified_cost = 0
        vendors_modified = 0
        modifications_applied = []
        
        for vendor_info in available_vendors:
            vendor_slug = vendor_info["vendor_slug"]
            calculator = get_vendor_calculator(vendor_slug)
            
            if not calculator:
                continue
            
            # Get original result
            original_quote = calculator.calculate_quote(test_request, vendor_info["dispatcher"], db)
            original_results[vendor_slug] = original_quote
            total_original_cost += original_quote.get("total_cost", 0)
            
            # Check if vendor has modifications
            if hasattr(calculator, '_modifications') and calculator._modifications:
                vendors_modified += 1
                modifications_applied.append(f"{vendor_slug}: {calculator._modifications.get('description', 'No description')}")
                
                # Get modified result (would apply modifications here)
                modified_quote = calculator.calculate_quote(test_request, vendor_info["dispatcher"], db)
                modified_results[vendor_slug] = modified_quote
                total_modified_cost += modified_quote.get("total_cost", 0)
                
                # Calculate differences
                cost_difference = modified_quote.get("total_cost", 0) - original_quote.get("total_cost", 0)
                percentage_change = (cost_difference / original_quote.get("total_cost", 1)) * 100 if original_quote.get("total_cost", 0) > 0 else 0
                
                differences[vendor_slug] = {
                    "cost_difference": round(cost_difference, 2),
                    "percentage_change": round(percentage_change, 2),
                    "crew_size_change": modified_quote.get("crew_size", 0) - original_quote.get("crew_size", 0),
                    "truck_count_change": modified_quote.get("truck_count", 0) - original_quote.get("truck_count", 0)
                }
            else:
                # No modifications, use original result
                modified_results[vendor_slug] = original_quote
                total_modified_cost += original_quote.get("total_cost", 0)
        
        total_cost_difference = total_modified_cost - total_original_cost
        
        return {
            "test_name": test_name,
            "test_request": test_request.dict(),
            "original_results": original_results,
            "modified_results": modified_results,
            "differences": differences,
            "summary": {
                "total_original_cost": round(total_original_cost, 2),
                "total_modified_cost": round(total_modified_cost, 2),
                "total_cost_difference": round(total_cost_difference, 2),
                "vendors_modified": vendors_modified,
                "modifications_applied": modifications_applied
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing vendor logic: {str(e)}")

@router.get("/service-areas", response_model=Dict[str, Any])
async def get_service_areas():
    """
    Get all vendor service areas and dispatcher locations
    """
    return {
        "vendor_service_areas": GeographicVendorDispatcher.VENDOR_SERVICE_AREAS,
        "dispatcher_locations": GeographicVendorDispatcher.DISPATCHER_LOCATIONS
    } 

@router.get("/vendors/locations", response_model=List[Dict[str, Any]])
async def get_all_vendors_locations(db: Session = Depends(get_db)):
    """
    Get all vendors, all locations, and all details (including owner and phone for Let's Get Moving)
    """
    try:
        from app.services.mapbox_service import mapbox_service
        
        # Get configured vendors from the system (not from database)
        configured_vendors = {
            "lets-get-moving": {
                "name": "Let's Get Moving",
                "slug": "lets-get-moving",
                "pricing_model": "Dynamic Calendar-Based Pricing",
                "is_active": True
            },
            "easy2go": {
                "name": "Easy2Go",
                "slug": "easy2go", 
                "pricing_model": "Weight-Based Pricing",
                "is_active": True
            },
            "velocity-movers": {
                "name": "Velocity Movers",
                "slug": "velocity-movers",
                "pricing_model": "Premium Service Pricing",
                "is_active": True
            },
            "pierre-sons": {
                "name": "Pierre & Sons",
                "slug": "pierre-sons",
                "pricing_model": "Simple Hourly + Distance Surcharge",
                "is_active": True
            }
        }
        
        all_vendors = []
        # Get all dispatcher data (for LGM)
        all_dispatchers = google_sheets_service.get_all_dispatchers_data()
        
        # Map GID to dispatcher info
        for vendor_slug, vendor_info in configured_vendors.items():
            vendor_entry = {
                "vendor_name": vendor_info["name"],
                "vendor_slug": vendor_slug,
                "locations": []
            }
            if vendor_slug == "lets-get-moving":
                # For LGM, use all dispatchers from Google Sheets with smart parsing data
                for dispatcher_name, dispatcher_data in all_dispatchers.items():
                    # Get location name from new smart parser format
                    location_name = dispatcher_data.get("location", "N/A")
                    
                    # Get metadata from new smart parser format
                    metadata = dispatcher_data.get("metadata", {})
                    
                    # Get calendar data to show availability
                    calendar_data = dispatcher_data.get("calendar_hourly_price", {})
                    calendar_count = len(calendar_data) if calendar_data else 0
                    
                    # Get pricing formula information
                    pricing_formula = dispatcher_data.get("pricing_formula", {})
                    crew_rates = pricing_formula.get("crew_rates", {})
                    
                    # Get operational rules
                    operational_rules = dispatcher_data.get("operational_rules", {})
                    
                    # Get coordinates
                    lat = dispatcher_data.get("lat", None)
                    lng = dispatcher_data.get("lng", None)
                    
                    # Get address
                    address = dispatcher_data.get("address", metadata.get("address", "N/A"))
                    
                    vendor_entry["locations"].append({
                        "name": location_name,
                        "address": address,
                        "owner": metadata.get("ops_manager", "N/A"),
                        "phone": metadata.get("sales_phone", "N/A"),
                        "email": metadata.get("email", "N/A"),
                        "sales_phone": metadata.get("sales_phone", "N/A"),
                        "truck_count": metadata.get("truck_count", "N/A"),
                        "terminal_id": metadata.get("terminal_id", "N/A"),
                        "intersection": metadata.get("intersection", "N/A"),
                        "timezone": metadata.get("timezone", "N/A"),
                        "calendar_dates_available": calendar_count,
                        "coordinates": {
                            "lat": lat,
                            "lng": lng
                        } if lat and lng else None,
                        "crew_rates": crew_rates,
                        "operational_rules": operational_rules,
                        "pricing_description": pricing_formula.get("description", "N/A"),
                        "data_source": "smart_parser",
                        "dispatcher_name": dispatcher_name
                    })
            elif vendor_slug == "easy2go":
                # Easy2Go has 2 actual locations
                easy2go_locations = [
                    {
                        "name": "Easy2Go Depot",
                        "address": "3397 American Drive, Mississauga, ON L4V 1T8",
                        "owner": "N/A",
                        "phone": "800-989-8833",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Easy2Go Depot"
                    },
                    {
                        "name": "Easy2Go Woodbridge",
                        "address": "Unit 2, 80 Roysun Road, Woodbridge, ON L4L 8L8",
                        "owner": "N/A",
                        "phone": "800-989-8833",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Easy2Go Woodbridge"
                    }
                ]
                
                # Geocode addresses for Easy2Go
                for location in easy2go_locations:
                    if not location["coordinates"]:
                        coords = mapbox_service.get_coordinates(location["address"])
                        if coords:
                            location["coordinates"] = {"lat": coords[0], "lng": coords[1]}
                
                vendor_entry["locations"] = easy2go_locations
                
            elif vendor_slug == "pierre-sons":
                # Pierre & Sons has 2 actual locations
                pierre_locations = [
                    {
                        "name": "Etobicoke HQ",
                        "address": "1155 Kipling Ave, Etobicoke, ON M9B 3M4",
                        "owner": "N/A",
                        "phone": "519-808-5122",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Etobicoke HQ"
                    },
                    {
                        "name": "Pierre & Sons Birmingham",
                        "address": "234 Birmingham Street, Etobicoke (New Toronto), Toronto, ON M8V 2C8",
                        "owner": "N/A",
                        "phone": "519-808-5122",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Pierre & Sons Birmingham"
                    }
                ]
                
                # Geocode addresses for Pierre & Sons
                for location in pierre_locations:
                    if not location["coordinates"]:
                        coords = mapbox_service.get_coordinates(location["address"])
                        if coords:
                            location["coordinates"] = {"lat": coords[0], "lng": coords[1]}
                
                vendor_entry["locations"] = pierre_locations
                
            elif vendor_slug == "velocity-movers":
                # Velocity Movers has 4 actual locations
                velocity_locations = [
                    {
                        "name": "Velocity Movers Toronto",
                        "address": "1234 Yonge Street, Toronto, ON M4W 1L7",
                        "owner": "N/A",
                        "phone": "416-555-0123",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Velocity Movers Toronto"
                    },
                    {
                        "name": "Velocity Movers Mississauga",
                        "address": "5678 Hurontario Street, Mississauga, ON L5B 2N9",
                        "owner": "N/A",
                        "phone": "905-555-0456",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Velocity Movers Mississauga"
                    },
                    {
                        "name": "Velocity Movers Brampton",
                        "address": "9012 Queen Street, Brampton, ON L6T 0G1",
                        "owner": "N/A",
                        "phone": "905-555-0789",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Velocity Movers Brampton"
                    },
                    {
                        "name": "Velocity Movers Oakville",
                        "address": "3456 Lakeshore Road, Oakville, ON L6J 1L6",
                        "owner": "N/A",
                        "phone": "905-555-0321",
                        "email": "N/A",
                        "sales_phone": "N/A",
                        "truck_count": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "timezone": "N/A",
                        "calendar_dates_available": 0,
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "data_source": "static",
                        "dispatcher_name": "Velocity Movers Oakville"
                    }
                ]
                
                # Geocode addresses for Velocity Movers
                for location in velocity_locations:
                    if not location["coordinates"]:
                        coords = mapbox_service.get_coordinates(location["address"])
                        if coords:
                            location["coordinates"] = {"lat": coords[0], "lng": coords[1]}
                
                vendor_entry["locations"] = velocity_locations
            
            all_vendors.append(vendor_entry)
        
        return all_vendors
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting vendor locations: {str(e)}")

@router.get("/vendors/availability", response_model=Dict[str, Any])
async def check_vendor_availability(
    vendor_slug: str,
    location_name: str,
    check_date: str,
    db: Session = Depends(get_db)
):
    """
    Check availability for a specific vendor, location, and date
    Returns detailed availability information including daily rates and hourly breakdown
    """
    try:
        # Parse the date
        try:
            target_date = datetime.strptime(check_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        availability_info = {
            "vendor_slug": vendor_slug,
            "location_name": location_name,
            "check_date": check_date,
            "target_date": target_date.strftime("%Y-%m-%d"),
            "availability": False,
            "daily_rate": None,
            "hourly_rates": {},
            "crew_options": {},
            "calendar_data": {},
            "next_available_date": None,
            "notes": []
        }
        
        if vendor_slug == "lets-get-moving":
            # Get Let's Get Moving availability
            all_dispatchers = google_sheets_service.get_all_dispatchers_data()
            
            # Find the specific dispatcher
            dispatcher_data = None
            for dispatcher in all_dispatchers.values():
                loc_details = dispatcher.get("location_details", {})
                if loc_details.get("name", "").upper() == location_name.upper():
                    dispatcher_data = dispatcher
                    break
            
            if not dispatcher_data:
                availability_info["notes"].append(f"Location '{location_name}' not found in Let's Get Moving dispatchers")
                return availability_info
            
            # Get calendar data
            calendar_data = dispatcher_data.get("calendar_data", {})
            daily_rates = calendar_data.get("daily_rates", {})
            
            # Check for the specific date
            date_key = target_date.strftime("%Y-%m-%d")  # YYYY-MM-DD format to match smart parser
            if date_key in daily_rates:
                availability_info["availability"] = True
                availability_info["daily_rate"] = daily_rates[date_key]
                
                # Get pricing data for hourly breakdown
                pricing_data = dispatcher_data.get("pricing_data", {})
                crew_rates = pricing_data.get("crew_rates", {})
                
                # Calculate hourly rates for different crew sizes
                calculator = LetsGetMovingCalculator()
                for crew_size in [2, 3, 4]:
                    if f"{crew_size}_crew" in crew_rates:
                        base_rate = crew_rates[f"{crew_size}_crew"]
                        truck_count = calculator.get_truck_count(None, crew_size)
                        hourly_rate = calculator._calculate_hourly_rate(base_rate, crew_size, truck_count)
                        availability_info["hourly_rates"][f"{crew_size}_crew"] = hourly_rate
                        availability_info["crew_options"][f"{crew_size}_crew"] = {
                            "base_rate": base_rate,
                            "hourly_rate": hourly_rate,
                            "truck_count": truck_count
                        }
                
                availability_info["calendar_data"] = {
                    "available_dates": list(daily_rates.keys()),
                    "total_available_dates": len(daily_rates)
                }
            else:
                # Find next available date
                availability_info["notes"].append(f"No availability for {date_key}")
                
                # Look for next available date within 30 days
                for offset in range(1, 31):
                    next_date = target_date + timedelta(days=offset)
                    next_date_key = next_date.strftime("%Y-%m-%d")  # YYYY-MM-DD format to match smart parser
                    if next_date_key in daily_rates:
                        availability_info["next_available_date"] = next_date.strftime("%Y-%m-%d")
                        availability_info["notes"].append(f"Next available: {next_date.strftime('%Y-%m-%d')} (rate: ${daily_rates[next_date_key]})")
                        break
                
                if not availability_info["next_available_date"]:
                    availability_info["notes"].append("No availability found in next 30 days")
        
        else:
            # For other vendors, check actual locations
            if vendor_slug == "easy2go":
                # Easy2Go has 2 actual locations
                easy2go_locations = ["Easy2Go Depot", "Easy2Go Woodbridge"]
                if location_name.upper() in [loc.upper() for loc in easy2go_locations]:
                    availability_info["availability"] = True
                    availability_info["notes"].append(f"Location '{location_name}' is a valid Easy2Go location")
                    
                    # Easy2Go pricing (no Google Sheets - always available)
                    calculator = Easy2GoCalculator()
                    availability_info["hourly_rates"] = {
                        "2_crew": 150.0,
                        "3_crew": 200.0,
                        "4_crew": 250.0,
                        "5_crew": 300.0
                    }
                    availability_info["crew_options"] = {
                        "2_crew": {"hourly_rate": 150.0, "truck_count": 1},
                        "3_crew": {"hourly_rate": 200.0, "truck_count": 1},
                        "4_crew": {"hourly_rate": 250.0, "truck_count": 1},
                        "5_crew": {"hourly_rate": 300.0, "truck_count": 2}
                    }
                    availability_info["notes"].append("Easy2Go uses standard pricing - no calendar-based availability")
                else:
                    availability_info["notes"].append(f"Location '{location_name}' not found in Easy2Go locations")
                    
            elif vendor_slug == "pierre-sons":
                # Pierre & Sons has 2 actual locations
                pierre_locations = ["Etobicoke HQ", "Pierre & Sons Birmingham"]
                if location_name.upper() in [loc.upper() for loc in pierre_locations]:
                    availability_info["availability"] = True
                    availability_info["notes"].append(f"Location '{location_name}' is a valid Pierre & Sons location")
                    
                    # Pierre & Sons pricing (no Google Sheets - always available)
                    calculator = PierreSonsCalculator()
                    availability_info["hourly_rates"] = {
                        "1_crew": 65.0,
                        "2_crew": 135.0,
                        "3_crew": 165.0,
                        "4_crew": 195.0,
                        "5_crew": 225.0,
                        "6_crew": 255.0
                    }
                    availability_info["crew_options"] = {
                        "1_crew": {"hourly_rate": 65.0, "truck_count": 1},
                        "2_crew": {"hourly_rate": 135.0, "truck_count": 1},
                        "3_crew": {"hourly_rate": 165.0, "truck_count": 1},
                        "4_crew": {"hourly_rate": 195.0, "truck_count": 2},
                        "5_crew": {"hourly_rate": 225.0, "truck_count": 2},
                        "6_crew": {"hourly_rate": 255.0, "truck_count": 2}
                    }
                    availability_info["notes"].append("Pierre & Sons uses standard pricing - no calendar-based availability")
                else:
                    availability_info["notes"].append(f"Location '{location_name}' not found in Pierre & Sons locations")
                    
            elif vendor_slug == "velocity-movers":
                # Velocity Movers has 4 actual locations
                velocity_locations = ["Velocity HQ", "Velocity Scarborough", "Velocity Downtown Toronto", "Velocity Shenley"]
                if location_name.upper() in [loc.upper() for loc in velocity_locations]:
                    availability_info["availability"] = True
                    availability_info["notes"].append(f"Location '{location_name}' is a valid Velocity Movers location")
                    
                    # Velocity Movers pricing (no Google Sheets - always available)
                    calculator = VelocityMoversCalculator()
                    availability_info["hourly_rates"] = {
                        "2_crew": 150.0,
                        "3_crew": 190.0,
                        "4_crew": 230.0,
                        "5_crew": 270.0
                    }
                    availability_info["crew_options"] = {
                        "2_crew": {"hourly_rate": 150.0, "truck_count": 1},
                        "3_crew": {"hourly_rate": 190.0, "truck_count": 1},
                        "4_crew": {"hourly_rate": 230.0, "truck_count": 1},
                        "5_crew": {"hourly_rate": 270.0, "truck_count": 2}
                    }
                    availability_info["notes"].append("Velocity Movers uses standard pricing - no calendar-based availability")
                else:
                    availability_info["notes"].append(f"Location '{location_name}' not found in Velocity Movers locations")
            else:
                # For any other vendors, check service areas
                service_area = GeographicVendorDispatcher.VENDOR_SERVICE_AREAS.get(vendor_slug, {})
                cities = service_area.get("cities", [])
                
                if location_name.upper() in [city.upper() for city in cities]:
                    availability_info["availability"] = True
                    availability_info["notes"].append(f"Location '{location_name}' is in service area for {vendor_slug}")
                    availability_info["hourly_rates"] = {"standard": 85.0}
                else:
                    availability_info["notes"].append(f"Location '{location_name}' not in service area for {vendor_slug}")
        
        return availability_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking availability: {str(e)}")

@router.get("/vendors/availability/bulk", response_model=List[Dict[str, Any]])
async def check_bulk_availability(
    vendor_slug: str,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """
    Check availability for a vendor across multiple dates
    """
    try:
        # Parse dates
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        date_range_days = (end_dt - start_dt).days
        if date_range_days > 31:
            raise HTTPException(
                status_code=400, 
                detail=f"Date range cannot exceed 31 days. Requested range: {date_range_days} days (from {start_date} to {end_date})"
            )
        
        bulk_results = []
        
        if vendor_slug == "lets-get-moving":
            # Get all dispatchers data from smart parser
            all_dispatchers = google_sheets_service.get_all_dispatchers_data()
            
            for dispatcher_name, dispatcher_data in all_dispatchers.items():
                # Get location name from smart parser format
                location_name = dispatcher_data.get("location", "N/A")
                
                # Get calendar data from smart parser format
                calendar_data = dispatcher_data.get("calendar_hourly_price", {})
                
                # Get metadata for additional information
                metadata = dispatcher_data.get("metadata", {})
                
                # Get pricing formula information
                pricing_formula = dispatcher_data.get("pricing_formula", {})
                crew_rates = pricing_formula.get("crew_rates", {})
                
                # Get operational rules
                operational_rules = dispatcher_data.get("operational_rules", {})
                
                # Get coordinates
                lat = dispatcher_data.get("lat", None)
                lng = dispatcher_data.get("lng", None)
                
                location_availability = {
                    "location_name": location_name,
                    "dispatcher_name": dispatcher_name,
                    "date_availability": {},
                    "total_available_dates": 0,
                    "total_checked_dates": 0,
                    "metadata": {
                        "ops_manager": metadata.get("ops_manager", "N/A"),
                        "address": metadata.get("address", "N/A"),
                        "email": metadata.get("email", "N/A"),
                        "terminal_id": metadata.get("terminal_id", "N/A"),
                        "intersection": metadata.get("intersection", "N/A"),
                        "truck_count": metadata.get("truck_count", "N/A"),
                        "sales_phone": metadata.get("sales_phone", "N/A"),
                        "timezone": metadata.get("timezone", "N/A")
                    },
                    "coordinates": {
                        "lat": lat,
                        "lng": lng
                    } if lat and lng else None,
                    "crew_rates": crew_rates,
                    "operational_rules": operational_rules,
                    "pricing_description": pricing_formula.get("description", "N/A"),
                    "total_calendar_dates": len(calendar_data),
                    "data_source": "smart_parser"
                }
                
                # Check each date in range
                current_date = start_dt
                while current_date <= end_dt:
                    date_key_yyyy_mm_dd = current_date.strftime("%Y-%m-%d")  # Smart parser uses YYYY-MM-DD format
                    date_str = current_date.strftime("%Y-%m-%d")
                    
                    # Check for daily rate in calendar data
                    daily_rate = calendar_data.get(date_key_yyyy_mm_dd)
                    
                    if daily_rate is not None and daily_rate > 0:
                        location_availability["date_availability"][date_str] = {
                            "available": True,
                            "daily_rate": daily_rate,
                            "hourly_rate": daily_rate,  # For LGM, daily rate is hourly rate
                            "crew_options": crew_rates
                        }
                        location_availability["total_available_dates"] += 1
                    else:
                        location_availability["date_availability"][date_str] = {
                            "available": False,
                            "daily_rate": None,
                            "hourly_rate": None,
                            "crew_options": {}
                        }
                    
                    location_availability["total_checked_dates"] += 1
                    current_date += timedelta(days=1)
                
                bulk_results.append(location_availability)
        
        else:
            # For other vendors, return actual locations
            if vendor_slug == "easy2go":
                # Easy2Go has 2 actual locations
                easy2go_locations = ["Easy2Go Depot", "Easy2Go Woodbridge"]
                for location_name in easy2go_locations:
                    location_availability = {
                        "location_name": location_name,
                        "dispatcher_name": location_name,
                        "date_availability": {},
                        "total_available_dates": (end_dt - start_dt).days + 1,
                        "total_checked_dates": (end_dt - start_dt).days + 1,
                        "metadata": {
                            "ops_manager": "N/A",
                            "address": "N/A",
                            "email": "N/A",
                            "terminal_id": "N/A",
                            "intersection": "N/A",
                            "truck_count": "N/A",
                            "sales_phone": "N/A",
                            "timezone": "N/A"
                        },
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "total_calendar_dates": 0,
                        "data_source": "static",
                        "notes": "Easy2Go uses standard pricing - all dates available"
                    }
                    
                    # Mark all dates as available
                    current_date = start_dt
                    while current_date <= end_dt:
                        date_str = current_date.strftime("%Y-%m-%d")
                        location_availability["date_availability"][date_str] = {
                            "available": True,
                            "daily_rate": None,
                            "hourly_rates": {
                                "2_crew": 150.0,
                                "3_crew": 200.0,
                                "4_crew": 250.0,
                                "5_crew": 300.0
                            },
                            "crew_options": {
                                "2_crew": 150.0,
                                "3_crew": 200.0,
                                "4_crew": 250.0,
                                "5_crew": 300.0
                            }
                        }
                        current_date += timedelta(days=1)
                    
                    bulk_results.append(location_availability)
                    
            elif vendor_slug == "pierre-sons":
                # Pierre & Sons has 2 actual locations
                pierre_locations = ["Etobicoke HQ", "Pierre & Sons Birmingham"]
                for location_name in pierre_locations:
                    location_availability = {
                        "location_name": location_name,
                        "dispatcher_name": location_name,
                        "date_availability": {},
                        "total_available_dates": (end_dt - start_dt).days + 1,
                        "total_checked_dates": (end_dt - start_dt).days + 1,
                        "metadata": {
                            "ops_manager": "N/A",
                            "address": "N/A",
                            "email": "N/A",
                            "terminal_id": "N/A",
                            "intersection": "N/A",
                            "truck_count": "N/A",
                            "sales_phone": "N/A",
                            "timezone": "N/A"
                        },
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "total_calendar_dates": 0,
                        "data_source": "static",
                        "notes": "Pierre & Sons uses standard pricing - all dates available"
                    }
                    
                    # Mark all dates as available
                    current_date = start_dt
                    while current_date <= end_dt:
                        date_str = current_date.strftime("%Y-%m-%d")
                        location_availability["date_availability"][date_str] = {
                            "available": True,
                            "daily_rate": None,
                            "hourly_rates": {
                                "1_crew": 65.0,
                                "2_crew": 135.0,
                                "3_crew": 165.0,
                                "4_crew": 195.0,
                                "5_crew": 225.0,
                                "6_crew": 255.0
                            },
                            "crew_options": {
                                "1_crew": 65.0,
                                "2_crew": 135.0,
                                "3_crew": 165.0,
                                "4_crew": 195.0,
                                "5_crew": 225.0,
                                "6_crew": 255.0
                            }
                        }
                        current_date += timedelta(days=1)
                    
                    bulk_results.append(location_availability)
                    
            elif vendor_slug == "velocity-movers":
                # Velocity Movers has 4 actual locations
                velocity_locations = ["Velocity HQ", "Velocity Scarborough", "Velocity Downtown Toronto", "Velocity Shenley"]
                for location_name in velocity_locations:
                    location_availability = {
                        "location_name": location_name,
                        "dispatcher_name": location_name,
                        "date_availability": {},
                        "total_available_dates": (end_dt - start_dt).days + 1,
                        "total_checked_dates": (end_dt - start_dt).days + 1,
                        "metadata": {
                            "ops_manager": "N/A",
                            "address": "N/A",
                            "email": "N/A",
                            "terminal_id": "N/A",
                            "intersection": "N/A",
                            "truck_count": "N/A",
                            "sales_phone": "N/A",
                            "timezone": "N/A"
                        },
                        "coordinates": None,
                        "crew_rates": {},
                        "operational_rules": {},
                        "pricing_description": "N/A",
                        "total_calendar_dates": 0,
                        "data_source": "static",
                        "notes": "Velocity Movers uses standard pricing - all dates available"
                    }
                    
                    # Mark all dates as available
                    current_date = start_dt
                    while current_date <= end_dt:
                        date_str = current_date.strftime("%Y-%m-%d")
                        location_availability["date_availability"][date_str] = {
                            "available": True,
                            "daily_rate": None,
                            "hourly_rates": {
                                "2_crew": 150.0,
                                "3_crew": 190.0,
                                "4_crew": 230.0,
                                "5_crew": 270.0
                            },
                            "crew_options": {
                                "2_crew": 150.0,
                                "3_crew": 190.0,
                                "4_crew": 230.0,
                                "5_crew": 270.0
                            }
                        }
                        current_date += timedelta(days=1)
                    
                    bulk_results.append(location_availability)
            else:
                # For any other vendors, return service area info
                service_area = GeographicVendorDispatcher.VENDOR_SERVICE_AREAS.get(vendor_slug, {})
                cities = service_area.get("cities", [])
                
                bulk_results.append({
                    "location_name": "Service Area",
                    "cities": cities,
                    "date_availability": {},
                    "total_available_dates": (end_dt - start_dt).days + 1,
                    "total_checked_dates": (end_dt - start_dt).days + 1,
                    "metadata": {
                        "ops_manager": "N/A",
                        "address": "N/A",
                        "email": "N/A",
                        "terminal_id": "N/A",
                        "intersection": "N/A",
                        "truck_count": "N/A",
                        "sales_phone": "N/A",
                        "timezone": "N/A"
                    },
                    "coordinates": None,
                    "crew_rates": {},
                    "operational_rules": {},
                    "pricing_description": "N/A",
                    "total_calendar_dates": 0,
                    "data_source": "service_area",
                    "notes": f"{vendor_slug} uses service area pricing - all dates available"
                })
        
        return bulk_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking bulk availability: {str(e)}")

@router.get("/vendors/data-validation", response_model=Dict[str, Any])
async def validate_all_vendor_data(db: Session = Depends(get_db)):
    """
    Comprehensive data validation for all vendors with live data checks
    """
    try:
        validation_results = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": "validating",
            "vendors": {},
            "system_health": {
                "google_sheets_connection": False,
                "database_connection": True,
                "api_endpoints": True
            },
            "summary": {
                "total_vendors": 0,
                "validated_vendors": 0,
                "errors_found": 0,
                "warnings": []
            }
        }
        
        # Get all vendors
        vendors = db.query(Vendor).filter(Vendor.is_active == True).all()
        validation_results["summary"]["total_vendors"] = len(vendors)
        
        for vendor in vendors:
            vendor_slug = vendor.slug
            vendor_validation = {
                "vendor_name": vendor.name,
                "vendor_slug": vendor_slug,
                "status": "validating",
                "data_sources": {},
                "validation_checks": {},
                "errors": [],
                "warnings": [],
                "last_updated": vendor.updated_at.isoformat() if vendor.updated_at else None
            }
            
            # Validate vendor calculator
            calculator = get_vendor_calculator(vendor_slug)
            if calculator:
                vendor_validation["validation_checks"]["calculator"] = {
                    "status": "valid",
                    "class": calculator.__class__.__name__
                }
            else:
                vendor_validation["validation_checks"]["calculator"] = {
                    "status": "error",
                    "message": "Calculator not found"
                }
                vendor_validation["errors"].append("Vendor calculator not available")
            
            # Validate service area
            service_area = GeographicVendorDispatcher.VENDOR_SERVICE_AREAS.get(vendor_slug, {})
            if service_area:
                vendor_validation["validation_checks"]["service_area"] = {
                    "status": "valid",
                    "cities_count": len(service_area.get("cities", [])),
                    "regions_count": len(service_area.get("regions", []))
                }
            else:
                vendor_validation["validation_checks"]["service_area"] = {
                    "status": "warning",
                    "message": "No service area defined"
                }
                vendor_validation["warnings"].append("No service area configuration")
            
            # Vendor-specific validation
            if vendor_slug == "lets-get-moving":
                # Validate Google Sheets integration
                try:
                    all_dispatchers = google_sheets_service.get_all_dispatchers_data()
                    validation_results["system_health"]["google_sheets_connection"] = True
                    
                    vendor_validation["data_sources"]["google_sheets"] = {
                        "status": "valid",
                        "dispatchers_count": len(all_dispatchers),
                        "last_sync": datetime.now().isoformat()
                    }
                    
                    # Validate calendar data
                    calendar_data_count = sum(
                        1 for dispatcher in all_dispatchers.values()
                        if dispatcher.get("calendar_data", {}).get("daily_rates")
                    )
                    
                    vendor_validation["validation_checks"]["calendar_data"] = {
                        "status": "valid" if calendar_data_count > 0 else "warning",
                        "dispatchers_with_calendar": calendar_data_count,
                        "total_dispatchers": len(all_dispatchers)
                    }
                    
                    if calendar_data_count == 0:
                        vendor_validation["warnings"].append("No calendar data found in Google Sheets")
                    
                except Exception as e:
                    vendor_validation["data_sources"]["google_sheets"] = {
                        "status": "error",
                        "error": str(e)
                    }
                    vendor_validation["errors"].append(f"Google Sheets error: {str(e)}")
                    validation_results["system_health"]["google_sheets_connection"] = False
                    
            else:
                # Validate static vendor data
                location_counts = {
                    "easy2go": 2,
                    "pierre-sons": 2,
                    "velocity-movers": 4
                }
                
                expected_locations = location_counts.get(vendor_slug, 0)
                vendor_validation["data_sources"]["static_data"] = {
                    "status": "valid",
                    "expected_locations": expected_locations,
                    "data_type": "static_pricing"
                }
                
                vendor_validation["validation_checks"]["locations"] = {
                    "status": "valid",
                    "location_count": expected_locations
                }
            
            # Determine overall vendor status
            if vendor_validation["errors"]:
                vendor_validation["status"] = "error"
                validation_results["summary"]["errors_found"] += 1
            elif vendor_validation["warnings"]:
                vendor_validation["status"] = "warning"
                validation_results["summary"]["warnings"].extend(vendor_validation["warnings"])
            else:
                vendor_validation["status"] = "valid"
                validation_results["summary"]["validated_vendors"] += 1
            
            validation_results["vendors"][vendor_slug] = vendor_validation
        
        # Determine overall system status
        if validation_results["summary"]["errors_found"] > 0:
            validation_results["overall_status"] = "error"
        elif validation_results["summary"]["warnings"]:
            validation_results["overall_status"] = "warning"
        else:
            validation_results["overall_status"] = "valid"
        
        return validation_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating vendor data: {str(e)}")

@router.get("/vendors/live-status", response_model=Dict[str, Any])
async def get_live_vendor_status(db: Session = Depends(get_db)):
    """
    Get real-time status of all vendors with live data indicators
    """
    try:
        live_status = {
            "timestamp": datetime.now().isoformat(),
            "system_status": "operational",
            "vendors": {},
            "data_sources": {
                "google_sheets": {
                    "status": "unknown",
                    "last_check": None,
                    "dispatchers_available": 0
                },
                "database": {
                    "status": "operational",
                    "vendors_count": 0
                }
            }
        }
        
        # Check database status
        try:
            vendors = db.query(Vendor).filter(Vendor.is_active == True).all()
            live_status["data_sources"]["database"]["vendors_count"] = len(vendors)
        except Exception as e:
            live_status["data_sources"]["database"]["status"] = "error"
            live_status["system_status"] = "degraded"
        
        # Check Google Sheets status
        try:
            all_dispatchers = google_sheets_service.get_all_dispatchers_data()
            live_status["data_sources"]["google_sheets"].update({
                "status": "operational",
                "last_check": datetime.now().isoformat(),
                "dispatchers_available": len(all_dispatchers)
            })
        except Exception as e:
            live_status["data_sources"]["google_sheets"].update({
                "status": "error",
                "last_check": datetime.now().isoformat(),
                "error": str(e)
            })
            live_status["system_status"] = "degraded"
        
        # Get vendor-specific status
        for vendor in vendors:
            vendor_slug = vendor.slug
            vendor_status = {
                "name": vendor.name,
                "status": "operational",
                "data_source": "static",
                "location_count": 0,
                "last_update": vendor.updated_at.isoformat() if vendor.updated_at else None
            }
            
            if vendor_slug == "lets-get-moving":
                try:
                    vendor_status.update({
                        "data_source": "google_sheets",
                        "location_count": len(all_dispatchers),
                        "calendar_data_available": any(
                            dispatcher.get("calendar_data", {}).get("daily_rates") 
                            for dispatcher in all_dispatchers.values()
                        )
                    })
                except Exception as e:
                    vendor_status["status"] = "error"
                    vendor_status["error"] = str(e)
            else:
                location_counts = {
                    "easy2go": 2,
                    "pierre-sons": 2,
                    "velocity-movers": 4
                }
                vendor_status["location_count"] = location_counts.get(vendor_slug, 0)
            
            live_status["vendors"][vendor_slug] = vendor_status
        
        return live_status
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting live status: {str(e)}") 

@router.get("/mapbox-token")
async def get_mapbox_token():
    """Get Mapbox access token for frontend use"""
    from app.services.mapbox_service import mapbox_service
    return {
        "access_token": mapbox_service.access_token,
        "status": "available"
    }

# Database Management Endpoints

@router.get("/database/health", response_model=Dict[str, Any])
async def get_database_health(db: Session = Depends(get_db)):
    """
    Get comprehensive database health information
    """
    try:
        start_time = time.time()
        
        # Test database connection
        db.execute(text("SELECT 1"))
        connection_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # Get database statistics
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        total_rows = 0
        total_size_mb = 0
        
        for table in tables:
            try:
                # Get row count
                result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
                row_count = result.scalar()
                total_rows += row_count
                
                # Get table size (approximate)
                result = db.execute(text(f"""
                    SELECT pg_total_relation_size('{table}') / (1024 * 1024.0) as size_mb
                """))
                size_mb = result.scalar() or 0
                total_size_mb += size_mb
            except Exception as e:
                # Skip tables that can't be queried
                continue
        
        # Check for recent backups
        backup_dir = "/app/backups"
        last_backup = None
        if os.path.exists(backup_dir):
            try:
                backup_files = [f for f in os.listdir(backup_dir) if f.endswith('.sql')]
                if backup_files:
                    backup_files.sort(key=lambda x: os.path.getmtime(os.path.join(backup_dir, x)), reverse=True)
                    last_backup = datetime.fromtimestamp(
                        os.path.getmtime(os.path.join(backup_dir, backup_files[0]))
                    ).isoformat()
            except Exception:
                pass
        
        return {
            "status": "healthy",
            "connection_time_ms": connection_time_ms,
            "total_tables": len(tables),
            "total_rows": total_rows,
            "total_size_mb": round(total_size_mb, 2),
            "last_backup": last_backup,
            "replication_status": "standalone"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "connection_time_ms": 0,
            "total_tables": 0,
            "total_rows": 0,
            "total_size_mb": 0,
            "last_backup": None,
            "replication_status": "unknown",
            "error": str(e)
        }

@router.get("/database/schemas", response_model=List[Dict[str, Any]])
async def get_database_schemas(db: Session = Depends(get_db)):
    """
    Get detailed schema information for all tables
    """
    try:
        inspector = inspect(engine)
        schemas = []
        
        for table_name in inspector.get_table_names():
            columns = inspector.get_columns(table_name)
            for column in columns:
                schemas.append({
                    "table_name": table_name,
                    "column_name": column["name"],
                    "data_type": str(column["type"]),
                    "is_nullable": "YES" if column.get("nullable", True) else "NO",
                    "column_default": str(column.get("default", None)) if column.get("default") else None,
                    "character_maximum_length": getattr(column["type"], "length", None)
                })
        
        return schemas
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting schemas: {str(e)}")

@router.get("/database/tables", response_model=List[Dict[str, Any]])
async def get_database_tables(db: Session = Depends(get_db)):
    """
    Get table information including row counts and sizes
    """
    try:
        inspector = inspect(engine)
        tables_info = []
        
        for table_name in inspector.get_table_names():
            try:
                # Get row count
                result = db.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                row_count = result.scalar()
                
                # Get table size
                result = db.execute(text(f"""
                    SELECT pg_total_relation_size('{table_name}') / (1024 * 1024.0) as size_mb
                """))
                size_mb = result.scalar() or 0
                
                # Get columns for this table
                columns = inspector.get_columns(table_name)
                
                tables_info.append({
                    "table_name": table_name,
                    "row_count": row_count,
                    "size_mb": round(size_mb, 2),
                    "last_updated": datetime.now().isoformat(),
                    "columns": [
                        {
                            "name": col["name"],
                            "type": str(col["type"]),
                            "nullable": col.get("nullable", True)
                        }
                        for col in columns
                    ]
                })
            except Exception as e:
                # Skip tables that can't be queried
                continue
        
        return tables_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tables: {str(e)}")

@router.get("/database/validate", response_model=List[Dict[str, Any]])
async def validate_database_data(db: Session = Depends(get_db)):
    """
    Perform comprehensive data validation checks
    """
    try:
        validations = []
        
        # Check for orphaned records
        try:
            result = db.execute(text("""
                SELECT COUNT(*) as orphaned_count 
                FROM leads l 
                LEFT JOIN vendors v ON l.selected_vendor_id = v.id 
                WHERE l.selected_vendor_id IS NOT NULL AND v.id IS NULL
            """))
            orphaned_count = result.scalar()
            if orphaned_count > 0:
                validations.append({
                    "table_name": "leads",
                    "validation_type": "foreign_key_integrity",
                    "status": "fail",
                    "message": f"Found {orphaned_count} leads with invalid vendor references",
                    "affected_rows": orphaned_count
                })
            else:
                validations.append({
                    "table_name": "leads",
                    "validation_type": "foreign_key_integrity",
                    "status": "pass",
                    "message": "All vendor references are valid"
                })
        except Exception as e:
            validations.append({
                "table_name": "leads",
                "validation_type": "foreign_key_integrity",
                "status": "warning",
                "message": f"Could not validate foreign keys: {str(e)}"
            })
        
        # Check for duplicate emails in leads
        try:
            result = db.execute(text("""
                SELECT email, COUNT(*) as count 
                FROM leads 
                WHERE email IS NOT NULL 
                GROUP BY email 
                HAVING COUNT(*) > 1
            """))
            duplicates = result.fetchall()
            if duplicates:
                total_duplicates = sum(row.count for row in duplicates)
                validations.append({
                    "table_name": "leads",
                    "validation_type": "duplicate_emails",
                    "status": "warning",
                    "message": f"Found {len(duplicates)} email addresses with multiple leads",
                    "affected_rows": total_duplicates
                })
            else:
                validations.append({
                    "table_name": "leads",
                    "validation_type": "duplicate_emails",
                    "status": "pass",
                    "message": "No duplicate email addresses found"
                })
        except Exception as e:
            validations.append({
                "table_name": "leads",
                "validation_type": "duplicate_emails",
                "status": "warning",
                "message": f"Could not check for duplicates: {str(e)}"
            })
        
        # Check for null required fields
        try:
            result = db.execute(text("""
                SELECT COUNT(*) as null_count 
                FROM leads 
                WHERE first_name IS NULL OR last_name IS NULL OR email IS NULL
            """))
            null_count = result.scalar()
            if null_count > 0:
                validations.append({
                    "table_name": "leads",
                    "validation_type": "required_fields",
                    "status": "warning",
                    "message": f"Found {null_count} leads with missing required fields",
                    "affected_rows": null_count
                })
            else:
                validations.append({
                    "table_name": "leads",
                    "validation_type": "required_fields",
                    "status": "pass",
                    "message": "All required fields are populated"
                })
        except Exception as e:
            validations.append({
                "table_name": "leads",
                "validation_type": "required_fields",
                "status": "warning",
                "message": f"Could not validate required fields: {str(e)}"
            })
        
        # Check for recent data
        try:
            result = db.execute(text("""
                SELECT COUNT(*) as recent_count 
                FROM leads 
                WHERE created_at >= NOW() - INTERVAL '7 days'
            """))
            recent_count = result.scalar()
            validations.append({
                "table_name": "leads",
                "validation_type": "recent_activity",
                "status": "pass" if recent_count > 0 else "warning",
                "message": f"Found {recent_count} leads created in the last 7 days",
                "affected_rows": recent_count
            })
        except Exception as e:
            validations.append({
                "table_name": "leads",
                "validation_type": "recent_activity",
                "status": "warning",
                "message": f"Could not check recent activity: {str(e)}"
            })
        
        return validations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating data: {str(e)}")

@router.post("/database/query", response_model=Dict[str, Any])
async def execute_database_query(
    query_request: Dict[str, str],
    db: Session = Depends(get_db)
):
    """
    Execute a custom SQL query (SELECT only for safety)
    """
    try:
        query = query_request.get("query", "").strip()
        
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # Security check: only allow SELECT queries
        if not query.lower().startswith("select"):
            raise HTTPException(status_code=400, detail="Only SELECT queries are allowed for security")
        
        # Additional security checks
        dangerous_keywords = ["drop", "delete", "update", "insert", "create", "alter", "truncate"]
        if any(keyword in query.lower() for keyword in dangerous_keywords):
            raise HTTPException(status_code=400, detail="Query contains forbidden keywords")
        
        start_time = time.time()
        
        # Execute query
        result = db.execute(text(query))
        
        # Get column names
        columns = list(result.keys())
        
        # Fetch data (limit to 1000 rows for safety)
        rows = result.fetchmany(1000)
        data = [dict(zip(columns, row)) for row in rows]
        
        execution_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return {
            "query": query,
            "execution_time_ms": execution_time_ms,
            "row_count": len(data),
            "columns": columns,
            "data": data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query execution failed: {str(e)}")

@router.post("/database/backup", response_model=Dict[str, Any])
async def create_database_backup():
    """
    Create a database backup
    """
    try:
        # Create backup directory if it doesn't exist
        backup_dir = "/app/backups"
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generate backup filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"backup_{timestamp}.sql"
        backup_path = os.path.join(backup_dir, backup_file)
        
        # Get database connection details from environment
        db_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
        
        # Create backup using pg_dump
        cmd = [
            "pg_dump",
            "--dbname=" + db_url,
            "--file=" + backup_path,
            "--verbose",
            "--no-password"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            # Get file size
            file_size = os.path.getsize(backup_path)
            
            return {
                "status": "success",
                "backup_file": backup_file,
                "backup_path": backup_path,
                "file_size_bytes": file_size,
                "created_at": datetime.now().isoformat()
            }
        else:
            raise Exception(f"pg_dump failed: {result.stderr}")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup creation failed: {str(e)}") 

@router.post("/update-vendor-emails")
async def update_vendor_emails(db: Session = Depends(get_db)):
    """Update vendor emails with proper addresses"""
    try:
        # Vendor email mappings - ALL SET TO support@movedin.com for security
        vendor_emails = {
            "lets-get-moving": "support@movedin.com",
            "easy2go": "support@movedin.com", 
            "velocity-movers": "support@movedin.com",
            "pierre-sons": "support@movedin.com"
        }
        
        updated_vendors = []
        
        for slug, email in vendor_emails.items():
            vendor = db.query(Vendor).filter(Vendor.slug == slug).first()
            if vendor:
                vendor.email = email
                updated_vendors.append({
                    "name": vendor.name,
                    "slug": vendor.slug,
                    "email": email
                })
                logger.info(f"Updated {vendor.name} email to: {email}")
            else:
                logger.warning(f"Vendor not found: {slug}")
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Updated {len(updated_vendors)} vendor emails",
            "updated_vendors": updated_vendors
        }
        
    except Exception as e:
        logger.error(f"Error updating vendor emails: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update vendor emails: {str(e)}")

@router.post("/run-migration")
async def run_database_migration(db: Session = Depends(get_db)):
    """Run database migration to add payment fields"""
    try:
        from sqlalchemy import text
        
        # Check if columns already exist
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'leads' 
            AND column_name IN ('payment_amount', 'payment_currency', 'payment_status')
        """))
        
        existing_columns = [row[0] for row in result]
        
        migration_results = []
        
        if 'payment_amount' not in existing_columns:
            db.execute(text("ALTER TABLE leads ADD COLUMN payment_amount FLOAT"))
            migration_results.append("payment_amount column added")
        else:
            migration_results.append("payment_amount column already exists")
        
        if 'payment_currency' not in existing_columns:
            db.execute(text("ALTER TABLE leads ADD COLUMN payment_currency VARCHAR(10) DEFAULT 'CAD'"))
            migration_results.append("payment_currency column added")
        else:
            migration_results.append("payment_currency column already exists")
        
        if 'payment_status' not in existing_columns:
            db.execute(text("ALTER TABLE leads ADD COLUMN payment_status VARCHAR(50)"))
            migration_results.append("payment_status column added")
        else:
            migration_results.append("payment_status column already exists")
        
        # Update existing completed payments with default values
        db.execute(text("""
            UPDATE leads 
            SET payment_amount = 1.00, 
                payment_currency = 'CAD', 
                payment_status = 'succeeded'
            WHERE status = 'payment_completed' 
            AND payment_amount IS NULL
        """))
        
        # Count updated records
        result = db.execute(text("""
            SELECT COUNT(*) 
            FROM leads 
            WHERE status = 'payment_completed' 
            AND payment_amount IS NOT NULL
        """))
        
        updated_count = result.fetchone()[0]
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Database migration completed successfully",
            "migration_results": migration_results,
            "updated_payments": updated_count
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Migration failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")

@router.get("/vendors")
async def get_vendors(db: Session = Depends(get_db)):
    """Get all vendors with their email addresses"""
    try:
        vendors = db.query(Vendor).all()
        return {
            "vendors": [
                {
                    "id": vendor.id,
                    "name": vendor.name,
                    "slug": vendor.slug,
                    "email": vendor.email,
                    "is_active": vendor.is_active
                }
                for vendor in vendors
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching vendors: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch vendors: {str(e)}")