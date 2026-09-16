from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Stock, PortfolioItem
from ..schemas import PortfolioSummaryResponse, PortfolioHolding
from ..auth import get_current_user

router = APIRouter(prefix="/api/portfolio", tags=["Portfolio"])

@router.get("", response_model=PortfolioSummaryResponse)
def get_portfolio_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Computes total portfolio value, invested capital, overall profit/loss,
    available cash balance, and percentage allocations per holding.
    """
    items = db.query(PortfolioItem).filter(
        PortfolioItem.user_id == current_user.id,
        PortfolioItem.quantity > 0
    ).all()

    holdings = []
    total_invested = 0.0
    total_current_value = 0.0

    raw_holdings = []
    for item in items:
        stock = db.query(Stock).filter(Stock.symbol == item.symbol).first()
        if not stock:
            continue
        investment = item.quantity * item.avg_buy_price
        current_val = item.quantity * stock.price
        pnl = current_val - investment
        pnl_pct = (pnl / investment * 100) if investment > 0 else 0.0

        total_invested += investment
        total_current_value += current_val

        raw_holdings.append({
            "symbol": stock.symbol,
            "name": stock.name,
            "quantity": item.quantity,
            "avg_price": round(item.avg_buy_price, 2),
            "current_price": round(stock.price, 2),
            "investment": round(investment, 2),
            "current_value": round(current_val, 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_pct, 2)
        })

    # Compute allocation percentages
    for h in raw_holdings:
        alloc = (h["current_value"] / total_current_value * 100) if total_current_value > 0 else 0.0
        h["allocation_percent"] = round(alloc, 1)
        holdings.append(PortfolioHolding(**h))

    total_pnl = total_current_value - total_invested
    total_pnl_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0
    total_portfolio_value = total_current_value + current_user.cash_balance

    return PortfolioSummaryResponse(
        total_portfolio_value=round(total_portfolio_value, 2),
        total_investment=round(total_invested, 2),
        total_pnl=round(total_pnl, 2),
        total_pnl_percent=round(total_pnl_pct, 2),
        available_cash=round(current_user.cash_balance, 2),
        holdings=holdings
    )
