from pydantic import BaseModel
from typing import List, Optional

class VendorResponse(BaseModel):
    id: int
    name: str
    slug: str
    display_name: str
    logo_url: Optional[str] = None
    vendor_type: str
    coverage_areas: List[str]
    is_featured: bool
    is_active: bool

class VendorListResponse(BaseModel):
    vendors: List[VendorResponse]
    total_count: int 