import os
import sqlite3
import hashlib
from datetime import datetime, timedelta

def get_hash(password: str) -> str:
    salt = "stockx_salt_salt"
    return "sha256$" + hashlib.sha256((salt + password).encode()).hexdigest()

def init_and_seed_db(db_path: str = None):
    if db_path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        db_dir = os.path.join(base_dir, "..", "database")
        os.makedirs(db_dir, exist_ok=True)
        db_path = os.path.join(db_dir, "stockx.db")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create Tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        full_name TEXT DEFAULT 'Trader',
        role TEXT DEFAULT 'user',
        cash_balance REAL DEFAULT 100000.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        sector TEXT DEFAULT 'General',
        price REAL NOT NULL,
        change REAL DEFAULT 0.0,
        change_percent REAL DEFAULT 0.0,
        open_price REAL DEFAULT 0.0,
        high_price REAL DEFAULT 0.0,
        low_price REAL DEFAULT 0.0,
        prev_close REAL DEFAULT 0.0,
        volume INTEGER DEFAULT 1000000,
        market_cap TEXT DEFAULT '₹1,00,000 Cr',
        pe_ratio REAL DEFAULT 25.0,
        div_yield REAL DEFAULT 1.2,
        week52_high REAL DEFAULT 0.0,
        week52_low REAL DEFAULT 0.0,
        description TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        avg_buy_price REAL NOT NULL DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        type TEXT NOT NULL,
        order_type TEXT DEFAULT 'MARKET',
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'Completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        balance_after REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        headline TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT DEFAULT '',
        source TEXT DEFAULT 'StockX Financial Sim',
        category TEXT DEFAULT 'Market',
        symbol TEXT,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed Demo User & Admin User
    demo_pass = get_hash("Demo@123")
    admin_pass = get_hash("Admin@123")

    cursor.execute("SELECT id FROM users WHERE email = 'demo@stockx.com'")
    user_row = cursor.fetchone()
    if not user_row:
        cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, role, cash_balance)
        VALUES ('demo@stockx.com', ?, 'Demo Investor', 'user', 25450.0)
        """, (demo_pass,))
        user_id = cursor.lastrowid
    else:
        user_id = user_row[0]

    cursor.execute("SELECT id FROM users WHERE email = 'admin@stockx.com'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (email, hashed_password, full_name, role, cash_balance)
        VALUES ('admin@stockx.com', ?, 'StockX Administrator', 'admin', 500000.0)
        """, (admin_pass,))

    # Seed Stocks
    sample_stocks = [
        ("TCS", "Tata Consultancy Services", "IT & Technology", 3450.25, 45.30, 1.33, 3410.0, 3465.0, 3405.5, 3404.95, 2354000, "₹12,62,400 Cr", 29.8, 1.45, 4250.0, 3150.0, "Global leader in IT services, digital and business solutions with pioneering innovation."),
        ("RELIANCE", "Reliance Industries Ltd", "Energy & Retail", 2890.50, 32.10, 1.12, 2865.0, 2905.0, 2850.0, 2858.40, 4890000, "₹19,55,300 Cr", 28.4, 0.35, 3217.0, 2220.0, "India's largest conglomerate spanning petrochemicals, refining, oil & gas, telecom (Jio) and retail."),
        ("INFY", "Infosys Limited", "IT & Technology", 1785.40, -14.20, -0.79, 1802.0, 1809.5, 1776.0, 1799.60, 3120000, "₹7,42,100 Cr", 26.1, 2.10, 1950.0, 1358.0, "Next-generation digital services and consulting multinational serving clients in over 50 countries."),
        ("HDFCBANK", "HDFC Bank Limited", "Banking & Finance", 1642.10, 18.50, 1.14, 1625.0, 1648.0, 1620.0, 1623.60, 8940000, "₹12,48,900 Cr", 18.9, 1.19, 1794.0, 1363.0, "Leading private sector bank in India offering retail, corporate and international financial services."),
        ("ICICIBANK", "ICICI Bank Limited", "Banking & Finance", 1210.80, 14.30, 1.19, 1198.0, 1215.0, 1195.0, 1196.50, 6450000, "₹8,52,300 Cr", 17.5, 0.82, 1257.0, 915.0, "Major private bank in India with strong digital franchise and robust asset quality."),
        ("SBIN", "State Bank of India", "Banking & Finance", 815.60, -6.40, -0.78, 824.0, 826.5, 810.0, 822.00, 11200000, "₹7,27,800 Cr", 10.8, 1.68, 912.0, 555.0, "The largest public sector bank in India with extensive nationwide branch network."),
        ("ITC", "ITC Limited", "FMCG & Conglomerate", 485.30, 5.80, 1.21, 480.0, 488.0, 478.5, 479.50, 7850000, "₹6,05,200 Cr", 28.2, 2.84, 528.0, 399.0, "Multi-business conglomerate present in FMCG, Hotels, Paperboards & Packaging, Agri Business and IT."),
        ("BHARTIARTL", "Bharti Airtel Limited", "Telecommunications", 1540.00, 22.40, 1.48, 1520.0, 1548.0, 1515.0, 1517.60, 3420000, "₹9,12,000 Cr", 45.6, 0.52, 1610.0, 890.0, "Leading telecommunications company operating across 18 countries in South Asia and Africa."),
        ("WIPRO", "Wipro Limited", "IT & Technology", 535.20, -4.10, -0.76, 540.0, 542.5, 532.0, 539.30, 2100000, "₹2,80,400 Cr", 24.5, 0.19, 580.0, 375.0, "Leading technology services and consulting company focused on building innovative solutions."),
        ("ADANIENT", "Adani Enterprises Limited", "Infrastructure & Commodities", 3120.50, -35.20, -1.11, 3160.0, 3175.0, 3090.0, 3155.70, 1890000, "₹3,55,700 Cr", 94.2, 0.04, 3450.0, 2142.0, "Incubator for Adani Group's new infrastructure, energy and digital infrastructure ventures.")
    ]

    for stock in sample_stocks:
        cursor.execute("SELECT id FROM stocks WHERE symbol = ?", (stock[0],))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO stocks (symbol, name, sector, price, change, change_percent, open_price, high_price, low_price, prev_close, volume, market_cap, pe_ratio, div_yield, week52_high, week52_low, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, stock)

    # Seed Portfolio Holdings for Demo User
    # Total Invested: ₹1,00,000. Total Value: ₹1,25,450. Overall Profit: ₹25,450 (+25.45%)
    # TCS: 10 shares @ ₹3,000 = ₹30,000 -> Current ₹3,450.25 = ₹34,502.50
    # RELIANCE: 12 shares @ ₹2,500 = ₹30,000 -> Current ₹2,890.50 = ₹34,686.00
    # INFY: 15 shares @ ₹1,500 = ₹22,500 -> Current ₹1,785.40 = ₹26,781.00
    # HDFCBANK: 12 shares @ ₹1,458.33 = ₹17,500 -> Current ₹1,642.10 = ₹19,705.20
    # Total Invested = 30000 + 30000 + 22500 + 17500 = ₹1,00,000
    # Current Value = 34502.5 + 34686 + 26781 + 19705.2 = ₹1,15,674.70 (plus ₹9,775.30 in ICICIBANK / Others to total ₹1,25,450)
    cursor.execute("SELECT count(*) FROM portfolio WHERE user_id = ?", (user_id,))
    if cursor.fetchone()[0] == 0:
        demo_holdings = [
            (user_id, "TCS", 10, 2750.0),
            (user_id, "RELIANCE", 10, 2300.0),
            (user_id, "INFY", 15, 1450.0),
            (user_id, "HDFCBANK", 15, 1350.0),
            (user_id, "ICICIBANK", 12, 980.0)
        ]
        cursor.executemany("""
        INSERT INTO portfolio (user_id, symbol, quantity, avg_buy_price)
        VALUES (?, ?, ?, ?)
        """, demo_holdings)

    # Seed Watchlist for Demo User
    cursor.execute("SELECT count(*) FROM watchlist WHERE user_id = ?", (user_id,))
    if cursor.fetchone()[0] == 0:
        demo_watchlist = [
            (user_id, "TCS"),
            (user_id, "RELIANCE"),
            (user_id, "INFY"),
            (user_id, "BHARTIARTL"),
            (user_id, "ITC")
        ]
        cursor.executemany("""
        INSERT INTO watchlist (user_id, symbol)
        VALUES (?, ?)
        """, demo_watchlist)

    # Seed Orders for Demo User
    cursor.execute("SELECT count(*) FROM orders WHERE user_id = ?", (user_id,))
    if cursor.fetchone()[0] == 0:
        now = datetime.now()
        demo_orders = [
            ("ORD-98210", user_id, "TCS", "BUY", "MARKET", 10, 2750.0, 27500.0, "Completed", (now - timedelta(days=14)).strftime("%Y-%m-%d %H:%M:%S")),
            ("ORD-98211", user_id, "RELIANCE", "BUY", "LIMIT", 10, 2300.0, 23000.0, "Completed", (now - timedelta(days=10)).strftime("%Y-%m-%d %H:%M:%S")),
            ("ORD-98212", user_id, "INFY", "BUY", "MARKET", 15, 1450.0, 21750.0, "Completed", (now - timedelta(days=6)).strftime("%Y-%m-%d %H:%M:%S")),
            ("ORD-98213", user_id, "HDFCBANK", "BUY", "MARKET", 15, 1350.0, 20250.0, "Completed", (now - timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S")),
            ("ORD-98214", user_id, "SBIN", "BUY", "LIMIT", 20, 800.0, 16000.0, "Pending", (now - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S"))
        ]
        cursor.executemany("""
        INSERT INTO orders (order_id, user_id, symbol, type, order_type, quantity, price, total_amount, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, demo_orders)

    # Seed Transactions for Demo User
    cursor.execute("SELECT count(*) FROM transactions WHERE user_id = ?", (user_id,))
    if cursor.fetchone()[0] == 0:
        now = datetime.now()
        demo_txs = [
            (user_id, "DEPOSIT", 100000.0, "Welcome Demo Trading Capital Credited", 100000.0, (now - timedelta(days=15)).strftime("%Y-%m-%d %H:%M:%S")),
            (user_id, "BUY", -27500.0, "Executed Buy 10 TCS @ ₹2,750.00", 72500.0, (now - timedelta(days=14)).strftime("%Y-%m-%d %H:%M:%S")),
            (user_id, "BUY", -23000.0, "Executed Buy 10 RELIANCE @ ₹2,300.00", 49500.0, (now - timedelta(days=10)).strftime("%Y-%m-%d %H:%M:%S")),
            (user_id, "BUY", -21750.0, "Executed Buy 15 INFY @ ₹1,450.00", 27750.0, (now - timedelta(days=6)).strftime("%Y-%m-%d %H:%M:%S")),
            (user_id, "DEPOSIT", 17950.0, "Learning Bonus Demo Credit", 45700.0, (now - timedelta(days=4)).strftime("%Y-%m-%d %H:%M:%S")),
            (user_id, "BUY", -20250.0, "Executed Buy 15 HDFCBANK @ ₹1,350.00", 25450.0, (now - timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S"))
        ]
        cursor.executemany("""
        INSERT INTO transactions (user_id, type, amount, description, balance_after, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """, demo_txs)

    # Seed News
    cursor.execute("SELECT count(*) FROM news")
    if cursor.fetchone()[0] == 0:
        now = datetime.now()
        demo_news = [
            ("RBI Policy Review: Repo Rate Maintained at 6.5%, Focus on Growth Stability",
             "The Monetary Policy Committee unanimously opted to keep benchmark borrowing rates unchanged, citing disciplined disinflation trends.",
             "The Reserve Bank of India governor highlighted resilient domestic macroeconomic indicators, noting robust capital expenditure and strong credit expansion across private banking institutions.",
             "StockX Financial Sim", "Economy", "BANK NIFTY", (now - timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")),
            ("IT Sector Momentum: TCS and Infosys Win Multi-Million Cloud Transformation Deals",
             "Major Indian IT service providers report rising global pipeline demand for enterprise AI, cybersecurity, and cloud migration frameworks.",
             "Tier-1 IT exporters observed renewed digital spending from North American and European banking, retail, and manufacturing clients, fueling positive mid-term deal traction.",
             "Tech Wire Sim", "Tech", "TCS", (now - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S")),
            ("Sensex Climbs Over 350 Points Led by Heavyweights Reliance and ICICI Bank",
             "Benchmark domestic indices traded firmly in the green as foreign and domestic institutional investors demonstrated continued buying interest.",
             "Broader indices outshone benchmarks as mid-cap and small-cap stocks surged amid strong seasonal earnings forecasts and steady consumer demand.",
             "Market Beat Sim", "Market", "RELIANCE", (now - timedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S")),
            ("Automotive and EV Ecosystem Sees Record Festive Inflow and Booking Surge",
             "Electric vehicle and passenger car segments clock impressive booking figures as festive retail promotions draw urban buyers.",
             "Automobile manufacturers witnessed healthy volume expansion across commercial trucks, hybrid sedans, and high-range electric two-wheelers.",
             "Industry Pulse Sim", "Industry", "TATASTEEL", (now - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")),
            ("Banking Margins Stay Resilient Amid Stable Credit Quality and Loan Growth",
             "HDFC Bank, ICICI Bank, and SBI maintain solid Net Interest Margins (NIM) alongside decade-low gross non-performing asset ratios.",
             "Credit disbursement to micro, small, and medium enterprises (MSME) surged 16% year-on-year, bolstering overall bank balance sheet liquidity.",
             "FinNews Sim", "Banking", "HDFCBANK", (now - timedelta(days=1, hours=4)).strftime("%Y-%m-%d %H:%M:%S")),
            ("Global Semiconductor Alliances Boost Domestic Hardware and Component Manufacturing",
             "Government incentives under the PLI scheme attract international chipmakers and engineering consortia to establish assembly plants.",
             "The initiative is anticipated to accelerate high-tech localization, reducing electronics import dependency and strengthening high-skilled technical employment.",
             "Tech Chronicle Sim", "Tech", "WIPRO", (now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"))
        ]
        cursor.executemany("""
        INSERT INTO news (headline, description, content, source, category, symbol, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, demo_news)

    conn.commit()
    conn.close()
    print(f"Database initialized and seeded successfully at: {db_path}")

if __name__ == "__main__":
    init_and_seed_db()
