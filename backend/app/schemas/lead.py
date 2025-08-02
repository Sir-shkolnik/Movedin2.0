from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional
from datetime import datetime
from .quote import QuoteRequest, QuoteResponse

class ContactData(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str

class LeadCreate(BaseModel):
    quote_data: QuoteRequest
    selected_quote: QuoteResponse
    contact_data: ContactData

class LeadResponse(BaseModel):
    id: int
    status: str
    created_at: datetime
    quote_data: QuoteRequest
    selected_quote: QuoteResponse
    contact_data: ContactData

class LeadListResponse(BaseModel):
    leads: list[LeadResponse]
    total_count: int 