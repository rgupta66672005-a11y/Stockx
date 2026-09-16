from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Transaction
from ..schemas import UserRegister, UserLogin, Token, UserProfile
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    """Registers a new user account with initial virtual trading cash."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    hashed_pw = get_password_hash(payload.password)
    new_user = User(
        email=payload.email,
        hashed_password=hashed_pw,
        full_name=payload.full_name or "Trader",
        role="user",
        cash_balance=100000.0  # ₹1,00,000 starting demo cash
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Record welcome bonus transaction
    tx = Transaction(
        user_id=new_user.id,
        type="DEPOSIT",
        amount=100000.0,
        description="Welcome Virtual Trading Capital Credited",
        balance_after=100000.0
    )
    db.add(tx)
    db.commit()

    token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role,
        "cash_balance": new_user.cash_balance
    }

@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticates a user and returns a bearer token."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. For demo, use demo@stockx.com / Demo@123",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "cash_balance": user.cash_balance
    }

@router.get("/me", response_model=UserProfile)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Returns the profile and simulated cash balance for the authenticated user."""
    return current_user

@router.post("/forgot-password")
def forgot_password(payload: dict):
    """Simulated password reset instructions."""
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    return {
        "message": f"If an account exists for {email}, password reset instructions have been generated (Simulated)."
    }
