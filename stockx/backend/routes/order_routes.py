import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Stock, PortfolioItem, Order, Transaction
from ..schemas import OrderCreate, OrderResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders & Trading"])

@router.get("", response_model=List[OrderResponse])
def get_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieves all past and pending orders for the authenticated user."""
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.post("", response_model=OrderResponse)
def place_order(payload: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Executes a simulated Buy or Sell order:
    - Validates order arguments and quantity
    - Verifies cash balance for BUY
    - Verifies available holdings for SELL
    - Deducts/credits simulated funds
    - Updates portfolio average buy price and quantities
    - Records immutable Transaction and Order records
    """
    symbol = payload.symbol.upper()
    order_type = (payload.order_type or "MARKET").upper()
    action = payload.type.upper()

    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Order quantity must be at least 1.")

    stock = db.query(Stock).filter(Stock.symbol == symbol).first()
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock '{symbol}' not found.")

    execution_price = payload.price if (order_type == "LIMIT" and payload.price) else stock.price
    total_cost = round(execution_price * payload.quantity, 2)
    order_id = f"ORD-{uuid.uuid4().hex[:6].upper()}"

    # Determine status: Market orders fill immediately; Limit orders fill if condition met or marked Pending
    status = "Completed"
    if order_type == "LIMIT":
        if action == "BUY" and execution_price < stock.price:
            status = "Pending"
        elif action == "SELL" and execution_price > stock.price:
            status = "Pending"

    if action == "BUY":
        if current_user.cash_balance < total_cost:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient funds. Required: ₹{total_cost:,.2f}, Available: ₹{current_user.cash_balance:,.2f}"
            )

        if status == "Completed":
            # Deduct cash
            current_user.cash_balance = round(current_user.cash_balance - total_cost, 2)

            # Update portfolio
            portfolio_item = db.query(PortfolioItem).filter(
                PortfolioItem.user_id == current_user.id,
                PortfolioItem.symbol == symbol
            ).first()

            if portfolio_item:
                total_existing_cost = portfolio_item.quantity * portfolio_item.avg_buy_price
                new_qty = portfolio_item.quantity + payload.quantity
                new_avg = (total_existing_cost + total_cost) / new_qty
                portfolio_item.quantity = new_qty
                portfolio_item.avg_buy_price = round(new_avg, 2)
            else:
                portfolio_item = PortfolioItem(
                    user_id=current_user.id,
                    symbol=symbol,
                    quantity=payload.quantity,
                    avg_buy_price=round(execution_price, 2)
                )
                db.add(portfolio_item)

            # Log transaction
            tx = Transaction(
                user_id=current_user.id,
                type="BUY",
                amount=-total_cost,
                description=f"Bought {payload.quantity} {symbol} @ ₹{execution_price:,.2f}",
                balance_after=current_user.cash_balance
            )
            db.add(tx)

    elif action == "SELL":
        portfolio_item = db.query(PortfolioItem).filter(
            PortfolioItem.user_id == current_user.id,
            PortfolioItem.symbol == symbol
        ).first()

        if not portfolio_item or portfolio_item.quantity < payload.quantity:
            available_qty = portfolio_item.quantity if portfolio_item else 0
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient holdings to sell. Requested: {payload.quantity}, Available: {available_qty}"
            )

        if status == "Completed":
            # Credit cash
            current_user.cash_balance = round(current_user.cash_balance + total_cost, 2)

            # Update portfolio
            portfolio_item.quantity -= payload.quantity

            # Log transaction
            tx = Transaction(
                user_id=current_user.id,
                type="SELL",
                amount=total_cost,
                description=f"Sold {payload.quantity} {symbol} @ ₹{execution_price:,.2f}",
                balance_after=current_user.cash_balance
            )
            db.add(tx)

    else:
        raise HTTPException(status_code=400, detail="Invalid order action. Must be BUY or SELL.")

    order = Order(
        order_id=order_id,
        user_id=current_user.id,
        symbol=symbol,
        type=action,
        order_type=order_type,
        quantity=payload.quantity,
        price=execution_price,
        total_amount=total_cost,
        status=status
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return order

@router.delete("/{order_id}")
def cancel_order(order_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Cancels an unfulfilled pending limit order."""
    order = db.query(Order).filter(
        Order.order_id == order_id,
        Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order.status != "Pending":
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled.")

    order.status = "Cancelled"
    db.commit()
    return {"message": f"Order {order_id} has been cancelled successfully."}
