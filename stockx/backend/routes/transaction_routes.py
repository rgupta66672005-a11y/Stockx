from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Transaction, PortfolioItem
from ..schemas import TransactionResponse, DepositRequest
from ..auth import get_current_user

router = APIRouter(prefix="/api", tags=["Transactions & Funds"])

@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieves all deposit, buy, and sell transactions for the authenticated user."""
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.created_at.desc()).all()

@router.post("/funds/deposit")
def add_virtual_funds(payload: DepositRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Simulates adding virtual paper trading funds."""
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be greater than zero.")

    current_user.cash_balance = round(current_user.cash_balance + payload.amount, 2)
    tx = Transaction(
        user_id=current_user.id,
        type="DEPOSIT",
        amount=payload.amount,
        description=f"Virtual Demo Deposit: +₹{payload.amount:,.2f}",
        balance_after=current_user.cash_balance
    )
    db.add(tx)
    db.commit()

    return {
        "message": f"Successfully credited ₹{payload.amount:,.2f} to demo account.",
        "new_balance": current_user.cash_balance
    }

@router.post("/funds/reset")
def reset_demo_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Resets the demo account cash balance to initial ₹1,00,000."""
    current_user.cash_balance = 100000.0
    tx = Transaction(
        user_id=current_user.id,
        type="DEPOSIT",
        amount=100000.0,
        description="Demo Account Balance Reset to ₹1,00,000",
        balance_after=100000.0
    )
    db.add(tx)
    db.commit()

    return {
        "message": "Demo account balance reset to ₹1,00,000.",
        "new_balance": current_user.cash_balance
    }
