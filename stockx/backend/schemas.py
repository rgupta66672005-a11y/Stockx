from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = "Trader"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    full_name: str
    role: str
    cash_balance: float

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    cash_balance: float
    created_at: datetime

    class Config:
        from_attributes = True

# --- Stock Schemas ---
class StockBase(BaseModel):
    symbol: str
    name: str
    sector: Optional[str] = "General"
    price: float
    change: Optional[float] = 0.0
    change_percent: Optional[float] = 0.0
    open_price: Optional[float] = 0.0
    high_price: Optional[float] = 0.0
    low_price: Optional[float] = 0.0
    prev_close: Optional[float] = 0.0
    volume: Optional[int] = 1000000
    market_cap: Optional[str] = "₹1,00,000 Cr"
    pe_ratio: Optional[float] = 25.0
    div_yield: Optional[float] = 1.2
    week52_high: Optional[float] = 0.0
    week52_low: Optional[float] = 0.0
    description: Optional[str] = ""

class StockCreate(StockBase):
    pass

class StockUpdate(BaseModel):
    name: Optional[str] = None
    sector: Optional[str] = None
    price: Optional[float] = None
    change: Optional[float] = None
    change_percent: Optional[float] = None
    pe_ratio: Optional[float] = None
    div_yield: Optional[float] = None
    week52_high: Optional[float] = None
    week52_low: Optional[float] = None
    description: Optional[str] = None

class StockResponse(StockBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MarketIndex(BaseModel):
    name: str
    symbol: str
    price: float
    change: float
    change_percent: float
    is_up: bool
    sparkline: List[float]

class MarketOverviewResponse(BaseModel):
    indices: List[MarketIndex]
    top_gainers: List[StockResponse]
    top_losers: List[StockResponse]
    most_active: List[StockResponse]
    popular_stocks: List[StockResponse]

# --- Watchlist Schemas ---
class WatchlistCreate(BaseModel):
    symbol: str

class WatchlistItemResponse(BaseModel):
    id: int
    symbol: str
    stock: StockResponse
    created_at: datetime

# --- Order Schemas ---
class OrderCreate(BaseModel):
    symbol: str
    type: str  # 'BUY' or 'SELL'
    order_type: Optional[str] = "MARKET"  # 'MARKET' or 'LIMIT'
    quantity: int
    price: Optional[float] = None  # Needed for Limit orders

class OrderResponse(BaseModel):
    id: int
    order_id: str
    symbol: str
    type: str
    order_type: str
    quantity: int
    price: float
    total_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Portfolio Schemas ---
class PortfolioHolding(BaseModel):
    symbol: str
    name: str
    quantity: int
    avg_price: float
    current_price: float
    investment: float
    current_value: float
    pnl: float
    pnl_percent: float
    allocation_percent: float

class PortfolioSummaryResponse(BaseModel):
    total_portfolio_value: float
    total_investment: float
    total_pnl: float
    total_pnl_percent: float
    available_cash: float
    holdings: List[PortfolioHolding]

# --- Transaction Schemas ---
class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: float
    description: str
    balance_after: float
    created_at: datetime

    class Config:
        from_attributes = True

class DepositRequest(BaseModel):
    amount: float

# --- News Schemas ---
class NewsResponse(BaseModel):
    id: int
    headline: str
    description: str
    content: str
    source: str
    category: str
    symbol: Optional[str] = None
    published_at: datetime

    class Config:
        from_attributes = True

# --- Admin Schemas ---
class PlatformStats(BaseModel):
    total_users: int
    total_orders: int
    total_volume: float
    total_stocks: int
    market_status: str
