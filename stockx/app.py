import os
import sqlite3
import datetime
import uuid
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify
)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "stockx-secret-key-2026-secure")

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT DEFAULT 'Demo Trader',
            cash REAL DEFAULT 100000.0
        )
    """)

    # 2. Stocks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE NOT NULL,
            company_name TEXT NOT NULL,
            price REAL NOT NULL,
            change REAL NOT NULL,
            change_percent REAL NOT NULL,
            volume TEXT NOT NULL,
            market_cap TEXT NOT NULL,
            high REAL NOT NULL,
            low REAL NOT NULL,
            open REAL NOT NULL,
            prev_close REAL NOT NULL
        )
    """)

    # 3. Portfolio table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            avg_price REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, symbol)
        )
    """)

    # 4. Watchlist table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, symbol)
        )
    """)

    # 5. Orders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE NOT NULL,
            user_id INTEGER NOT NULL,
            symbol TEXT NOT NULL,
            order_type TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'COMPLETED',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # 6. Transactions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            symbol TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            amount REAL NOT NULL,
            cash_balance REAL NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    # Seed demo user
    cursor.execute("SELECT id FROM users WHERE email = 'demo@stockx.com'")
    user = cursor.fetchone()
    if not user:
        cursor.execute("""
            INSERT INTO users (email, password, name, cash)
            VALUES ('demo@stockx.com', '123456', 'Demo Trader', 100000.0)
        """)
        user_id = cursor.lastrowid
    else:
        user_id = user["id"]

    # Seed demo stocks
    demo_stocks = [
        ("RELIANCE", "Reliance Industries Ltd", 2945.50, 35.20, 1.21, "4.2M", "₹19.9L Cr", 2960.00, 2910.00, 2920.00, 2910.30),
        ("TCS", "Tata Consultancy Services", 3450.25, 42.50, 1.25, "2.1M", "₹12.5L Cr", 3480.00, 3410.00, 3420.00, 3407.75),
        ("INFY", "Infosys Ltd", 1785.40, -18.60, -1.03, "3.8M", "₹7.4L Cr", 1810.00, 1775.00, 1805.00, 1804.00),
        ("HDFCBANK", "HDFC Bank Ltd", 1652.80, 12.40, 0.76, "6.5M", "₹12.6L Cr", 1665.00, 1640.00, 1645.00, 1640.40),
        ("ICICIBANK", "ICICI Bank Ltd", 1210.15, 15.30, 1.28, "5.1M", "₹8.5L Cr", 1220.00, 1195.00, 1200.00, 1194.85),
        ("SBIN", "State Bank of India", 825.60, -6.40, -0.77, "7.9M", "₹7.3L Cr", 838.00, 820.00, 835.00, 832.00),
        ("ITC", "ITC Ltd", 485.20, 4.10, 0.85, "8.4M", "₹6.1L Cr", 489.00, 481.00, 482.00, 481.10),
        ("WIPRO", "Wipro Ltd", 532.75, -5.25, -0.98, "3.2M", "₹2.8L Cr", 540.00, 528.00, 539.00, 538.00),
        ("BHARTIARTL", "Bharti Airtel Ltd", 1420.90, 22.80, 1.63, "3.4M", "₹8.1L Cr", 1435.00, 1400.00, 1405.00, 1398.10),
        ("ADANIENT", "Adani Enterprises Ltd", 3140.00, 45.00, 1.45, "1.9M", "₹3.6L Cr", 3170.00, 3090.00, 3105.00, 3095.00)
    ]

    for s in demo_stocks:
        cursor.execute("""
            INSERT INTO stocks (symbol, company_name, price, change, change_percent, volume, market_cap, high, low, open, prev_close)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(symbol) DO UPDATE SET
                price=excluded.price,
                change=excluded.change,
                change_percent=excluded.change_percent,
                volume=excluded.volume,
                market_cap=excluded.market_cap,
                high=excluded.high,
                low=excluded.low,
                open=excluded.open,
                prev_close=excluded.prev_close
        """, s)

    # Seed initial portfolio items (8 stocks) for demo user if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM portfolio WHERE user_id = ?", (user_id,))
    if cursor.fetchone()["cnt"] == 0:
        initial_portfolio = [
            (user_id, "TCS", 10, 3350.00),
            (user_id, "RELIANCE", 10, 2900.00),
            (user_id, "INFY", 10, 1750.00),
            (user_id, "HDFCBANK", 10, 1620.00),
            (user_id, "ICICIBANK", 8, 1180.00),
            (user_id, "ITC", 15, 470.00),
            (user_id, "WIPRO", 10, 520.00),
            (user_id, "BHARTIARTL", 3, 1380.00)
        ]
        cursor.executemany("""
            INSERT INTO portfolio (user_id, symbol, quantity, avg_price)
            VALUES (?, ?, ?, ?)
        """, initial_portfolio)

    # Seed demo watchlist
    cursor.execute("SELECT COUNT(*) as cnt FROM watchlist WHERE user_id = ?", (user_id,))
    if cursor.fetchone()["cnt"] == 0:
        cursor.executemany("""
            INSERT INTO watchlist (user_id, symbol)
            VALUES (?, ?)
        """, [(user_id, "RELIANCE"), (user_id, "TCS"), (user_id, "INFY"), (user_id, "HDFCBANK")])

    # Seed initial sample orders & transactions
    cursor.execute("SELECT COUNT(*) as cnt FROM orders WHERE user_id = ?", (user_id,))
    if cursor.fetchone()["cnt"] == 0:
        sample_orders = [
            ("ORD-101", user_id, "TCS", "BUY", 10, 3350.00, 33500.00, "COMPLETED", "2026-09-10 10:15:00"),
            ("ORD-102", user_id, "RELIANCE", "BUY", 10, 2900.00, 29000.00, "COMPLETED", "2026-09-11 11:20:00"),
            ("ORD-103", user_id, "INFY", "BUY", 10, 1750.00, 17500.00, "COMPLETED", "2026-09-12 14:05:00"),
            ("ORD-104", user_id, "HDFCBANK", "BUY", 10, 1620.00, 16200.00, "COMPLETED", "2026-09-14 09:30:00")
        ]
        cursor.executemany("""
            INSERT INTO orders (order_id, user_id, symbol, order_type, quantity, price, total, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_orders)

        sample_txns = [
            (user_id, "BUY", "TCS", 10, 3350.00, 33500.00, 166500.00, "2026-09-10 10:15:00"),
            (user_id, "BUY", "RELIANCE", 10, 2900.00, 29000.00, 137500.00, "2026-09-11 11:20:00"),
            (user_id, "BUY", "INFY", 10, 1750.00, 17500.00, 120000.00, "2026-09-12 14:05:00"),
            (user_id, "BUY", "HDFCBANK", 10, 1620.00, 16200.00, 100000.00, "2026-09-14 09:30:00")
        ]
        cursor.executemany("""
            INSERT INTO transactions (user_id, type, symbol, quantity, price, amount, cash_balance, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_txns)

    conn.commit()
    conn.close()


def get_current_user():
    if "user_id" not in session:
        return None
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()
    conn.close()
    return user


def require_auth():
    if "user_id" not in session:
        return redirect(url_for("login"))
    return None


@app.context_processor
def inject_global_data():
    user = get_current_user()
    return dict(current_user=user)


# ============================================================================
# Routes
# ============================================================================

@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        conn = get_db()
        user = conn.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?", (email, password)
        ).fetchone()
        conn.close()

        if user:
            session["user_id"] = user["id"]
            session["user_email"] = user["email"]
            session["user_name"] = user["name"]
            flash("Welcome back to StockX!", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password. Use demo credentials: demo@stockx.com / 123456", "error")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out successfully.", "info")
    return redirect(url_for("login"))


