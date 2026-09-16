import math
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Stock
from ..schemas import StockResponse, MarketOverviewResponse, MarketIndex

router = APIRouter(prefix="/api", tags=["Stocks & Markets"])

@router.get("/stocks", response_model=List[StockResponse])
def get_stocks(
    search: Optional[str] = Query(None, description="Search by symbol or name"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    db: Session = Depends(get_db)
):
    """Retrieves all simulated stocks with optional search and sector filters."""
    query = db.query(Stock)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter((Stock.symbol.ilike(search_pattern)) | (Stock.name.ilike(search_pattern)))
    if sector:
        query = query.filter(Stock.sector.ilike(f"%{sector}%"))
    return query.order_by(Stock.symbol).all()

@router.get("/stocks/{symbol}", response_model=StockResponse)
def get_stock_by_symbol(symbol: str, db: Session = Depends(get_db)):
    """Retrieves detailed information for a single simulated stock."""
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock with symbol '{symbol}' not found.")
    return stock

@router.get("/stocks/{symbol}/history")
def get_stock_history(
    symbol: str,
    range: str = Query("1M", regex="^(1D|1W|1M|6M|1Y|5Y)$"),
    db: Session = Depends(get_db)
):
    """
    Generates realistic historical price series for Chart.js.
    Supports ranges: 1D, 1W, 1M, 6M, 1Y, 5Y.
    """
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock '{symbol}' not found.")

    base_price = stock.price
    points_config = {
        "1D": (24, "hours"),
        "1W": (7, "days"),
        "1M": (30, "days"),
        "6M": (26, "weeks"),
        "1Y": (52, "weeks"),
        "5Y": (60, "months")
    }
    count, unit = points_config.get(range, (30, "days"))

    # Deterministic yet lively pseudo-random walk based on symbol + range
    random.seed(hash(f"{symbol}_{range}"))
    prices = []
    labels = []
    current = base_price * (0.90 if stock.change >= 0 else 1.08)

    for i in range(count):
        drift = (base_price - current) / (count - i)
        noise = current * random.uniform(-0.015, 0.015)
        current = round(max(current + drift + noise, 1.0), 2)
        prices.append(current)
        if unit == "hours":
            labels.append(f"{9 + (i % 8)}:{'15' if i % 2 == 0 else '45'}")
        elif unit == "days":
            labels.append(f"Day {i+1}")
        elif unit == "weeks":
            labels.append(f"Wk {i+1}")
        else:
            labels.append(f"M{i+1}")

    # Ensure last point matches current price
    prices[-1] = base_price

    return {
        "symbol": stock.symbol,
        "range": range,
        "labels": labels,
        "prices": prices,
        "current_price": base_price,
        "change": stock.change,
        "change_percent": stock.change_percent
    }

@router.get("/market/overview", response_model=MarketOverviewResponse)
def get_market_overview(db: Session = Depends(get_db)):
    """
    Returns market summary cards (NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT)
    and stock market rankings (Top Gainers, Top Losers, Most Active, Popular).
    """
    indices = [
        MarketIndex(
            name="NIFTY 50",
            symbol="NIFTY",
            price=24850.30,
            change=125.40,
            change_percent=0.51,
            is_up=True,
            sparkline=[24650, 24690, 24710, 24680, 24790, 24820, 24850.30]
        ),
        MarketIndex(
            name="SENSEX",
            symbol="SENSEX",
            price=81420.15,
            change=380.20,
            change_percent=0.47,
            is_up=True,
            sparkline=[80900, 81050, 81100, 81020, 81250, 81380, 81420.15]
        ),
        MarketIndex(
            name="BANK NIFTY",
            symbol="BANKNIFTY",
            price=51240.60,
            change=-110.30,
            change_percent=-0.21,
            is_up=False,
            sparkline=[51500, 51420, 51380, 51400, 51300, 51210, 51240.60]
        ),
        MarketIndex(
            name="NIFTY IT",
            symbol="NIFTYIT",
            price=41890.80,
            change=520.10,
            change_percent=1.26,
            is_up=True,
            sparkline=[41200, 41350, 41480, 41520, 41690, 41810, 41890.80]
        )
    ]

    all_stocks = db.query(Stock).all()
    # Sorts for sections
    top_gainers = sorted(all_stocks, key=lambda s: s.change_percent, reverse=True)[:5]
    top_losers = sorted(all_stocks, key=lambda s: s.change_percent)[:5]
    most_active = sorted(all_stocks, key=lambda s: s.volume, reverse=True)[:5]
    popular_stocks = all_stocks[:6]

    return MarketOverviewResponse(
        indices=indices,
        top_gainers=top_gainers,
        top_losers=top_losers,
        most_active=most_active,
        popular_stocks=popular_stocks
    )
