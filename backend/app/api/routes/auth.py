from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
import os
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "movedin-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Admin credentials (in production, these should be in a secure database)
ADMIN_CREDENTIALS = {
    "username": "udi.shkolnik",
    "password_hash": bcrypt.hashpw("MovedIn2025Secure!".encode('utf-8'), bcrypt.gensalt()),
    "name": "Udi Shkolnik",
    "role": "System Administrator",
    "email": "udi@movedin.com"
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: bytes) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/login", response_model=LoginResponse)
async def login(login_request: LoginRequest):
    """Authenticate admin user and return JWT token"""
    try:
        # Verify credentials
        if (login_request.username == ADMIN_CREDENTIALS["username"] and 
            verify_password(login_request.password, ADMIN_CREDENTIALS["password_hash"])):
            
            # Create access token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": ADMIN_CREDENTIALS["username"]}, 
                expires_delta=access_token_expires
            )
            
            # Return user data and token
            user_data = {
                "username": ADMIN_CREDENTIALS["username"],
                "name": ADMIN_CREDENTIALS["name"],
                "role": ADMIN_CREDENTIALS["role"],
                "email": ADMIN_CREDENTIALS["email"]
            }
            
            return LoginResponse(
                token=access_token,
                token_type="bearer",
                expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # seconds
                user=user_data
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )

@router.get("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify JWT token and return user information"""
    try:
        return {
            "valid": True,
            "user": {
                "username": current_user.get("sub"),
                "name": ADMIN_CREDENTIALS["name"],
                "role": ADMIN_CREDENTIALS["role"],
                "email": ADMIN_CREDENTIALS["email"]
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed"
        )

@router.post("/logout")
async def logout():
    """Logout endpoint (client-side token removal)"""
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        username=current_user.get("sub"),
        name=ADMIN_CREDENTIALS["name"],
        role=ADMIN_CREDENTIALS["role"],
        email=ADMIN_CREDENTIALS["email"]
    ) 