@app.route("/dashboard")
def dashboard():
    auth_check = require_auth()
    if auth_check:
        return auth_check

    user_id = session["user_id"]
    conn = get_db()

    # User cash
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    cash = user["cash"] if user else 100000.0

    # Stocks
    stocks = conn.execute("SELECT * FROM stocks ORDER BY symbol ASC").fetchall()

    # Portfolio holdings
    portfolio_rows = conn.execute("""
        SELECT p.*, s.company_name, s.price as current_price, s.change, s.change_percent
        FROM portfolio p
        JOIN stocks s ON p.symbol = s.symbol
        WHERE p.user_id = ? AND p.quantity > 0
    """, (user_id,)).fetchall()

    total_portfolio_value = 0.0
    total_invested = 0.0
    today_pnl = 0.0

    for p in portfolio_rows:
        val = p["quantity"] * p["current_price"]
        inv = p["quantity"] * p["avg_price"]
        total_portfolio_value += val
        total_invested += inv
        today_pnl += p["quantity"] * p["change"]

    total_stocks_count = len(portfolio_rows)
    total_pnl = total_portfolio_value - total_invested

    # Simulated Market Indices
    indices = {
        "nifty": {"name": "NIFTY 50", "value": 24850.30, "change": 165.20, "percent": 0.67},
        "sensex": {"name": "SENSEX", "value": 81420.65, "change": 520.40, "percent": 0.64},
        "bank_nifty": {"name": "BANK NIFTY", "value": 51340.80, "change": 280.15, "percent": 0.55}
    }

    # Recent orders
    recent_orders = conn.execute("""
        SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 5
    """, (user_id,)).fetchall()

    conn.close()

    return render_template(
        "dashboard.html",
        cash=cash,
        stocks=stocks,
        portfolio_rows=portfolio_rows,
        total_portfolio_value=total_portfolio_value,
        total_invested=total_invested,
        today_pnl=today_pnl,
        total_pnl=total_pnl,
        total_stocks_count=total_stocks_count,
        indices=indices,
        recent_orders=recent_orders
    )


