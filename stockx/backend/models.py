from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="Trader")
    role = Column(String(50), default="user")  # 'user' or 'admin'
    cash_balance = Column(Float, default=100000.0)  # Starting virtual balance ₹1,00,000
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlist_items = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    portfolio_items = relationship("PortfolioItem", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")


class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    sector = Column(String(100), default="General")
    price = Column(Float, nullable=False)
    change = Column(Float, default=0.0)
    change_percent = Column(Float, default=0.0)
    open_price = Column(Float, default=0.0)
    high_price = Column(Float, default=0.0)
    low_price = Column(Float, default=0.0)
    prev_close = Column(Float, default=0.0)
    volume = Column(Integer, default=1000000)
    market_cap = Column(String(50), default="₹1,00,000 Cr")
    pe_ratio = Column(Float, default=25.0)
    div_yield = Column(Float, default=1.2)
    week52_high = Column(Float, default=0.0)
    week52_low = Column(Float, default=0.0)
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlist_items")


class PortfolioItem(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    avg_buy_price = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="portfolio_items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    type = Column(String(10), nullable=False)  # 'BUY' or 'SELL'
    order_type = Column(String(20), default="MARKET")  # 'MARKET' or 'LIMIT'
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="Completed")  # 'Completed', 'Pending', 'Cancelled'
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)  # 'DEPOSIT', 'BUY', 'SELL', 'WITHDRAWAL'
    amount = Column(Float, nullable=False)
    description = Column(String(255), nullable=False)
    balance_after = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, default="")
    source = Column(String(100), default="StockX Financial Sim")
    category = Column(String(50), default="Market")
    symbol = Column(String(20), nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
