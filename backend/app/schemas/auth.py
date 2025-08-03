from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    name: str
    role: str
    email: str

class LoginResponse(BaseModel):
    token: str
    token_type: str
    expires_in: int
    user: UserResponse 