@app.route("/stock/<symbol>")
def stock_detail(symbol):
    auth_check = require_auth()
    if auth_check:
        return auth_check

    user_id = session["user_id"]
    symbol = symbol.upper()
    conn = get_db()

    stock = conn.execute("SELECT * FROM stocks WHERE symbol = ?", (symbol,)).fetchone()
    if not stock:
        conn.close()
        flash(f"Stock '{symbol}' not found.", "error")
        return redirect(url_for("dashboard"))

    # User's holding of this stock
    holding = conn.execute(
        "SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?", (user_id, symbol)
    ).fetchone()

    # Watchlist status
    in_watchlist = conn.execute(
        "SELECT id FROM watchlist WHERE user_id = ? AND symbol = ?", (user_id, symbol)
    ).fetchone() is not None

    user = conn.execute("SELECT cash FROM users WHERE id = ?", (user_id,)).fetchone()
    cash = user["cash"] if user else 0.0

    conn.close()

    return render_template(
        "stock.html",
        stock=stock,
        holding=holding,
        in_watchlist=in_watchlist,
        cash=cash
    )


@app.route("/portfolio")
def portfolio():
    auth_check = require_auth()
    if auth_check:
        return auth_check

    user_id = session["user_id"]
    conn = get_db()

    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    cash = user["cash"] if user else 100000.0

    portfolio_rows = conn.execute("""
        SELECT p.*, s.company_name, s.price as current_price, s.change, s.change_percent
        FROM portfolio p
        JOIN stocks s ON p.symbol = s.symbol
        WHERE p.user_id = ? AND p.quantity > 0
        ORDER BY (p.quantity * s.price) DESC
    """, (user_id,)).fetchall()

    total_portfolio_value = 0.0
    total_invested = 0.0
    holdings_data = []

    for p in portfolio_rows:
        cur_val = p["quantity"] * p["current_price"]
        inv_val = p["quantity"] * p["avg_price"]
        pnl = cur_val - inv_val
        pnl_pct = (pnl / inv_val * 100) if inv_val > 0 else 0.0

        total_portfolio_value += cur_val
        total_invested += inv_val

        holdings_data.append({
            "symbol": p["symbol"],
            "company_name": p["company_name"],
            "quantity": p["quantity"],
            "avg_price": p["avg_price"],
            "current_price": p["current_price"],
            "investment": inv_val,
            "current_value": cur_val,
            "pnl": pnl,
            "pnl_percent": pnl_pct,
            "change": p["change"],
            "change_percent": p["change_percent"]
        })

    total_pnl = total_portfolio_value - total_invested
    total_pnl_percent = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0

    conn.close()

    return render_template(
        "portfolio.html",
        cash=cash,
        holdings=holdings_data,
        total_portfolio_value=total_portfolio_value,
        total_invested=total_invested,
        total_pnl=total_pnl,
        total_pnl_percent=total_pnl_percent
    )


