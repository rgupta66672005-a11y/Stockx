from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import News
from ..schemas import NewsResponse

router = APIRouter(prefix="/api/news", tags=["Financial News"])

@router.get("", response_model=List[NewsResponse])
def get_news(
    category: Optional[str] = Query(None, description="Filter by category (Market, Tech, Economy, Banking)"),
    symbol: Optional[str] = Query(None, description="Filter by stock symbol"),
    db: Session = Depends(get_db)
):
    """Retrieves simulated financial and market news."""
    query = db.query(News)
    if category and category != "All":
        query = query.filter(News.category.ilike(f"%{category}%"))
    if symbol:
        query = query.filter(News.symbol == symbol.upper())
    return query.order_by(News.published_at.desc()).all()

@router.get("/{news_id}", response_model=NewsResponse)
def get_news_detail(news_id: int, db: Session = Depends(get_db)):
    """Retrieves full article details for a news item."""
    item = db.query(News).filter(News.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found.")
    return item
