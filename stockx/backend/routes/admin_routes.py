from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import User, Stock, Order, Transaction
from ..schemas import PlatformStats, UserProfile, StockResponse, StockCreate, StockUpdate, TransactionResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/stats", response_model=PlatformStats)
def get_admin_platform_stats(db: Session = Depends(get_db)):
    """Aggregates platform statistics for admin dashboard."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_volume = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_stocks = db.query(func.count(Stock.id)).scalar() or 0

    return PlatformStats(
        total_users=total_users,
        total_orders=total_orders,
        total_volume=round(total_volume, 2),
        total_stocks=total_stocks,
        market_status="Open (Simulated Session)"
    )

@router.get("/users", response_model=List[UserProfile])
def get_all_users(db: Session = Depends(get_db)):
    """Retrieves all registered platform users."""
    return db.query(User).order_by(User.id.desc()).all()

@router.get("/transactions", response_model=List[TransactionResponse])
def get_all_transactions(db: Session = Depends(get_db)):
    """Retrieves recent platform-wide transactions."""
    return db.query(Transaction).order_by(Transaction.created_at.desc()).limit(100).all()

@router.post("/stocks", response_model=StockResponse)
def create_stock(payload: StockCreate, db: Session = Depends(get_db)):
    """Creates a new simulated stock."""
    symbol = payload.symbol.upper()
    existing = db.query(Stock).filter(Stock.symbol == symbol).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Stock '{symbol}' already exists.")

    new_stock = Stock(**payload.dict())
    new_stock.symbol = symbol
    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)
    return new_stock

@router.put("/stocks/{symbol}", response_model=StockResponse)
def update_stock(symbol: str, payload: StockUpdate, db: Session = Depends(get_db)):
    """Updates an existing simulated stock."""
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock '{symbol}' not found.")

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stock, field, value)

    db.commit()
    db.refresh(stock)
    return stock

@router.delete("/stocks/{symbol}")
def delete_stock(symbol: str, db: Session = Depends(get_db)):
    """Deletes a simulated stock."""
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock '{symbol}' not found.")

    db.delete(stock)
    db.commit()
    return {"message": f"Stock '{symbol}' deleted successfully."}