@app.route("/watchlist")
def watchlist():
    auth_check = require_auth()
    if auth_check:
        return auth_check

    user_id = session["user_id"]
    conn = get_db()

    watchlist_items = conn.execute("""
        SELECT s.*
        FROM watchlist w
        JOIN stocks s ON w.symbol = s.symbol
        WHERE w.user_id = ?
        ORDER BY s.symbol ASC
    """, (user_id,)).fetchall()

    all_stocks = conn.execute("SELECT symbol, company_name, price FROM stocks ORDER BY symbol ASC").fetchall()
    conn.close()

    return render_template(
        "watchlist.html",
        watchlist_items=watchlist_items,
        all_stocks=all_stocks
    )


@app.route("/orders")
def orders():
    auth_check = require_auth()
    if auth_check:
        return auth_check

    user_id = session["user_id"]
    conn = get_db()

    order_rows = conn.execute("""
        SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC
    """, (user_id,)).fetchall()

    transaction_rows = conn.execute("""
        SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC
    """, (user_id,)).fetchall()

    conn.close()

    return render_template(
        "orders.html",
        orders=order_rows,
        transactions=transaction_rows
    )


# ============================================================================
# API Endpoints
# ============================================================================

@app.route("/api/search")
def api_search():
    q = request.args.get("q", "").strip().upper()
    if not q:
        return jsonify([])

    conn = get_db()
    stocks = conn.execute("""
        SELECT symbol, company_name, price, change, change_percent
        FROM stocks
        WHERE symbol LIKE ? OR UPPER(company_name) LIKE ?
        LIMIT 8
    """, (f"%{q}%", f"%{q}%")).fetchall()
    conn.close()

    results = [
        {
            "symbol": s["symbol"],
            "company_name": s["company_name"],
            "price": s["price"],
            "change": s["change"],
            "change_percent": s["change_percent"]
        }
        for s in stocks
    ]
    return jsonify(results)


