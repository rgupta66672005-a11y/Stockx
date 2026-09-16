from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Stock, Watchlist
from ..schemas import WatchlistCreate, WatchlistItemResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])

@router.get("", response_model=List[WatchlistItemResponse])
def get_user_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieves all stocks on the user's watchlist with current prices."""
    items = db.query(Watchlist).filter(Watchlist.user_id == current_user.id).all()
    results = []
    for item in items:
        stock = db.query(Stock).filter(Stock.symbol == item.symbol).first()
        if stock:
            results.append({
                "id": item.id,
                "symbol": item.symbol,
                "stock": stock,
                "created_at": item.created_at
            })
    return results

@router.post("", response_model=WatchlistItemResponse)
def add_to_watchlist(payload: WatchlistCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Adds a stock to the user's watchlist."""
    symbol = payload.symbol.upper()
    stock = db.query(Stock).filter(Stock.symbol == symbol).first()
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock symbol '{symbol}' not found.")

    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.symbol == symbol
    ).first()
    if existing:
        return {
            "id": existing.id,
            "symbol": existing.symbol,
            "stock": stock,
            "created_at": existing.created_at
        }

    item = Watchlist(user_id=current_user.id, symbol=symbol)
    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "id": item.id,
        "symbol": item.symbol,
        "stock": stock,
        "created_at": item.created_at
    }

@router.delete("/{symbol}")
def remove_from_watchlist(symbol: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Removes a stock from the user's watchlist."""
    symbol = symbol.upper()
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.symbol == symbol
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Stock is not on your watchlist.")

    db.delete(item)
    db.commit()
    return {"message": f"'{symbol}' removed from watchlist successfully."}
