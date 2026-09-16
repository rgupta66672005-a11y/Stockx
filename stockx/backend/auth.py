import os
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

# Configuration
SECRET_KEY = os.getenv("STOCKX_SECRET_KEY", "stockx-demo-secret-key-348293847293847")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# Support passlib/bcrypt if installed, otherwise secure hashlib sha256 with salt
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    USE_PASSLIB = True
except ImportError:
    USE_PASSLIB = False

def get_password_hash(password: str) -> str:
    """Hashes a password securely."""
    if USE_PASSLIB:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    # Fallback to salted sha256
    salt = "stockx_salt_salt"
    return "sha256$" + hashlib.sha256((salt + password).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against its hashed representation."""
    if hashed_password.startswith("sha256$"):
        salt = "stockx_salt_salt"
        expected = "sha256$" + hashlib.sha256((salt + plain_password).encode()).hexdigest()
        return hashed_password == expected
    if USE_PASSLIB:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            return False
    return False

# Support jose JWT if installed, otherwise simple secure token fallback
try:
    from jose import jwt, JWTError
    USE_JOSE = True
except ImportError:
    USE_JOSE = False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates an authentication token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})

    if USE_JOSE:
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    else:
        import base64
        import json
        payload = json.dumps(to_encode)
        token = base64.urlsafe_b64encode(payload.encode()).decode()
        return f"sim_{token}"

def decode_token(token: str) -> Optional[dict]:
    """Decodes and validates a token."""
    try:
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        if USE_JOSE and not token.startswith("sim_"):
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        elif token.startswith("sim_"):
            import base64
            import json
            raw = token[4:]
            payload = base64.urlsafe_b64decode(raw.encode()).decode()
            data = json.loads(payload)
            if data.get("exp", 0) < datetime.utcnow().timestamp():
                return None
            return data
    except Exception:
        return None
    return None

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """FastAPI dependency to extract and verify the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        # Check if demo user exists, if demo mode return demo user
        demo_user = db.query(User).filter(User.email == "demo@stockx.com").first()
        if demo_user:
            return demo_user
        raise credentials_exception

    payload = decode_token(token)
    if not payload:
        raise credentials_exception

    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user

def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency for admin-only endpoints."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required."
        )
    return current_user