@app.route("/api/trade", methods=["POST"])
def api_trade():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Please log in to trade."}), 401

    user_id = session["user_id"]
    data = request.get_json() or request.form

    symbol = data.get("symbol", "").strip().upper()
    trade_type = data.get("type", "").strip().upper()
    quantity_raw = data.get("quantity")

    if not symbol or not trade_type or not quantity_raw:
        return jsonify({"success": False, "error": "All fields are required."}), 400

    try:
        quantity = int(quantity_raw)
        if quantity <= 0:
            return jsonify({"success": False, "error": "Quantity must be a positive number greater than zero."}), 400
    except ValueError:
        return jsonify({"success": False, "error": "Invalid quantity provided."}), 400

    if trade_type not in ["BUY", "SELL"]:
        return jsonify({"success": False, "error": "Invalid trade type."}), 400

    conn = get_db()
    cursor = conn.cursor()

    stock = cursor.execute("SELECT * FROM stocks WHERE symbol = ?", (symbol,)).fetchone()
    if not stock:
        conn.close()
        return jsonify({"success": False, "error": f"Stock '{symbol}' does not exist."}), 404

    user = cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        conn.close()
        return jsonify({"success": False, "error": "User record not found."}), 404

    price = stock["price"]
    total_cost = round(price * quantity, 2)
    current_cash = user["cash"]

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    order_id = "ORD-" + uuid.uuid4().hex[:8].upper()

    if trade_type == "BUY":
        if current_cash < total_cost:
            conn.close()
            return jsonify({
                "success": False,
                "error": f"Insufficient demo cash. Required: ₹{total_cost:,.2f}, Available: ₹{current_cash:,.2f}"
            }), 400

        new_cash = round(current_cash - total_cost, 2)
        cursor.execute("UPDATE users SET cash = ? WHERE id = ?", (new_cash, user_id))

        # Update or insert into portfolio
        holding = cursor.execute(
            "SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?", (user_id, symbol)
        ).fetchone()

        if holding:
            existing_qty = holding["quantity"]
            existing_avg = holding["avg_price"]
            new_qty = existing_qty + quantity
            new_avg = round(((existing_qty * existing_avg) + total_cost) / new_qty, 2)
            cursor.execute("""
                UPDATE portfolio SET quantity = ?, avg_price = ?
                WHERE user_id = ? AND symbol = ?
            """, (new_qty, new_avg, user_id, symbol))
        else:
            cursor.execute("""
                INSERT INTO portfolio (user_id, symbol, quantity, avg_price)
                VALUES (?, ?, ?, ?)
            """, (user_id, symbol, quantity, price))

        # Record order
        cursor.execute("""
            INSERT INTO orders (order_id, user_id, symbol, order_type, quantity, price, total, status, created_at)
            VALUES (?, ?, ?, 'BUY', ?, ?, ?, 'COMPLETED', ?)
        """, (order_id, user_id, symbol, quantity, price, total_cost, now_str))

        # Record transaction
        cursor.execute("""
            INSERT INTO transactions (user_id, type, symbol, quantity, price, amount, cash_balance, timestamp)
            VALUES (?, 'BUY', ?, ?, ?, ?, ?, ?)
        """, (user_id, symbol, quantity, price, total_cost, new_cash, now_str))

        conn.commit()
        conn.close()

        msg = f"Successfully bought {quantity} shares of {symbol} at ₹{price:,.2f}. Total: ₹{total_cost:,.2f}"
        flash(msg, "success")
        return jsonify({
            "success": True,
            "message": msg,
            "new_cash": new_cash,
            "order_id": order_id
        })

    elif trade_type == "SELL":
        holding = cursor.execute(
            "SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?", (user_id, symbol)
        ).fetchone()

        if not holding or holding["quantity"] < quantity:
            owned = holding["quantity"] if holding else 0
            conn.close()
            return jsonify({
                "success": False,
                "error": f"Cannot sell {quantity} shares. You currently own {owned} shares of {symbol}."
            }), 400

        new_cash = round(current_cash + total_cost, 2)
        cursor.execute("UPDATE users SET cash = ? WHERE id = ?", (new_cash, user_id))

        new_qty = holding["quantity"] - quantity
        if new_qty == 0:
            cursor.execute("DELETE FROM portfolio WHERE user_id = ? AND symbol = ?", (user_id, symbol))
        else:
            cursor.execute("""
                UPDATE portfolio SET quantity = ?
                WHERE user_id = ? AND symbol = ?
            """, (new_qty, user_id, symbol))

        # Record order
        cursor.execute("""
            INSERT INTO orders (order_id, user_id, symbol, order_type, quantity, price, total, status, created_at)
            VALUES (?, ?, ?, 'SELL', ?, ?, ?, 'COMPLETED', ?)
        """, (order_id, user_id, symbol, quantity, price, total_cost, now_str))

        # Record transaction
        cursor.execute("""
            INSERT INTO transactions (user_id, type, symbol, quantity, price, amount, cash_balance, timestamp)
            VALUES (?, 'SELL', ?, ?, ?, ?, ?, ?)
        """, (user_id, symbol, quantity, price, total_cost, new_cash, now_str))

        conn.commit()
        conn.close()

        msg = f"Successfully sold {quantity} shares of {symbol} at ₹{price:,.2f}. Total credited: ₹{total_cost:,.2f}"
        flash(msg, "success")
        return jsonify({
            "success": True,
            "message": msg,
            "new_cash": new_cash,
            "order_id": order_id
        })


@app.route("/api/watchlist/toggle", methods=["POST"])
def api_watchlist_toggle():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    user_id = session["user_id"]
    data = request.get_json() or request.form
    symbol = data.get("symbol", "").strip().upper()

    if not symbol:
        return jsonify({"success": False, "error": "Symbol is required."}), 400

    conn = get_db()
    cursor = conn.cursor()

    existing = cursor.execute(
        "SELECT id FROM watchlist WHERE user_id = ? AND symbol = ?", (user_id, symbol)
    ).fetchone()

    if existing:
        cursor.execute("DELETE FROM watchlist WHERE user_id = ? AND symbol = ?", (user_id, symbol))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "in_watchlist": False, "message": f"Removed {symbol} from watchlist."})
    else:
        cursor.execute("INSERT OR IGNORE INTO watchlist (user_id, symbol) VALUES (?, ?)", (user_id, symbol))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "in_watchlist": True, "message": f"Added {symbol} to watchlist."})


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    init_db()
    print("""
================================
        STOCKX STARTED
================================

Open:
http://127.0.0.1:5000

Demo Login:
demo@stockx.com
Password: 123456

================================
""")
    app.run(host="0.0.0.0", port=5000, debug=True)
