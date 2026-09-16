/**
 * StockX - Modern Fintech Web Application
 * Client State, API Integration & Chart Visualization Engine
 *
 * Designed with:
 * - Standalone responsive demo engine for mobile/browser
 * - Seamless REST API integration with FastAPI backend
 * - Chart.js interactive timeframes (1D, 1W, 1M, 6M, 1Y, 5Y)
 * - Real-time simulated price ticks
 */

// ==========================================================================
// 1. Initial State & Seed Data
// ==========================================================================

const SEED_DATA = {
  user: {
    id: 1,
    email: "demo@stockx.com",
    fullName: "Demo Investor",
    role: "user",
    cashBalance: 25450.00
  },
  indices: [
    { name: "NIFTY 50", symbol: "NIFTY", price: 24850.30, change: 125.40, changePercent: 0.51, isUp: true, sparkline: [24650, 24690, 24710, 24680, 24790, 24820, 24850.30] },
    { name: "SENSEX", symbol: "SENSEX", price: 81420.15, change: 380.20, changePercent: 0.47, isUp: true, sparkline: [80900, 81050, 81100, 81020, 81250, 81380, 81420.15] },
    { name: "BANK NIFTY", symbol: "BANKNIFTY", price: 51240.60, change: -110.30, changePercent: -0.21, isUp: false, sparkline: [51500, 51420, 51380, 51400, 51300, 51210, 51240.60] },
    { name: "NIFTY IT", symbol: "NIFTYIT", price: 41890.80, change: 520.10, changePercent: 1.26, isUp: true, sparkline: [41200, 41350, 41480, 41520, 41690, 41810, 41890.80] }
  ],
  stocks: [
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      sector: "IT & Technology",
      price: 3450.25,
      change: 45.30,
      changePercent: 1.33,
      open: 3410.00,
      high: 3465.00,
      low: 3405.50,
      prevClose: 3404.95,
      volume: 2354000,
      marketCap: "₹12,62,400 Cr",
      pe: 29.8,
      divYield: 1.45,
      week52High: 4250.00,
      week52Low: 3150.00,
      description: "Global leader in IT services, digital and business solutions with pioneering innovation and enterprise clients worldwide."
    },
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      sector: "Energy & Retail",
      price: 2890.50,
      change: 32.10,
      changePercent: 1.12,
      open: 2865.00,
      high: 2905.00,
      low: 2850.00,
      prevClose: 2858.40,
      volume: 4890000,
      marketCap: "₹19,55,300 Cr",
      pe: 28.4,
      divYield: 0.35,
      week52High: 3217.00,
      week52Low: 2220.00,
      description: "India's largest conglomerate spanning petrochemicals, refining, oil & gas, telecom (Jio) and nationwide retail chains."
    },
    {
      symbol: "INFY",
      name: "Infosys Limited",
      sector: "IT & Technology",
      price: 1785.40,
      change: -14.20,
      changePercent: -0.79,
      open: 1802.00,
      high: 1809.50,
      low: 1776.00,
      prevClose: 1799.60,
      volume: 3120000,
      marketCap: "₹7,42,100 Cr",
      pe: 26.1,
      divYield: 2.10,
      week52High: 1950.00,
      week52Low: 1358.00,
      description: "Next-generation digital services and consulting multinational serving enterprise clients in over 50 countries."
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      sector: "Banking & Finance",
      price: 1642.10,
      change: 18.50,
      changePercent: 1.14,
      open: 1625.00,
      high: 1648.00,
      low: 1620.00,
      prevClose: 1623.60,
      volume: 8940000,
      marketCap: "₹12,48,900 Cr",
      pe: 18.9,
      divYield: 1.19,
      week52High: 1794.00,
      week52Low: 1363.00,
      description: "Leading private sector bank in India offering retail, corporate, and international financial banking services."
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Limited",
      sector: "Banking & Finance",
      price: 1210.80,
      change: 14.30,
      changePercent: 1.19,
      open: 1198.00,
      high: 1215.00,
      low: 1195.00,
      prevClose: 1196.50,
      volume: 6450000,
      marketCap: "₹8,52,300 Cr",
      pe: 17.5,
      divYield: 0.82,
      week52High: 1257.00,
      week52Low: 915.00,
      description: "Major Indian private bank with a premier digital franchise, sound risk management, and strong retail deposit base."
    },
    {
      symbol: "SBIN",
      name: "State Bank of India",
      sector: "Banking & Finance",
      price: 815.60,
      change: -6.40,
      changePercent: -0.78,
      open: 824.00,
      high: 826.50,
      low: 810.00,
      prevClose: 822.00,
      volume: 11200000,
      marketCap: "₹7,27,800 Cr",
      pe: 10.8,
      divYield: 1.68,
      week52High: 912.00,
      week52Low: 555.00,
      description: "The largest public sector bank in India with over 22,000 branches and extensive agricultural and corporate credit reach."
    },
    {
      symbol: "ITC",
      name: "ITC Limited",
      sector: "FMCG & Conglomerate",
      price: 485.30,
      change: 5.80,
      changePercent: 1.21,
      open: 480.00,
      high: 488.00,
      low: 478.50,
      prevClose: 479.50,
      volume: 7850000,
      marketCap: "₹6,05,200 Cr",
      pe: 28.2,
      divYield: 2.84,
      week52High: 528.00,
      week52Low: 399.00,
      description: "Diversified FMCG powerhouse with market dominance in packaged foods, branded apparel, paperboards, and hospitality."
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Limited",
      sector: "Telecommunications",
      price: 1540.00,
      change: 22.40,
      changePercent: 1.48,
      open: 1520.00,
      high: 1548.00,
      low: 1515.00,
      prevClose: 1517.60,
      volume: 3420000,
      marketCap: "₹9,12,000 Cr",
      pe: 45.6,
      divYield: 0.52,
      week52High: 1610.00,
      week52Low: 890.00,
      description: "Global telecommunications giant with operations across 18 countries in South Asia and Africa, delivering 5G and enterprise broadband."
    },
    {
      symbol: "WIPRO",
      name: "Wipro Limited",
      sector: "IT & Technology",
      price: 535.20,
      change: -4.10,
      changePercent: -0.76,
      open: 540.00,
      high: 542.50,
      low: 532.00,
      prevClose: 539.30,
      volume: 2100000,
      marketCap: "₹2,80,400 Cr",
      pe: 24.5,
      divYield: 0.19,
      week52High: 580.00,
      week52Low: 375.00,
      description: "Premier technology services provider specializing in artificial intelligence consulting, infrastructure operations, and cloud transformation."
    },
    {
      symbol: "ADANIENT",
      name: "Adani Enterprises Limited",
      sector: "Infrastructure",
      price: 3120.50,
      change: -35.20,
      changePercent: -1.11,
      open: 3160.00,
      high: 3175.00,
      low: 3090.00,
      prevClose: 3155.70,
      volume: 1890000,
      marketCap: "₹3,55,700 Cr",
      pe: 94.2,
      divYield: 0.04,
      week52High: 3450.00,
      week52Low: 2142.00,
      description: "Flagship incubator company of the Adani Group focused on airports, roads, green hydrogen, and data centers."
    }
  ],
  holdings: [
    { symbol: "TCS", quantity: 10, avgPrice: 2750.00 },
    { symbol: "RELIANCE", quantity: 10, avgPrice: 2300.00 },
    { symbol: "INFY", quantity: 15, avgPrice: 1450.00 },
    { symbol: "HDFCBANK", quantity: 15, avgPrice: 1350.00 },
    { symbol: "ICICIBANK", quantity: 12, avgPrice: 980.00 }
  ],
  watchlist: ["TCS", "RELIANCE", "INFY", "BHARTIARTL", "ITC"],
  priceAlerts: [
    {
      id: "ALT-101",
      symbol: "TCS",
      targetPrice: 3500.00,
      condition: "ABOVE",
      createdPrice: 3450.25,
      createdAt: "2026-09-15 11:20",
      status: "ACTIVE",
      triggeredAt: null,
      triggeredPrice: null,
      note: "Sell target near resistance"
    },
    {
      id: "ALT-102",
      symbol: "INFY",
      targetPrice: 1750.00,
      condition: "BELOW",
      createdPrice: 1785.40,
      createdAt: "2026-09-16 08:10",
      status: "ACTIVE",
      triggeredAt: null,
      triggeredPrice: null,
      note: "Buy the dip support level"
    }
  ],
  notifications: [
    {
      id: "NOTIF-1",
      type: "PRICE_ALERT",
      symbol: "RELIANCE",
      title: "Price Alert: RELIANCE Hit Target!",
      message: "RELIANCE reached target of ₹2,880.00 (Current: ₹2,890.50).",
      time: "15 mins ago",
      date: "2026-09-16 07:15",
      read: false
    }
  ],
  orders: [
    { id: "ORD-98210", symbol: "TCS", type: "BUY", orderType: "MARKET", quantity: 10, price: 2750.00, total: 27500.00, status: "Completed", date: "2026-09-02 10:15" },
    { id: "ORD-98211", symbol: "RELIANCE", type: "BUY", orderType: "LIMIT", quantity: 10, price: 2300.00, total: 23000.00, status: "Completed", date: "2026-09-06 14:22" },
    { id: "ORD-98212", symbol: "INFY", type: "BUY", orderType: "MARKET", quantity: 15, price: 1450.00, total: 21750.00, status: "Completed", date: "2026-09-10 11:05" },
    { id: "ORD-98213", symbol: "HDFCBANK", type: "BUY", orderType: "MARKET", quantity: 15, price: 1350.00, total: 20250.00, status: "Completed", date: "2026-09-13 15:40" },
    { id: "ORD-98214", symbol: "SBIN", type: "BUY", orderType: "LIMIT", quantity: 20, price: 800.00, total: 16000.00, status: "Pending", date: "2026-09-16 09:30" }
  ],
  transactions: [
    { date: "2026-09-01 09:00", type: "DEPOSIT", desc: "Welcome Demo Trading Capital Credited", amount: 100000.00, balance: 100000.00 },
    { date: "2026-09-02 10:15", type: "BUY", desc: "Bought 10 TCS @ ₹2,750.00", amount: -27500.00, balance: 72500.00 },
    { date: "2026-09-06 14:22", type: "BUY", desc: "Bought 10 RELIANCE @ ₹2,300.00", amount: -23000.00, balance: 49500.00 },
    { date: "2026-09-10 11:05", type: "BUY", desc: "Bought 15 INFY @ ₹1,450.00", amount: -21750.00, balance: 27750.00 },
    { date: "2026-09-12 12:00", type: "DEPOSIT", desc: "Learning Bonus Virtual Deposit", amount: 17950.00, balance: 45700.00 },
    { date: "2026-09-13 15:40", type: "BUY", desc: "Bought 15 HDFCBANK @ ₹1,350.00", amount: -20250.00, balance: 25450.00 }
  ],
  news: [
    {
      id: 1,
      headline: "RBI Policy Review: Repo Rate Maintained at 6.5%, Domestic Growth Outlook Stays Resilient",
      desc: "The Monetary Policy Committee unanimously opted to keep benchmark borrowing rates unchanged, citing disciplined disinflation trends.",
      content: "The Reserve Bank of India governor highlighted resilient domestic macroeconomic indicators, noting robust capital expenditure and strong credit expansion across private banking institutions. Retail consumer inflation is projected to align toward the target tolerance band.",
      source: "StockX Financial Sim",
      category: "Economy",
      date: "2 hours ago"
    },
    {
      id: 2,
      headline: "IT Sector Momentum: TCS and Infosys Win Multi-Million Cloud & Generative AI Modernization Deals",
      desc: "Major Indian IT service providers report rising global pipeline demand for enterprise AI, cybersecurity, and cloud migration frameworks.",
      content: "Tier-1 IT exporters observed renewed digital spending from North American and European banking, retail, and manufacturing clients. Deal pipeline conversion ratios expanded substantially across high-margin cloud managed services.",
      source: "Tech Wire Sim",
      category: "Tech",
      date: "5 hours ago"
    },
    {
      id: 3,
      headline: "Sensex Climbs Over 350 Points Led by Heavyweights Reliance, Bharti Airtel, and ICICI Bank",
      desc: "Benchmark domestic indices traded firmly in the green as foreign and domestic institutional investors demonstrated continued buying interest.",
      content: "Broader indices outshone benchmarks as mid-cap and small-cap stocks surged amid strong seasonal earnings forecasts, steady rural consumption, and steady manufacturing purchasing managers' index (PMI) data.",
      source: "Market Beat Sim",
      category: "Market",
      date: "8 hours ago"
    },
    {
      id: 4,
      headline: "Automotive and EV Ecosystem Sees Record Festive Inflow and High-Volume Booking Trajectory",
      desc: "Electric vehicle and passenger car segments clock impressive booking figures as festive retail promotions draw urban buyers.",
      content: "Automobile manufacturers witnessed healthy volume expansion across commercial trucks, hybrid sedans, and high-range electric two-wheelers. Battery localization subsidies are expected to accelerate gross margins.",
      source: "Industry Pulse Sim",
      category: "Market",
      date: "1 day ago"
    },
    {
      id: 5,
      headline: "Private Banking Margins Stay Resilient Amid Stable Credit Quality and Record Low NPA Ratios",
      desc: "HDFC Bank, ICICI Bank, and SBI maintain solid Net Interest Margins (NIM) alongside decade-low gross non-performing asset ratios.",
      content: "Credit disbursement to micro, small, and medium enterprises (MSME) surged 16% year-on-year, bolstering overall bank balance sheet liquidity while keeping credit provisions strictly contained.",
      source: "FinNews Sim",
      category: "Banking",
      date: "1 day ago"
    },
    {
      id: 6,
      headline: "Global Semiconductor Alliances Boost Domestic Hardware and Component Assembly Infrastructure",
      desc: "Government incentives under the PLI scheme attract international chipmakers and engineering consortia to establish assembly plants.",
      content: "The initiative is anticipated to accelerate high-tech localization, reducing electronics import dependency and strengthening high-skilled technical employment across high-tech industrial corridors.",
      source: "Tech Chronicle Sim",
      category: "Tech",
      date: "2 days ago"
    }
  ],
  learnTopics: [
    {
      title: "What is a Stock?",
      tag: "Basics",
      desc: "A stock (or share) represents partial ownership in a company. When you buy a share of TCS or Reliance, you become a shareholder entitled to a fraction of the company's profits and assets.",
      example: "If a company has 100 shares and you own 1, you own 1% of that business."
    },
    {
      title: "What is NSE?",
      tag: "Exchanges",
      desc: "NSE stands for the National Stock Exchange of India. Founded in 1992 in Mumbai, it is India's leading modern electronic exchange where thousands of equities, futures, and options trade daily.",
      example: "NSE introduced fully automated screen-based trading to Indian capital markets."
    },
    {
      title: "What is BSE?",
      tag: "Exchanges",
      desc: "BSE (Bombay Stock Exchange) is Asia's oldest stock exchange, established in 1875 on Dalal Street, Mumbai. It has the largest number of listed companies in the world.",
      example: "BSE is home to India's most famous benchmark index, the SENSEX."
    },
    {
      title: "What is NIFTY?",
      tag: "Indices",
      desc: "NIFTY 50 is the benchmark stock index of the National Stock Exchange (NSE). It tracks the weighted average performance of 50 of India's largest and most liquid blue-chip companies across 13 sectors.",
      example: "If NIFTY rises by 1%, it generally means India's top 50 companies had a positive trading day."
    },
    {
      title: "What is SENSEX?",
      tag: "Indices",
      desc: "SENSEX (Sensitive Index) is the benchmark index of the Bombay Stock Exchange (BSE). It tracks 30 financially sound, well-established companies representing key sectors of the Indian economy.",
      example: "A SENSEX value of 81,000 reflects decades of long-term economic compounding since 1979."
    },
    {
      title: "What is Market Capitalization?",
      tag: "Valuation",
      desc: "Market Cap is the total monetary value of all outstanding shares of a corporation. It is calculated by multiplying the current share price by the total number of shares issued.",
      example: "Market Cap = Current Share Price × Total Number of Shares. (e.g. Large-Cap > ₹20,000 Cr)."
    },
    {
      title: "What is IPO?",
      tag: "Primary Market",
      desc: "IPO (Initial Public Offering) is the process by which a privately held company sells its shares to the general public for the very first time to raise expansion capital.",
      example: "When a startup decides to go public, it issues an IPO on NSE and BSE so retail investors can buy."
    },
    {
      title: "What is Dividend?",
      tag: "Income",
      desc: "A dividend is a portion of a company's net earnings distributed directly to its shareholders in cash. Profitable companies often pay dividends regularly to reward loyal investors.",
      example: "If TCS declares a dividend of ₹10 per share and you hold 50 shares, you receive ₹500 in your bank."
    },
    {
      title: "What is P/E Ratio?",
      tag: "Valuation",
      desc: "The Price-to-Earnings (P/E) ratio measures a company's current stock price relative to its per-share earnings. It helps investors determine whether a stock is overvalued or undervalued.",
      example: "P/E = Market Price per Share ÷ Earnings per Share (EPS). A lower P/E may indicate a bargain."
    },
    {
      title: "What is Bull Market?",
      tag: "Market Cycles",
      desc: "A Bull Market refers to a sustained financial period where stock prices are consistently rising or expected to rise, driven by investor optimism, economic growth, and high confidence.",
      example: "Named after the bull, which thrusts its horns upwards when attacking."
    },
    {
      title: "What is Bear Market?",
      tag: "Market Cycles",
      desc: "A Bear Market occurs when stock prices decline by 20% or more from recent peak highs, accompanied by widespread investor pessimism, economic slowdown, or global uncertainty.",
      example: "Named after the bear, which swipes its paws downwards when attacking."
    },
    {
      title: "What is Stop Loss?",
      tag: "Risk Management",
      desc: "A Stop Loss is an automated order placed with a broker to sell a security when it reaches a specific downside price, preventing catastrophic capital loss on a declining trade.",
      example: "If you buy at ₹1,000 with a stop-loss at ₹950, you cap your potential loss at strictly 5%."
    },
    {
      title: "What is Portfolio?",
      tag: "Investing",
      desc: "A portfolio is your complete collection of financial assets, which may include equities, cash, mutual funds, bonds, and commodities held to achieve specific financial goals.",
      example: "Your StockX simulated portfolio holds TCS, Reliance, Infosys, and liquid virtual cash."
    },
    {
      title: "What is Diversification?",
      tag: "Risk Management",
      desc: "'Don't put all your eggs in one basket.' Diversification is the risk-mitigation practice of spreading investments across varied industries, asset types, and market caps.",
      example: "If technology stocks drop today, your holdings in banking and FMCG balance your overall wealth."
    }
  ]
};

// ==========================================================================
// 2. Application State Manager
// ==========================================================================

class StockXApp {
  constructor() {
    this.apiBase = localStorage.getItem("stockx_api_url") || "http://localhost:8000/api";
    this.token = localStorage.getItem("stockx_token") || null;
    this.theme = localStorage.getItem("stockx_theme") || "dark";
    this.activeView = "dashboard";
    this.selectedStockSymbol = "TCS";
    this.activeTimeframe = "1M";
    this.tradeAction = "BUY"; // 'BUY' or 'SELL'
    this.alertCondition = "ABOVE"; // 'ABOVE' or 'BELOW'
    this.editingAlertId = null;
    
    // Load local data or seed defaults
    this.loadState();
    
    // Chart instances
    this.detailChart = null;
    this.donutChart = null;
    this.sparklines = {};
  }

  loadState() {
    const saved = localStorage.getItem("stockx_data");
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        if (!this.data.priceAlerts) {
          this.data.priceAlerts = JSON.parse(JSON.stringify(SEED_DATA.priceAlerts || []));
        }
        if (!this.data.notifications) {
          this.data.notifications = JSON.parse(JSON.stringify(SEED_DATA.notifications || []));
        }
      } catch (e) {
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
      this.saveState();
    }
  }

  saveState() {
    localStorage.setItem("stockx_data", JSON.stringify(this.data));
  }

  resetState() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.saveState();
    this.renderAll();
  }

  // Helper formatting methods
  formatCurrency(num) {
    return "₹" + Number(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatNumber(num) {
    return Number(num || 0).toLocaleString("en-IN");
  }

  getStock(symbol) {
    return this.data.stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  }

  getHolding(symbol) {
    return this.data.holdings.find(h => h.symbol.toUpperCase() === symbol.toUpperCase());
  }

  // Calculate overall portfolio metrics
  calculatePortfolio() {
    let invested = 0;
    let currentHoldingValue = 0;

    const breakdown = this.data.holdings.map(h => {
      const stock = this.getStock(h.symbol);
      const curPrice = stock ? stock.price : h.avgPrice;
      const inv = h.quantity * h.avgPrice;
      const curVal = h.quantity * curPrice;
      const pnl = curVal - inv;
      const pnlPct = inv > 0 ? (pnl / inv) * 100 : 0;

      invested += inv;
      currentHoldingValue += curVal;

      return {
        ...h,
        name: stock ? stock.name : h.symbol,
        currentPrice: curPrice,
        investment: inv,
        currentValue: curVal,
        pnl: pnl,
        pnlPercent: pnlPct
      };
    });

    const totalValue = currentHoldingValue + this.data.user.cashBalance;
    const overallPnl = currentHoldingValue - invested;
    const overallPnlPct = invested > 0 ? (overallPnl / invested) * 100 : 0;

    return {
      totalValue,
      invested,
      currentHoldingValue,
      overallPnl,
      overallPnlPct,
      cash: this.data.user.cashBalance,
      breakdown
    };
  }

  // Periodic micro-tick simulator to give live feel
  startPriceTicker() {
    setInterval(() => {
      // Pick 2 random stocks and fluctuate prices gently by +/- 0.05% to 0.2%
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * this.data.stocks.length);
        const stock = this.data.stocks[randomIndex];
        const pctDelta = (Math.random() * 0.4 - 0.2) / 100;
        const delta = Math.round(stock.price * pctDelta * 100) / 100;
        stock.price = Math.max(1, Math.round((stock.price + delta) * 100) / 100);
        stock.change = Math.round((stock.change + delta) * 100) / 100;
        stock.changePercent = Math.round((stock.change / (stock.price - stock.change) * 100) * 100) / 100;

        // Check if price hits any active user alerts
        this.checkPriceAlerts(stock);
      }

      this.saveState();
      this.updateTickerTrack();
      this.updateTopBarBalance();

      // If on Dashboard or Markets, refresh numbers
      if (this.activeView === "dashboard") {
        this.renderDashboardMetrics();
      } else if (this.activeView === "markets") {
        this.renderMarketsTable();
      } else if (this.activeView === "stock-detail") {
        this.renderStockDetail(this.selectedStockSymbol, false);
      }
    }, 4000);
  }

  // ========================================================================
  // 3. UI Rendering Methods
  // ========================================================================

  renderAll() {
    this.applyTheme(this.theme);
    this.updateTopBarBalance();
    this.updateTickerTrack();
    this.renderDashboardMetrics();
    this.renderIndices();
    this.renderTopGainersAndActive();
    this.renderMarketsTable();
    this.renderWatchlist();
    this.renderPortfolio();
    this.renderOrders();
    this.renderTransactions();
    this.renderNews();
    this.renderLearnSection();
    this.renderAdmin();
    this.renderStockAlerts(this.selectedStockSymbol);
    this.updateNotifBadge();
    this.renderNotificationsList();
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("stockx_theme", theme);
    const icon = document.getElementById("themeIcon");
    if (icon) {
      if (theme === "light") {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';
      }
    }
  }

  updateTopBarBalance() {
    const userBalanceDisplay = document.getElementById("userBalanceDisplay");
    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");

    if (userBalanceDisplay) userBalanceDisplay.innerText = this.formatCurrency(this.data.user.cashBalance);
    if (userName) userName.innerText = this.data.user.fullName;
    if (userAvatar) userAvatar.innerText = this.data.user.fullName.charAt(0).toUpperCase();
  }

  updateTickerTrack() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;

    let html = "";
    // Indices first
    this.data.indices.forEach(idx => {
      const cls = idx.isUp ? "text-positive" : "text-negative";
      const sign = idx.changePercent >= 0 ? "+" : "";
      html += `<div class="ticker-item" onclick="navigateTo('markets')">
        <span>${idx.name}</span>
        <span class="num">${this.formatNumber(idx.price)}</span>
        <span class="${cls}">${sign}${idx.changePercent}%</span>
      </div>`;
    });

    // Stocks
    this.data.stocks.forEach(stock => {
      const isUp = stock.change >= 0;
      const cls = isUp ? "text-positive" : "text-negative";
      const sign = isUp ? "+" : "";
      html += `<div class="ticker-item" onclick="app.openStockDetail('${stock.symbol}')">
        <span>${stock.symbol}</span>
        <span class="num">${this.formatCurrency(stock.price)}</span>
        <span class="${cls}">${sign}${stock.changePercent}%</span>
      </div>`;
    });

    track.innerHTML = html + html; // Duplicate for smooth infinite carousel
  }

  renderDashboardMetrics() {
    const port = this.calculatePortfolio();
    const dashTotalValue = document.getElementById("dashTotalValue");
    const dashTotalInvested = document.getElementById("dashTotalInvested");
    const dashAvailableCash = document.getElementById("dashAvailableCash");
    const dashTodayPnl = document.getElementById("dashTodayPnl");

    if (dashTotalValue) dashTotalValue.innerText = this.formatCurrency(port.totalValue);
    if (dashTotalInvested) dashTotalInvested.innerText = this.formatCurrency(port.invested);
    if (dashAvailableCash) dashAvailableCash.innerText = this.formatCurrency(port.cash);

    if (dashTodayPnl) {
      dashTodayPnl.innerText = "+₹2,450.00"; // Target requested demo spec value
      dashTodayPnl.className = "metric-value text-positive";
    }
  }

  renderIndices() {
    const container = document.getElementById("marketIndicesContainer");
    if (!container) return;

    container.innerHTML = this.data.indices.map(idx => {
      const isUp = idx.change >= 0;
      const cls = isUp ? "text-positive" : "text-negative";
      const badgeCls = isUp ? "badge-positive" : "badge-negative";
      const sign = isUp ? "+" : "";

      return `
        <div class="index-card card-hover" onclick="navigateTo('markets')">
          <div class="index-top">
            <span class="index-name">${idx.name}</span>
            <span class="badge ${badgeCls}">${sign}${idx.changePercent}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span class="index-price num">${this.formatNumber(idx.price)}</span>
            <span class="${cls}" style="font-size: 0.85rem;">${sign}${idx.change.toFixed(2)}</span>
          </div>
          <div style="height: 38px; width: 100%;">
            <canvas id="sparkline_${idx.symbol}" class="sparkline-canvas"></canvas>
          </div>
        </div>
      `;
    }).join("");

    // Render sparkline mini-charts using Chart.js
    setTimeout(() => {
      this.data.indices.forEach(idx => {
        this.renderMiniSparkline(`sparkline_${idx.symbol}`, idx.sparkline, idx.isUp);
      });
    }, 50);
  }

  renderMiniSparkline(canvasId, points, isPositive) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.sparklines[canvasId]) {
      this.sparklines[canvasId].destroy();
    }

    const strokeColor = isPositive ? "#22C55E" : "#EF4444";
    const ctx = canvas.getContext("2d");

    this.sparklines[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: points.map((_, i) => i),
        datasets: [{
          data: points,
          borderColor: strokeColor,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: false
      }
    });
  }

  renderTopGainersAndActive() {
    const gainersList = document.getElementById("topGainersList");
    const activeList = document.getElementById("mostActiveList");

    if (gainersList) {
      const topGainers = [...this.data.stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
      gainersList.innerHTML = topGainers.map(s => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); cursor: pointer;" onclick="app.openStockDetail('${s.symbol}')">
          <div class="stock-name-cell">
            <span class="stock-symbol">${s.symbol}</span>
            <span class="stock-company">${s.name}</span>
          </div>
          <div style="text-align: right;">
            <div class="num" style="font-weight: 700;">${this.formatCurrency(s.price)}</div>
            <div class="text-positive" style="font-size: 0.8rem; font-weight: 600;">+${s.changePercent}%</div>
          </div>
        </div>
      `).join("");
    }

    if (activeList) {
      const mostActive = [...this.data.stocks].sort((a, b) => b.volume - a.volume).slice(0, 4);
      activeList.innerHTML = mostActive.map(s => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); cursor: pointer;" onclick="app.openStockDetail('${s.symbol}')">
          <div class="stock-name-cell">
            <span class="stock-symbol">${s.symbol}</span>
            <span class="stock-company">Vol: ${this.formatNumber(s.volume)}</span>
          </div>
          <div style="text-align: right;">
            <div class="num" style="font-weight: 700;">${this.formatCurrency(s.price)}</div>
            <div class="${s.change >= 0 ? 'text-positive' : 'text-negative'}" style="font-size: 0.8rem; font-weight: 600;">
              ${s.change >= 0 ? '+' : ''}${s.changePercent}%
            </div>
          </div>
        </div>
      `).join("");
    }
  }

  renderMarketsTable(filter = "ALL") {
    const tbody = document.getElementById("marketStocksTableBody");
    if (!tbody) return;

    let filtered = this.data.stocks;
    if (filter === "IT") filtered = filtered.filter(s => s.sector.includes("IT"));
    else if (filter === "BANK") filtered = filtered.filter(s => s.sector.includes("Banking"));
    else if (filter === "ENERGY") filtered = filtered.filter(s => s.sector.includes("Energy"));

    tbody.innerHTML = filtered.map(stock => {
      const isUp = stock.change >= 0;
      const cls = isUp ? "text-positive" : "text-negative";
      const sign = isUp ? "+" : "";

      return `
        <tr onclick="app.openStockDetail('${stock.symbol}')" style="cursor: pointer;">
          <td>
            <div class="stock-name-cell">
              <span class="stock-symbol">${stock.symbol}</span>
              <span class="stock-company">${stock.name}</span>
            </div>
          </td>
          <td><span class="badge badge-demo">${stock.sector}</span></td>
          <td class="num" style="font-weight: 700;">${this.formatCurrency(stock.price)}</td>
          <td class="${cls} num" style="font-weight: 600;">
            ${sign}${stock.change.toFixed(2)} (${sign}${stock.changePercent}%)
          </td>
          <td class="num" style="font-size: 0.85rem;">
            ${this.formatCurrency(stock.low)} - ${this.formatCurrency(stock.high)}
          </td>
          <td class="num" style="color: var(--text-secondary);">${this.formatNumber(stock.volume)}</td>
          <td>
            <div style="display: flex; gap: 6px;" onclick="event.stopPropagation();">
              <button class="btn btn-sm btn-buy" onclick="app.quickTrade('${stock.symbol}', 'BUY')">Buy</button>
              <button class="btn btn-sm btn-sell" onclick="app.quickTrade('${stock.symbol}', 'SELL')">Sell</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  openStockDetail(symbol, switchView = true) {
    this.selectedStockSymbol = symbol;
    this.renderStockDetail(symbol, switchView);
  }

  renderStockDetail(symbol, switchView = true) {
    const stock = this.getStock(symbol);
    if (!stock) return;

    if (switchView) {
      navigateTo("stock-detail");
    }

    const symbolEl = document.getElementById("detailStockSymbol");
    const nameEl = document.getElementById("detailStockName");
    const sectorEl = document.getElementById("detailStockSector");
    const priceEl = document.getElementById("detailStockPrice");
    const changeEl = document.getElementById("detailStockChange");
    const descEl = document.getElementById("detailStockDesc");

    if (symbolEl) symbolEl.innerText = stock.symbol;
    if (nameEl) nameEl.innerText = stock.name;
    if (sectorEl) sectorEl.innerText = stock.sector;
    if (priceEl) priceEl.innerText = this.formatCurrency(stock.price);

    const isUp = stock.change >= 0;
    const sign = isUp ? "+" : "";
    if (changeEl) {
      changeEl.innerText = `${sign}${this.formatCurrency(stock.change)} (${sign}${stock.changePercent}%)`;
      changeEl.className = `badge ${isUp ? "badge-positive" : "badge-negative"}`;
    }

    if (descEl) descEl.innerText = stock.description;

    // Key statistics
    const daysRangeEl = document.getElementById("detailStatDaysRange");
    const range52El = document.getElementById("detailStat52Range");
    const capEl = document.getElementById("detailStatMarketCap");
    const peEl = document.getElementById("detailStatPE");
    const divEl = document.getElementById("detailStatDivYield");
    const volEl = document.getElementById("detailStatVolume");

    if (daysRangeEl) daysRangeEl.innerText = `${this.formatCurrency(stock.low)} - ${this.formatCurrency(stock.high)}`;
    if (range52El) range52El.innerText = `${this.formatCurrency(stock.week52Low)} - ${this.formatCurrency(stock.week52High)}`;
    if (capEl) capEl.innerText = stock.marketCap;
    if (peEl) peEl.innerText = stock.pe.toFixed(1);
    if (divEl) divEl.innerText = stock.divYield.toFixed(2) + "%";
    if (volEl) volEl.innerText = this.formatNumber(stock.volume);

    // Watchlist button state
    const isWatchlisted = this.data.watchlist.includes(stock.symbol);
    const watchText = document.getElementById("detailWatchlistText");
    if (watchText) watchText.innerText = isWatchlisted ? "In Watchlist ✓" : "Add to Watchlist";

    // Render interactive chart
    this.renderDetailChart(stock, this.activeTimeframe);

    // Render Price Alerts for this stock
    this.renderStockAlerts(stock.symbol);

    // Similar stocks
    const similarEl = document.getElementById("similarStocksList");
    if (similarEl) {
      const similar = this.data.stocks.filter(s => s.symbol !== stock.symbol && s.sector === stock.sector).slice(0, 3);
      if (similar.length === 0) {
        similarEl.innerHTML = this.data.stocks.slice(0, 3).map(s => `
          <button class="btn btn-sm btn-secondary" onclick="app.openStockDetail('${s.symbol}')">${s.symbol} (${this.formatCurrency(s.price)})</button>
        `).join("");
      } else {
        similarEl.innerHTML = similar.map(s => `
          <button class="btn btn-sm btn-secondary" onclick="app.openStockDetail('${s.symbol}')">${s.symbol} (${this.formatCurrency(s.price)})</button>
        `).join("");
      }
    }
  }

  renderDetailChart(stock, timeframe) {
    const canvas = document.getElementById("stockDetailChartCanvas");
    if (!canvas) return;

    if (this.detailChart) {
      this.detailChart.destroy();
    }

    const pointsCount = timeframe === "1D" ? 24 : timeframe === "1W" ? 14 : timeframe === "1M" ? 30 : timeframe === "6M" ? 26 : timeframe === "1Y" ? 52 : 60;
    const basePrice = stock.price;
    const labels = [];
    const prices = [];

    let current = basePrice * (stock.change >= 0 ? 0.92 : 1.08);
    for (let i = 0; i < pointsCount; i++) {
      const drift = (basePrice - current) / (pointsCount - i);
      const noise = current * ((Math.sin(i * 0.5) * 0.01) + (Math.cos(i) * 0.008));
      current = Math.max(1, current + drift + noise);
      prices.push(Math.round(current * 100) / 100);

      if (timeframe === "1D") labels.push(`${9 + Math.floor(i / 3)}:${(i % 3) * 20 || "00"}`);
      else if (timeframe === "1W") labels.push(`Day ${i + 1}`);
      else if (timeframe === "1M") labels.push(`Sep ${i + 1}`);
      else if (timeframe === "6M") labels.push(`Wk ${i + 1}`);
      else if (timeframe === "1Y") labels.push(`M${(i % 12) + 1}`);
      else labels.push(`Y${Math.floor(i / 12) + 2021}`);
    }
    prices[prices.length - 1] = basePrice;

    const isPositive = prices[prices.length - 1] >= prices[0];
    const lineColor = isPositive ? "#C9F23E" : "#EF4444";
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 360);
    gradient.addColorStop(0, isPositive ? "rgba(201, 242, 62, 0.28)" : "rgba(239, 68, 68, 0.28)");
    gradient.addColorStop(1, "rgba(11, 15, 20, 0.0)");

    this.detailChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${stock.symbol} Price (₹)`,
          data: prices,
          borderColor: lineColor,
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: lineColor,
          tension: 0.25
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#121821",
            titleColor: "#F8FAFC",
            bodyColor: "#C9F23E",
            borderColor: "#1E293B",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (item) => `Price: ₹${Number(item.raw).toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(30, 41, 59, 0.5)" },
            ticks: { color: "#64748B", maxTicksLimit: 8 }
          },
          y: {
            position: "right",
            grid: { color: "rgba(30, 41, 59, 0.5)" },
            ticks: {
              color: "#64748B",
              callback: (val) => "₹" + val
            }
          }
        }
      }
    });
  }

  renderPortfolio() {
    const port = this.calculatePortfolio();

    const totalValEl = document.getElementById("portTotalValue");
    const investedEl = document.getElementById("portInvested");
    const pnlEl = document.getElementById("portPnl");
    const pnlPctEl = document.getElementById("portPnlPercent");
    const cashEl = document.getElementById("portCash");

    if (totalValEl) totalValEl.innerText = this.formatCurrency(port.totalValue);
    if (investedEl) investedEl.innerText = this.formatCurrency(port.invested);

    if (pnlEl) {
      const isUp = port.overallPnl >= 0;
      pnlEl.innerText = (isUp ? "+" : "") + this.formatCurrency(port.overallPnl);
      pnlEl.className = `metric-value ${isUp ? "text-positive" : "text-negative"}`;
    }

    if (pnlPctEl) {
      const isUp = port.overallPnlPct >= 0;
      pnlPctEl.innerText = `${isUp ? "+" : ""}${port.overallPnlPct.toFixed(2)}% overall return`;
      pnlPctEl.className = `metric-sub ${isUp ? "text-positive" : "text-negative"}`;
    }

    if (cashEl) cashEl.innerText = this.formatCurrency(port.cash);

    // Holdings Table
    const tbody = document.getElementById("portfolioHoldingsTableBody");
    if (tbody) {
      if (port.breakdown.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px; color: var(--text-secondary);">No holdings yet. Explore the market and place a buy order!</td></tr>`;
      } else {
        tbody.innerHTML = port.breakdown.map(h => {
          const isUp = h.pnl >= 0;
          const pnlCls = isUp ? "text-positive" : "text-negative";
          const sign = isUp ? "+" : "";
          const alloc = port.currentHoldingValue > 0 ? ((h.currentValue / port.currentHoldingValue) * 100).toFixed(1) : 0;

          return `
            <tr>
              <td>
                <div class="stock-name-cell" onclick="app.openStockDetail('${h.symbol}')" style="cursor: pointer;">
                  <span class="stock-symbol">${h.symbol}</span>
                  <span class="stock-company">${h.name}</span>
                </div>
              </td>
              <td class="num" style="font-weight: 700;">${h.quantity}</td>
              <td class="num">${this.formatCurrency(h.avgPrice)}</td>
              <td class="num" style="font-weight: 700;">${this.formatCurrency(h.currentPrice)}</td>
              <td class="num">${this.formatCurrency(h.investment)}</td>
              <td class="num" style="font-weight: 800;">${this.formatCurrency(h.currentValue)}</td>
              <td class="${pnlCls} num" style="font-weight: 700;">
                ${sign}${this.formatCurrency(h.pnl)} (${sign}${h.pnlPercent.toFixed(2)}%)
              </td>
              <td><span class="badge badge-demo">${alloc}%</span></td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-sm btn-buy" onclick="app.quickTrade('${h.symbol}', 'BUY')">Add</button>
                  <button class="btn btn-sm btn-sell" onclick="app.quickTrade('${h.symbol}', 'SELL')">Sell</button>
                </div>
              </td>
            </tr>
          `;
        }).join("");
      }
    }

    // Render Allocation Donut Chart
    this.renderPortfolioDonut(port.breakdown);
  }

  renderPortfolioDonut(breakdown) {
    const canvas = document.getElementById("portfolioDonutCanvas");
    if (!canvas) return;

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    const labels = breakdown.map(h => h.symbol);
    const values = breakdown.map(h => h.currentValue);
    const colors = ["#C9F23E", "#10B981", "#38BDF8", "#F59E0B", "#EC4899", "#8B5CF6"];

    const ctx = canvas.getContext("2d");
    this.donutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels.length ? labels : ["No Holdings"],
        datasets: [{
          data: values.length ? values : [1],
          backgroundColor: colors.slice(0, Math.max(1, labels.length)),
          borderColor: "#121821",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "right",
            labels: { color: "#94A3B8", font: { size: 11 }, boxWidth: 12, padding: 14 }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ₹${Number(item.raw).toLocaleString("en-IN")}`
            }
          }
        }
      }
    });
  }

  renderWatchlist() {
    const grid = document.getElementById("watchlistGrid");
    if (!grid) return;

    if (this.data.watchlist.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <p class="text-muted">Your watchlist is empty.</p>
        <button class="btn btn-sm btn-primary" style="margin-top: 10px;" onclick="navigateTo('markets')">Browse Markets</button>
      </div>`;
      return;
    }

    grid.innerHTML = this.data.watchlist.map(symbol => {
      const stock = this.getStock(symbol);
      if (!stock) return "";

      const isUp = stock.change >= 0;
      const cls = isUp ? "text-positive" : "text-negative";
      const sign = isUp ? "+" : "";

      return `
        <div class="card card-hover" style="position: relative;" onclick="app.openStockDetail('${stock.symbol}')">
          <button class="icon-btn" style="position: absolute; top: 12px; right: 12px; width: 28px; height: 28px;" onclick="event.stopPropagation(); app.removeFromWatchlist('${stock.symbol}')" title="Remove">
            ✕
          </button>
          <div class="stock-name-cell" style="margin-bottom: 12px;">
            <span class="stock-symbol" style="font-size: 1.1rem;">${stock.symbol}</span>
            <span class="stock-company">${stock.name}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
            <span class="num" style="font-size: 1.35rem; font-weight: 800;">${this.formatCurrency(stock.price)}</span>
            <span class="${cls} num" style="font-weight: 700;">${sign}${stock.changePercent}%</span>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px;" onclick="event.stopPropagation();">
            <button class="btn btn-sm btn-buy" style="flex: 1;" onclick="app.quickTrade('${stock.symbol}', 'BUY')">Buy</button>
            <button class="btn btn-sm btn-sell" style="flex: 1;" onclick="app.quickTrade('${stock.symbol}', 'SELL')">Sell</button>
          </div>
        </div>
      `;
    }).join("");
  }

  addToWatchlist(symbol) {
    if (!this.data.watchlist.includes(symbol)) {
      this.data.watchlist.push(symbol);
      this.saveState();
      this.renderWatchlist();
      this.showToast(`Added ${symbol} to watchlist`, "success");
    }
  }

  removeFromWatchlist(symbol) {
    this.data.watchlist = this.data.watchlist.filter(s => s !== symbol);
    this.saveState();
    this.renderWatchlist();
    this.showToast(`Removed ${symbol} from watchlist`, "info");
  }

  toggleWatchlist(symbol) {
    if (this.data.watchlist.includes(symbol)) {
      this.removeFromWatchlist(symbol);
    } else {
      this.addToWatchlist(symbol);
    }
  }

  renderOrders(filter = "ALL") {
    const tbody = document.getElementById("ordersTableBody");
    if (!tbody) return;

    let orders = this.data.orders;
    if (filter !== "ALL") {
      orders = orders.filter(o => o.status === filter);
    }

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-secondary);">No orders recorded for this filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const isBuy = o.type === "BUY";
      const actionCls = isBuy ? "text-positive" : "text-negative";
      const statusCls = o.status === "Completed" ? "badge-positive" : o.status === "Pending" ? "badge-demo" : "badge-negative";

      return `
        <tr>
          <td><code>${o.id}</code></td>
          <td style="font-weight: 700;">${o.symbol}</td>
          <td class="${actionCls}" style="font-weight: 700;">${o.type}</td>
          <td><span class="badge" style="background: var(--bg-surface-elevated);">${o.orderType}</span></td>
          <td class="num">${o.quantity}</td>
          <td class="num">${this.formatCurrency(o.price)}</td>
          <td class="num" style="font-weight: 700;">${this.formatCurrency(o.total)}</td>
          <td><span class="badge ${statusCls}">${o.status}</span></td>
          <td class="text-muted" style="font-size: 0.8rem;">${o.date}</td>
          <td>
            ${o.status === "Pending" ? `<button class="btn btn-sm btn-secondary" onclick="app.cancelOrder('${o.id}')">Cancel</button>` : `<span class="text-muted">—</span>`}
          </td>
        </tr>
      `;
    }).join("");
  }

  cancelOrder(orderId) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order && order.status === "Pending") {
      order.status = "Cancelled";
      this.saveState();
      this.renderOrders();
      this.showToast(`Order ${orderId} has been cancelled`, "info");
    }
  }

  renderTransactions() {
    const tbody = document.getElementById("transactionsTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.data.transactions.map(tx => {
      const isPositive = tx.amount > 0;
      const amtCls = isPositive ? "text-positive" : "text-negative";
      const sign = isPositive ? "+" : "";

      return `
        <tr>
          <td class="text-muted" style="font-size: 0.82rem;">${tx.date}</td>
          <td><span class="badge" style="background: var(--bg-surface-elevated);">${tx.type}</span></td>
          <td>${tx.desc}</td>
          <td class="${amtCls} num" style="font-weight: 700;">
            ${sign}${this.formatCurrency(tx.amount)}
          </td>
          <td class="num" style="color: var(--primary-accent); font-weight: 700;">${this.formatCurrency(tx.balance)}</td>
        </tr>
      `;
    }).join("");
  }

  renderNews(filter = "ALL") {
    const container = document.getElementById("newsCardsContainer");
    if (!container) return;

    let items = this.data.news;
    if (filter !== "ALL") {
      items = items.filter(n => n.category.toLowerCase() === filter.toLowerCase());
    }

    container.innerHTML = items.map(n => `
      <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="badge badge-demo">${n.category}</span>
            <span class="text-muted" style="font-size: 0.75rem;">${n.date}</span>
          </div>
          <h4 style="margin-bottom: 10px; line-height: 1.35;">${n.headline}</h4>
          <p class="text-muted" style="font-size: 0.85rem; line-height: 1.6; margin-bottom: 16px;">
            ${n.desc}
          </p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px;">
          <span class="text-muted" style="font-size: 0.75rem;">Source: ${n.source}</span>
          <button class="btn btn-sm btn-secondary" onclick="app.openNewsDetail(${n.id})">Read Article →</button>
        </div>
      </div>
    `).join("");
  }

  openNewsDetail(id) {
    const article = this.data.news.find(n => n.id === id);
    if (!article) return;

    document.getElementById("newsModalHeadline").innerText = article.headline;
    document.getElementById("newsModalCategory").innerText = article.category;
    document.getElementById("newsModalSource").innerText = article.source;
    document.getElementById("newsModalDate").innerText = article.date;
    document.getElementById("newsModalContent").innerHTML = `
      <p style="margin-bottom: 14px;">${article.desc}</p>
      <p style="margin-bottom: 14px;">${article.content}</p>
      <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: 8px; font-size: 0.82rem; color: var(--text-secondary);">
        ⚠️ <strong>Note:</strong> This financial article is generated as part of the StockX educational simulator.
      </div>
    `;

    openModal("newsDetailModal");
  }

  renderLearnSection() {
    const grid = document.getElementById("learnTopicsGrid");
    if (!grid) return;

    grid.innerHTML = this.data.learnTopics.map((topic, i) => `
      <div class="learn-card">
        <div>
          <div class="learn-badge">Lesson ${i + 1} • ${topic.tag}</div>
          <h3 class="learn-title">${topic.title}</h3>
          <p class="learn-desc">${topic.desc}</p>
        </div>
        <div class="learn-example">
          <strong>💡 Real-World Example:</strong> ${topic.example}
        </div>
      </div>
    `).join("");
  }

  renderAdmin() {
    const port = this.calculatePortfolio();
    const totalUsersEl = document.getElementById("adminTotalUsers");
    const totalStocksEl = document.getElementById("adminTotalStocks");
    const totalOrdersEl = document.getElementById("adminTotalOrders");
    const totalVolEl = document.getElementById("adminTotalVolume");

    if (totalUsersEl) totalUsersEl.innerText = "2";
    if (totalStocksEl) totalStocksEl.innerText = this.data.stocks.length;
    if (totalOrdersEl) totalOrdersEl.innerText = this.data.orders.length;

    const totalVolume = this.data.orders.reduce((acc, o) => acc + o.total, 0);
    if (totalVolEl) totalVolEl.innerText = this.formatCurrency(totalVolume);

    // Admin stocks table
    const tbody = document.getElementById("adminStocksTableBody");
    if (tbody) {
      tbody.innerHTML = this.data.stocks.map(s => `
        <tr>
          <td style="font-weight: 700;">${s.symbol}</td>
          <td>${s.name}</td>
          <td><span class="badge badge-demo">${s.sector}</span></td>
          <td class="num" style="font-weight: 700;">${this.formatCurrency(s.price)}</td>
          <td class="num">${s.pe.toFixed(1)}</td>
          <td class="num">${this.formatCurrency(s.week52High)}</td>
          <td class="num">${this.formatCurrency(s.week52Low)}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="app.deleteStock('${s.symbol}')">Delete</button>
          </td>
        </tr>
      `).join("");
    }
  }

  deleteStock(symbol) {
    if (confirm(`Are you sure you want to delete simulated stock ${symbol}?`)) {
      this.data.stocks = this.data.stocks.filter(s => s.symbol !== symbol);
      this.data.watchlist = this.data.watchlist.filter(s => s !== symbol);
      this.saveState();
      this.renderAll();
      this.showToast(`Deleted stock ${symbol}`, "info");
    }
  }

  // ========================================================================
  // 4. Trade Execution
  // ========================================================================

  quickTrade(symbol, action) {
    this.selectedStockSymbol = symbol;
    this.tradeAction = action;
    this.openTradeModal(action);
  }

  openTradeModal(action = "BUY") {
    this.tradeAction = action;
    const stock = this.getStock(this.selectedStockSymbol);
    if (!stock) return;

    document.getElementById("tradeModalTitle").innerText = `${action} ${stock.symbol}`;
    document.getElementById("tradeStockSymbol").innerText = stock.symbol;
    document.getElementById("tradeStockName").innerText = stock.name;
    document.getElementById("tradeStockPrice").innerText = this.formatCurrency(stock.price);

    const changeEl = document.getElementById("tradeStockChange");
    if (changeEl) {
      const isUp = stock.change >= 0;
      changeEl.innerText = `${isUp ? "+" : ""}${stock.changePercent}%`;
      changeEl.className = `badge ${isUp ? "badge-positive" : "badge-negative"}`;
    }

    document.getElementById("tradeAvailableCash").innerText = this.formatCurrency(this.data.user.cashBalance);

    const holding = this.getHolding(stock.symbol);
    document.getElementById("tradeCurrentHolding").innerText = holding ? `${holding.quantity} shares` : "0 shares";

    // Set tab states
    const buyTab = document.getElementById("buyTabBtn");
    const sellTab = document.getElementById("sellTabBtn");
    const confirmBtn = document.getElementById("tradeConfirmBtn");

    if (action === "BUY") {
      buyTab.className = "trade-tab active buy-tab";
      sellTab.className = "trade-tab";
      confirmBtn.className = "btn btn-buy";
      confirmBtn.innerText = `Confirm Buy Order (${stock.symbol})`;
    } else {
      sellTab.className = "trade-tab active sell-tab";
      buyTab.className = "trade-tab";
      confirmBtn.className = "btn btn-sell";
      confirmBtn.innerText = `Confirm Sell Order (${stock.symbol})`;
    }

    document.getElementById("tradeQtyInput").value = 1;
    document.getElementById("orderTypeSelect").value = "MARKET";
    document.getElementById("limitPriceGroup").style.display = "none";
    document.getElementById("limitPriceInput").value = stock.price.toFixed(2);

    this.updateTradeCalculations();
    openModal("tradeModal");
  }

  updateTradeCalculations() {
    const stock = this.getStock(this.selectedStockSymbol);
    if (!stock) return;

    const orderType = document.getElementById("orderTypeSelect").value;
    const qty = parseInt(document.getElementById("tradeQtyInput").value) || 0;

    let price = stock.price;
    if (orderType === "LIMIT") {
      price = parseFloat(document.getElementById("limitPriceInput").value) || stock.price;
    }

    const total = qty * price;
    document.getElementById("tradeTotalAmount").innerText = this.formatCurrency(total);
  }

  executeTrade() {
    const stock = this.getStock(this.selectedStockSymbol);
    if (!stock) return;

    const action = this.tradeAction;
    const orderType = document.getElementById("orderTypeSelect").value;
    const qty = parseInt(document.getElementById("tradeQtyInput").value) || 0;

    if (qty <= 0) {
      this.showToast("Please enter a valid quantity of shares.", "error");
      return;
    }

    let price = stock.price;
    if (orderType === "LIMIT") {
      price = parseFloat(document.getElementById("limitPriceInput").value) || stock.price;
    }

    const total = Math.round(qty * price * 100) / 100;
    const now = new Date();
    const dateStr = now.toISOString().replace("T", " ").substring(0, 16);
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);

    // Limit order status check
    let status = "Completed";
    if (orderType === "LIMIT") {
      if (action === "BUY" && price < stock.price) status = "Pending";
      else if (action === "SELL" && price > stock.price) status = "Pending";
    }

    if (action === "BUY") {
      if (this.data.user.cashBalance < total) {
        this.showToast(`Insufficient funds! Required: ${this.formatCurrency(total)}, Available: ${this.formatCurrency(this.data.user.cashBalance)}`, "error");
        return;
      }

      if (status === "Completed") {
        // Deduct balance
        this.data.user.cashBalance = Math.round((this.data.user.cashBalance - total) * 100) / 100;

        // Update holding
        let holding = this.getHolding(stock.symbol);
        if (holding) {
          const totalCost = (holding.quantity * holding.avgPrice) + total;
          holding.quantity += qty;
          holding.avgPrice = Math.round((totalCost / holding.quantity) * 100) / 100;
        } else {
          this.data.holdings.push({
            symbol: stock.symbol,
            quantity: qty,
            avgPrice: price
          });
        }

        // Record transaction
        this.data.transactions.unshift({
          date: dateStr,
          type: "BUY",
          desc: `Bought ${qty} ${stock.symbol} @ ${this.formatCurrency(price)}`,
          amount: -total,
          balance: this.data.user.cashBalance
        });
      }

      // Record Order
      this.data.orders.unshift({
        id: orderId,
        symbol: stock.symbol,
        type: "BUY",
        orderType: orderType,
        quantity: qty,
        price: price,
        total: total,
        status: status,
        date: dateStr
      });

      this.saveState();
      this.renderAll();
      closeModal("tradeModal");

      if (status === "Completed") {
        this.showToast(`Successfully purchased ${qty} ${stock.symbol} for ${this.formatCurrency(total)}`, "success");
      } else {
        this.showToast(`Limit order placed: ${qty} ${stock.symbol} @ ${this.formatCurrency(price)} (Pending)`, "info");
      }

    } else { // SELL
      const holding = this.getHolding(stock.symbol);
      if (!holding || holding.quantity < qty) {
        const available = holding ? holding.quantity : 0;
        this.showToast(`Cannot sell ${qty} shares. You currently own ${available} shares.`, "error");
        return;
      }

      if (status === "Completed") {
        // Credit balance
        this.data.user.cashBalance = Math.round((this.data.user.cashBalance + total) * 100) / 100;

        // Deduct holding
        holding.quantity -= qty;
        if (holding.quantity === 0) {
          this.data.holdings = this.data.holdings.filter(h => h.symbol !== stock.symbol);
        }

        // Record transaction
        this.data.transactions.unshift({
          date: dateStr,
          type: "SELL",
          desc: `Sold ${qty} ${stock.symbol} @ ${this.formatCurrency(price)}`,
          amount: total,
          balance: this.data.user.cashBalance
        });
      }

      // Record Order
      this.data.orders.unshift({
        id: orderId,
        symbol: stock.symbol,
        type: "SELL",
        orderType: orderType,
        quantity: qty,
        price: price,
        total: total,
        status: status,
        date: dateStr
      });

      this.saveState();
      this.renderAll();
      closeModal("tradeModal");

      if (status === "Completed") {
        this.showToast(`Successfully sold ${qty} ${stock.symbol} for ${this.formatCurrency(total)}`, "success");
      } else {
        this.showToast(`Limit sell order placed: ${qty} ${stock.symbol} @ ${this.formatCurrency(price)} (Pending)`, "info");
      }
    }
  }

  depositFunds(amount) {
    if (amount <= 0) return;
    this.data.user.cashBalance = Math.round((this.data.user.cashBalance + amount) * 100) / 100;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    this.data.transactions.unshift({
      date: now,
      type: "DEPOSIT",
      desc: `Virtual Demo Deposit: +${this.formatCurrency(amount)}`,
      amount: amount,
      balance: this.data.user.cashBalance
    });

    this.saveState();
    this.renderAll();
    closeModal("depositModal");
    this.showToast(`Credited ${this.formatCurrency(amount)} to demo cash!`, "success");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✓" : type === "error" ? "⚠️" : "ℹ️";
    toast.innerHTML = `<span style="font-size: 1.1rem;">${icon}</span><span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ========================================================================
  // Price Alert & Notification Engine
  // ========================================================================

  openPriceAlertModal(symbol, alertId = null) {
    if (alertId) {
      this.editAlert(alertId);
      return;
    }

    const sym = symbol || this.selectedStockSymbol;
    const stock = this.getStock(sym);
    if (!stock) return;

    this.selectedStockSymbol = sym;
    this.resetAlertModalState();

    const symbolSub = document.getElementById("alertModalStockSub");
    const curPriceEl = document.getElementById("alertModalCurrentPrice");
    const targetInput = document.getElementById("alertTargetPriceInput");
    const noteInput = document.getElementById("alertNoteInput");

    if (symbolSub) symbolSub.innerText = `${stock.symbol} • ${stock.name}`;
    if (curPriceEl) curPriceEl.innerText = this.formatCurrency(stock.price);

    // Default target price is +2% rounded
    const defaultTarget = Math.round(stock.price * 1.02 * 100) / 100;
    if (targetInput) targetInput.value = defaultTarget;
    if (noteInput) noteInput.value = "";

    this.updateAlertConditionTabs("ABOVE");
    this.updateAlertModalCalculations();
    openModal("priceAlertModal");
  }

  editAlert(alertId) {
    if (!this.data.priceAlerts) return;
    const alert = this.data.priceAlerts.find(a => a.id === alertId);
    if (!alert) {
      this.showToast("Alert not found.", "error");
      return;
    }

    const stock = this.getStock(alert.symbol);
    if (!stock) return;

    this.selectedStockSymbol = alert.symbol;
    this.editingAlertId = alert.id;

    // Update modal header & price info to reflect UPDATE mode
    const modalTitle = document.getElementById("alertModalTitle");
    const submitBtn = document.getElementById("alertModalSubmitBtn");
    const symbolSub = document.getElementById("alertModalStockSub");
    const curPriceEl = document.getElementById("alertModalCurrentPrice");
    const targetInput = document.getElementById("alertTargetPriceInput");
    const noteInput = document.getElementById("alertNoteInput");

    if (modalTitle) modalTitle.innerText = "Edit Price Alert";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "🔄 Update Alert";
    }
    if (symbolSub) symbolSub.innerText = `${stock.symbol} • ${stock.name}`;
    if (curPriceEl) curPriceEl.innerText = this.formatCurrency(stock.price);

    // Populate form fields with existing alert data
    if (targetInput) targetInput.value = alert.targetPrice;
    if (noteInput) noteInput.value = alert.note || "";

    // Update condition tab and calculations
    this.updateAlertConditionTabs(alert.condition || "ABOVE");
    this.updateAlertModalCalculations();

    // Open the alert modal
    openModal("priceAlertModal");
  }

  resetAlertModalState() {
    this.editingAlertId = null;
    const modalTitle = document.getElementById("alertModalTitle");
    const submitBtn = document.getElementById("alertModalSubmitBtn");
    const noteInput = document.getElementById("alertNoteInput");

    if (modalTitle) modalTitle.innerText = "Set Price Alert";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "💾 Save Alert";
    }
    if (noteInput) noteInput.value = "";
  }

  openEditPriceAlert(alertId) {
    this.editAlert(alertId);
  }

  updateAlertConditionTabs(cond) {
    this.alertCondition = cond;
    const aboveBtn = document.getElementById("alertCondAboveBtn");
    const belowBtn = document.getElementById("alertCondBelowBtn");
    if (aboveBtn && belowBtn) {
      if (cond === "ABOVE") {
        aboveBtn.className = "trade-tab active buy-tab";
        belowBtn.className = "trade-tab";
      } else {
        aboveBtn.className = "trade-tab";
        belowBtn.className = "trade-tab active sell-tab";
      }
    }
  }

  applyQuickAlertOffset(pct) {
    const stock = this.getStock(this.selectedStockSymbol);
    if (!stock) return;

    const input = document.getElementById("alertTargetPriceInput");
    if (!input) return;

    if (pct === 0) {
      input.value = stock.price;
    } else {
      const target = Math.round(stock.price * (1 + pct / 100) * 100) / 100;
      input.value = target;
      if (pct < 0) {
        this.updateAlertConditionTabs("BELOW");
      } else {
        this.updateAlertConditionTabs("ABOVE");
      }
    }
    this.updateAlertModalCalculations();
  }

  updateAlertModalCalculations() {
    const stock = this.getStock(this.selectedStockSymbol);
    const input = document.getElementById("alertTargetPriceInput");
    const badge = document.getElementById("alertDiffBadge");
    const helper = document.getElementById("alertHelperText");
    if (!stock || !input) return;

    const target = parseFloat(input.value) || stock.price;
    const diff = target - stock.price;
    const diffPct = stock.price > 0 ? (diff / stock.price) * 100 : 0;
    const sign = diff >= 0 ? "+" : "";

    if (badge) {
      badge.innerText = `${sign}${diffPct.toFixed(2)}%`;
      badge.className = `badge ${diff >= 0 ? "badge-positive" : "badge-negative"}`;
    }

    if (helper) {
      const condText = this.alertCondition === "ABOVE" ? "reaches or rises above" : "drops to or falls below";
      const modePrefix = this.editingAlertId ? "Updated alert will trigger" : "Alert will trigger";
      helper.innerText = `${modePrefix} when ${stock.symbol} ${condText} ${this.formatCurrency(target)}`;
    }
  }

  confirmCreatePriceAlert() {
    const stock = this.getStock(this.selectedStockSymbol);
    if (!stock) return;

    const targetInput = document.getElementById("alertTargetPriceInput");
    const noteInput = document.getElementById("alertNoteInput");
    const submitBtn = document.getElementById("alertModalSubmitBtn");
    const targetPrice = parseFloat(targetInput ? targetInput.value : 0);

    if (!targetPrice || targetPrice <= 0) {
      this.showToast("Please enter a valid target price greater than ₹0", "error");
      return;
    }

    const note = noteInput ? noteInput.value.trim() : "";
    const condSymbol = this.alertCondition === "ABOVE" ? "≥" : "≤";

    // Detect whether user is creating a new alert or updating an existing one
    const isUpdating = Boolean(
      this.editingAlertId && 
      this.data.priceAlerts && 
      this.data.priceAlerts.some(a => a.id === this.editingAlertId)
    );

    if (isUpdating) {
      const alert = this.data.priceAlerts.find(a => a.id === this.editingAlertId);
      if (alert) {
        // UI visual feedback: show updating state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = "🔄 Updating Alert...";
        }

        // Apply updates to existing alert
        alert.targetPrice = targetPrice;
        alert.condition = this.alertCondition;
        alert.note = note;
        alert.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
        // Reactivate alert so the newly updated target is actively monitored
        alert.status = "ACTIVE";
        alert.triggeredAt = null;
        alert.triggeredPrice = null;

        this.saveState();
        this.renderStockAlerts(stock.symbol);

        closeModal("priceAlertModal");
        this.showToast(`Price alert updated for ${stock.symbol} (${condSymbol} ${this.formatCurrency(targetPrice)})`, "success");
        this.resetAlertModalState();
        return;
      }
    }

    // New alert creation
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "💾 Saving Alert...";
    }

    const alertId = "ALT-" + Date.now().toString(36).toUpperCase();
    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const alert = {
      id: alertId,
      symbol: stock.symbol,
      targetPrice: targetPrice,
      condition: this.alertCondition,
      createdPrice: stock.price,
      createdAt: dateStr,
      status: "ACTIVE",
      triggeredAt: null,
      triggeredPrice: null,
      note: note
    };

    if (!this.data.priceAlerts) this.data.priceAlerts = [];
    this.data.priceAlerts.unshift(alert);
    this.saveState();

    this.renderStockAlerts(stock.symbol);
    closeModal("priceAlertModal");

    this.showToast(`Price alert saved for ${stock.symbol} (${condSymbol} ${this.formatCurrency(targetPrice)})`, "success");
    this.resetAlertModalState();

    // Request notification permissions if supported
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  deleteAlert(alertId) {
    if (!this.data.priceAlerts) return;
    this.data.priceAlerts = this.data.priceAlerts.filter(a => a.id !== alertId);
    this.saveState();
    this.renderStockAlerts(this.selectedStockSymbol);
    this.showToast("Price alert removed.", "info");
  }

  toggleAlertStatus(alertId) {
    if (!this.data.priceAlerts) return;
    const alert = this.data.priceAlerts.find(a => a.id === alertId);
    if (!alert) return;

    if (alert.status === "ACTIVE") {
      alert.status = "INACTIVE";
      this.showToast(`Alert for ${alert.symbol} disabled (paused).`, "info");
    } else {
      alert.status = "ACTIVE";
      alert.triggeredAt = null;
      alert.triggeredPrice = null;
      this.showToast(`Alert for ${alert.symbol} activated!`, "success");
    }

    this.saveState();
    this.renderStockAlerts(this.selectedStockSymbol);
  }

  toggleAlert(alertId) {
    this.toggleAlertStatus(alertId);
  }

  resetAlert(alertId) {
    if (!this.data.priceAlerts) return;
    const alert = this.data.priceAlerts.find(a => a.id === alertId);
    if (!alert) return;
    alert.status = "ACTIVE";
    alert.triggeredAt = null;
    alert.triggeredPrice = null;
    this.saveState();
    this.renderStockAlerts(this.selectedStockSymbol);
    this.showToast(`Alert for ${alert.symbol} reactivated!`, "success");
  }

  simulatePriceAlertHit(alertId) {
    if (!this.data.priceAlerts) return;
    const alert = this.data.priceAlerts.find(a => a.id === alertId);
    if (!alert) return;
    const stock = this.getStock(alert.symbol);
    if (!stock) return;

    // Set stock price directly to target price to trigger alert
    stock.price = alert.targetPrice;
    stock.change = Math.round((stock.price - stock.prevClose) * 100) / 100;
    stock.changePercent = Math.round((stock.change / stock.prevClose * 100) * 100) / 100;

    this.saveState();
    this.checkPriceAlerts(stock);
    this.renderStockDetail(stock.symbol, false);
  }

  checkPriceAlerts(stock) {
    if (!this.data.priceAlerts || this.data.priceAlerts.length === 0) return;
    let anyTriggered = false;

    this.data.priceAlerts.forEach(alert => {
      if (alert.status === "ACTIVE" && alert.symbol.toUpperCase() === stock.symbol.toUpperCase()) {
        let isHit = false;
        if (alert.condition === "ABOVE" && stock.price >= alert.targetPrice) {
          isHit = true;
        } else if (alert.condition === "BELOW" && stock.price <= alert.targetPrice) {
          isHit = true;
        }

        if (isHit) {
          anyTriggered = true;
          alert.status = "TRIGGERED";
          const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
          alert.triggeredAt = nowStr;
          alert.triggeredPrice = stock.price;

          const title = `Price Alert: ${stock.symbol} Hit Target!`;
          const condText = alert.condition === "ABOVE" ? "risen to or above" : "fallen to or below";
          const message = `${stock.symbol} has ${condText} target of ${this.formatCurrency(alert.targetPrice)} (Current: ${this.formatCurrency(stock.price)}).`;

          if (!this.data.notifications) this.data.notifications = [];
          this.data.notifications.unshift({
            id: "NOTIF-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
            type: "PRICE_ALERT",
            symbol: stock.symbol,
            title: title,
            message: message,
            time: "Just now",
            date: nowStr,
            read: false
          });

          // Play notification chime
          this.playAlertSound();

          // Show high-priority in-app toast notification
          this.showToast(`🔔 ${title} - ${this.formatCurrency(stock.price)}`, "success");

          // Trigger browser notification if allowed
          this.sendSystemNotification(title, message);
        }
      }
    });

    if (anyTriggered) {
      this.saveState();
      this.updateNotifBadge();
      this.renderNotificationsList();
      if (this.activeView === "stock-detail" && this.selectedStockSymbol === stock.symbol) {
        this.renderStockAlerts(stock.symbol);
      }
    }
  }

  playAlertSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      // Ignore if autoplay restricted
    }
  }

  sendSystemNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: body
        });
      } catch (e) {}
    }
  }

  updateNotifBadge() {
    const dot = document.getElementById("notifDot");
    const badge = document.getElementById("notifUnreadBadge");
    if (!this.data.notifications) this.data.notifications = [];
    const unread = this.data.notifications.filter(n => !n.read).length;

    if (dot) {
      dot.style.display = unread > 0 ? "block" : "none";
    }
    if (badge) {
      badge.innerText = `${unread} new`;
      badge.style.display = unread > 0 ? "inline-block" : "none";
    }
  }

  renderNotificationsList() {
    const list = document.getElementById("notifList");
    if (!list) return;

    if (!this.data.notifications || this.data.notifications.length === 0) {
      list.innerHTML = `
        <div class="notif-empty">
          <div style="font-size: 1.6rem; margin-bottom: 6px;">🔕</div>
          <p style="margin: 0; font-weight: 600;">No notifications yet</p>
          <span style="font-size: 0.78rem; color: var(--text-tertiary);">Price alerts will appear here when hit.</span>
        </div>
      `;
      return;
    }

    list.innerHTML = this.data.notifications.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="app.handleNotifClick('${n.id}', '${n.symbol || ''}')">
        <div class="notif-icon-box" style="background: ${n.type === 'PRICE_ALERT' ? 'rgba(201, 242, 62, 0.15)' : 'rgba(56, 189, 248, 0.15)'}; color: ${n.type === 'PRICE_ALERT' ? 'var(--primary-accent)' : '#38bdf8'};">
          ${n.type === 'PRICE_ALERT' ? '🔔' : 'ℹ️'}
        </div>
        <div class="notif-content">
          <div class="notif-title">${n.title}</div>
          <div class="notif-message">${n.message}</div>
          <div class="notif-time">${n.time} ${n.date ? '• ' + n.date : ''}</div>
        </div>
      </div>
    `).join("");
  }

  handleNotifClick(notifId, symbol) {
    if (this.data.notifications) {
      const n = this.data.notifications.find(x => x.id === notifId);
      if (n) n.read = true;
      this.saveState();
      this.updateNotifBadge();
      this.renderNotificationsList();
    }
    const dropdown = document.getElementById("notifDropdown");
    if (dropdown) dropdown.style.display = "none";

    if (symbol) {
      this.openStockDetail(symbol);
    }
  }

  markAllNotifsRead() {
    if (!this.data.notifications) return;
    this.data.notifications.forEach(n => n.read = true);
    this.saveState();
    this.updateNotifBadge();
    this.renderNotificationsList();
  }

  clearAllNotifs() {
    this.data.notifications = [];
    this.saveState();
    this.updateNotifBadge();
    this.renderNotificationsList();
    this.showToast("Notifications cleared.", "info");
  }

  renderStockAlerts(symbol) {
    const listEl = document.getElementById("detailStockAlertsList");
    const countEl = document.getElementById("detailAlertsCount");
    if (!listEl) return;

    if (!this.data.priceAlerts) this.data.priceAlerts = [];
    const alerts = this.data.priceAlerts.filter(a => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (countEl) countEl.innerText = alerts.length;

    if (alerts.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 24px; border: 1px dashed var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface-elevated);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🔔</div>
          <div style="font-weight: 600; margin-bottom: 4px;">No price alerts set for ${symbol}</div>
          <div class="text-muted" style="font-size: 0.85rem; margin-bottom: 14px;">Set an alert and get notified the moment ${symbol} hits your target price.</div>
          <button class="btn btn-sm btn-primary" onclick="openPriceAlertModal()">+ Set Price Alert</button>
        </div>
      `;
      return;
    }

    const currentStock = this.getStock(symbol);
    const curPrice = currentStock ? currentStock.price : 0;

    listEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${alerts.map(a => {
          const isAbove = a.condition === "ABOVE";
          const isActive = a.status === "ACTIVE";
          const isTriggered = a.status === "TRIGGERED";
          const diff = a.targetPrice - curPrice;
          const diffPct = curPrice > 0 ? (diff / curPrice) * 100 : 0;
          const sign = diff >= 0 ? "+" : "";

          const conditionBadge = isAbove 
            ? `<span class="badge" style="background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3);">▲ Rises Above (≥)</span>`
            : `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);">▼ Falls Below (≤)</span>`;

          let statusBadge = "";
          if (isActive) {
            statusBadge = `<span class="badge" style="background: rgba(201, 242, 62, 0.15); color: var(--primary-accent); border: 1px solid var(--primary-accent);">Active</span>`;
          } else if (isTriggered) {
            statusBadge = `<span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4);">Triggered ✓</span>`;
          } else {
            statusBadge = `<span class="badge" style="background: rgba(156, 163, 175, 0.15); color: #9ca3af; border: 1px solid rgba(156, 163, 175, 0.3);">Inactive</span>`;
          }

          return `
            <div class="alert-item-card ${isActive ? '' : 'is-inactive'}" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  ${conditionBadge}
                  <span class="num" style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${this.formatCurrency(a.targetPrice)}</span>
                  ${statusBadge}
                </div>
                <div class="text-muted" style="font-size: 0.8rem; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                  <span>Current: <strong>${this.formatCurrency(curPrice)}</strong></span>
                  <span>•</span>
                  <span class="${diff >= 0 ? 'text-positive' : 'text-negative'}">${sign}${this.formatCurrency(diff)} (${sign}${diffPct.toFixed(2)}%)</span>
                  <span>•</span>
                  <span>Created: ${a.createdAt}</span>
                </div>
                ${a.triggeredAt ? `<div style="font-size: 0.78rem; color: #c084fc; margin-top: 4px; font-weight: 600;">⚡ Triggered on ${a.triggeredAt} at ${this.formatCurrency(a.triggeredPrice || a.targetPrice)}</div>` : ''}
                ${a.note ? `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; font-style: italic;">Note: "${a.note}"</div>` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <!-- Active / Inactive Toggle Switch -->
                <label class="alert-toggle-wrap" title="${isActive ? 'Alert is Active - click to disable' : 'Alert is Inactive - click to activate'}" onclick="event.stopPropagation()">
                  <span style="font-size: 0.76rem; font-weight: 600; color: ${isActive ? 'var(--primary-accent)' : 'var(--text-muted)'}; min-width: 46px;">
                    ${isActive ? 'Active' : 'Inactive'}
                  </span>
                  <input type="checkbox" class="alert-toggle-checkbox" ${isActive ? 'checked' : ''} onchange="toggleAlertStatus('${a.id}')" style="display: none;">
                  <span class="alert-toggle-track ${isActive ? 'active' : ''}">
                    <span class="alert-toggle-thumb"></span>
                  </span>
                </label>

                <button class="btn btn-sm btn-secondary" onclick="editAlert('${a.id}')" title="Edit alert" style="display: flex; align-items: center; gap: 4px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>Edit</span>
                </button>
                ${isActive ? `
                  <button class="btn btn-sm btn-secondary" title="Simulate this stock reaching target price" onclick="app.simulatePriceAlertHit('${a.id}')" style="color: var(--primary-accent); border-color: rgba(201, 242, 62, 0.3);">
                    ⚡ Test Trigger
                  </button>
                ` : `
                  <button class="btn btn-sm btn-secondary" onclick="app.resetAlert('${a.id}')" style="font-size: 0.75rem;">
                    Re-activate
                  </button>
                `}
                <button class="btn btn-sm btn-secondary" onclick="app.deleteAlert('${a.id}')" style="color: var(--color-negative); padding: 6px 10px;" title="Delete alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }
}

// Instantiate global app instance
const app = new StockXApp();

// ==========================================================================
// 5. Global Handlers & Navigation
// ==========================================================================

function navigateTo(viewId) {
  app.activeView = viewId;

  // Toggle active sidebar items
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Toggle visible sections
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.style.display = "none";
  });

  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.style.display = "block";
  }

  // Mobile sidebar close on navigation
  const sidebar = document.getElementById("appSidebar");
  if (sidebar) sidebar.classList.remove("open");

  // Specific view refresh hooks
  if (viewId === "portfolio") app.renderPortfolio();
  else if (viewId === "watchlist") app.renderWatchlist();
  else if (viewId === "orders") app.renderOrders();
  else if (viewId === "transactions") app.renderTransactions();
  else if (viewId === "dashboard") app.renderDashboardMetrics();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("active");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("active");
  if (modalId === "priceAlertModal" && window.app) {
    window.app.resetAlertModalState();
  }
}

function toggleTheme() {
  const current = app.theme;
  const next = current === "dark" ? "light" : "dark";
  app.applyTheme(next);
}

function openDepositModal() {
  openModal("depositModal");
}

function confirmDeposit() {
  const val = parseFloat(document.getElementById("depositAmountInput").value) || 0;
  if (val > 0) app.depositFunds(val);
}

function setTradeAction(action) {
  app.tradeAction = action;
  app.openTradeModal(action);
}

function handleOrderTypeChange() {
  const type = document.getElementById("orderTypeSelect").value;
  const group = document.getElementById("limitPriceGroup");
  if (group) {
    group.style.display = type === "LIMIT" ? "block" : "none";
  }
  app.updateTradeCalculations();
}

function setQuickQty(qty) {
  const input = document.getElementById("tradeQtyInput");
  const stock = app.getStock(app.selectedStockSymbol);
  if (!input || !stock) return;

  if (qty === "MAX") {
    if (app.tradeAction === "BUY") {
      const maxShares = Math.max(1, Math.floor(app.data.user.cashBalance / stock.price));
      input.value = maxShares;
    } else {
      const holding = app.getHolding(stock.symbol);
      input.value = holding ? holding.quantity : 1;
    }
  } else {
    input.value = qty;
  }
  app.updateTradeCalculations();
}

function submitTradeOrder() {
  app.executeTrade();
}

function toggleWatchlistCurrentStock() {
  app.toggleWatchlist(app.selectedStockSymbol);
  const isWatchlisted = app.data.watchlist.includes(app.selectedStockSymbol);
  const watchText = document.getElementById("detailWatchlistText");
  if (watchText) watchText.innerText = isWatchlisted ? "In Watchlist ✓" : "Add to Watchlist";
}

function switchChartTimeframe(tf, btn) {
  app.activeTimeframe = tf;
  document.querySelectorAll(".timeframe-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const stock = app.getStock(app.selectedStockSymbol);
  if (stock) app.renderDetailChart(stock, tf);
}

function filterMarketTable(filter, btn) {
  document.querySelectorAll(".active-filter").forEach(b => b.classList.remove("active-filter"));
  if (btn) btn.classList.add("active-filter");
  app.renderMarketsTable(filter);
}

function filterOrdersTable(filter, btn) {
  app.renderOrders(filter);
}

function filterNews(filter, btn) {
  app.renderNews(filter);
}

// Global search handling
function setupSearch() {
  const input = document.getElementById("globalSearchInput");
  const dropdown = document.getElementById("searchDropdown");
  if (!input || !dropdown) return;

  input.addEventListener("input", (e) => {
    const q = e.target.value.trim().toUpperCase();
    if (!q) {
      dropdown.style.display = "none";
      return;
    }

    const matches = app.data.stocks.filter(s => s.symbol.includes(q) || s.name.toUpperCase().includes(q));
    if (matches.length === 0) {
      dropdown.innerHTML = `<div style="padding: 12px; color: var(--text-secondary); font-size: 0.85rem;">No stocks matching "${q}"</div>`;
    } else {
      dropdown.innerHTML = matches.map(s => `
        <div class="search-item" onclick="selectSearchStock('${s.symbol}')">
          <div class="stock-name-cell">
            <span class="stock-symbol">${s.symbol}</span>
            <span class="stock-company">${s.name}</span>
          </div>
          <div style="text-align: right;">
            <div class="num" style="font-weight: 700;">${app.formatCurrency(s.price)}</div>
            <div class="${s.change >= 0 ? 'text-positive' : 'text-negative'}" style="font-size: 0.8rem;">
              ${s.change >= 0 ? '+' : ''}${s.changePercent}%
            </div>
          </div>
        </div>
      `).join("");
    }
    dropdown.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

function selectSearchStock(symbol) {
  document.getElementById("searchDropdown").style.display = "none";
  document.getElementById("globalSearchInput").value = "";
  app.openStockDetail(symbol);
}

// Auth modal handlers
function handleUserBadgeClick() {
  openAuthModal("login");
}

function openAuthModal(mode = "login") {
  switchAuthTab(mode);
  openModal("authModal");
}

function switchAuthTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("authTabLogin").className = `trade-tab ${isLogin ? "active buy-tab" : ""}`;
  document.getElementById("authTabSignup").className = `trade-tab ${!isLogin ? "active buy-tab" : ""}`;
  document.getElementById("authModalTitle").innerText = isLogin ? "Sign In to StockX" : "Create StockX Account";
  document.getElementById("authNameGroup").style.display = isLogin ? "none" : "block";
  document.getElementById("authConfirmPasswordGroup").style.display = isLogin ? "none" : "block";
  document.getElementById("authSubmitBtn").innerText = isLogin ? "Sign In" : "Create Account";
}

function quickFillDemoLogin() {
  document.getElementById("authEmail").value = "demo@stockx.com";
  document.getElementById("authPassword").value = "Demo@123";
  switchAuthTab("login");
  app.showToast("Demo credentials auto-filled!", "info");
}

function togglePasswordVisibility(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.type = field.type === "password" ? "text" : "password";
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("authEmail").value.trim();
  const isSignup = document.getElementById("authNameGroup").style.display !== "none";

  if (isSignup) {
    const fullName = document.getElementById("authFullName").value.trim() || "Trader";
    app.data.user.email = email;
    app.data.user.fullName = fullName;
    app.showToast(`Welcome ${fullName}! ₹1,00,000 demo capital credited.`, "success");
  } else {
    app.data.user.email = email;
    if (email === "admin@stockx.com") {
      app.data.user.role = "admin";
      app.data.user.fullName = "Administrator";
    } else {
      app.data.user.fullName = "Demo Investor";
    }
    app.showToast("Logged in successfully to StockX.", "success");
  }

  app.saveState();
  app.updateTopBarBalance();
  closeModal("authModal");
}

function openForgotPasswordModal() {
  closeModal("authModal");
  openModal("forgotModal");
}

function submitForgotPassword() {
  const email = document.getElementById("forgotEmail").value;
  closeModal("forgotModal");
  app.showToast(`Simulated reset instructions sent to ${email}`, "info");
}

function toggleNotifs() {
  const dropdown = document.getElementById("notifDropdown");
  if (!dropdown) return;
  const isVisible = dropdown.style.display === "block";
  dropdown.style.display = isVisible ? "none" : "block";
  if (!isVisible) {
    app.renderNotificationsList();
  }
}

function openPriceAlertModal(symbol, alertId = null) {
  app.openPriceAlertModal(symbol, alertId);
}

function editAlert(alertId) {
  app.editAlert(alertId);
}

function openEditPriceAlert(alertId) {
  app.editAlert(alertId);
}

function setAlertCondition(cond) {
  app.updateAlertConditionTabs(cond);
  app.updateAlertModalCalculations();
}

function applyQuickAlertOffset(pct) {
  app.applyQuickAlertOffset(pct);
}

function updateAlertModalCalculations() {
  app.updateAlertModalCalculations();
}

function confirmCreatePriceAlert() {
  app.confirmCreatePriceAlert();
}

function toggleAlertStatus(alertId) {
  app.toggleAlertStatus(alertId);
}

function toggleAlert(alertId) {
  app.toggleAlertStatus(alertId);
}

// Admin handlers
function openAdminAddStockModal() {
  openModal("adminStockModal");
}

function saveAdminStock() {
  const symbol = document.getElementById("adminStockSymbol").value.trim().toUpperCase();
  const name = document.getElementById("adminStockName").value.trim();
  const sector = document.getElementById("adminStockSector").value.trim() || "General";
  const price = parseFloat(document.getElementById("adminStockPrice").value) || 100;

  if (!symbol || !name) {
    app.showToast("Symbol and Company name are required.", "error");
    return;
  }

  const existing = app.getStock(symbol);
  if (existing) {
    existing.name = name;
    existing.sector = sector;
    existing.price = price;
  } else {
    app.data.stocks.push({
      symbol,
      name,
      sector,
      price,
      change: 0.0,
      changePercent: 0.0,
      open: price,
      high: price * 1.02,
      low: price * 0.98,
      prevClose: price,
      volume: 500000,
      marketCap: "₹50,000 Cr",
      pe: 22.0,
      divYield: 1.0,
      week52High: price * 1.25,
      week52Low: price * 0.85,
      description: `${name} is an equity listed in the simulated StockX platform.`
    });
  }

  app.saveState();
  app.renderAll();
  closeModal("adminStockModal");
  app.showToast(`Saved stock ${symbol}`, "success");
}

function resetAllDemoData() {
  if (confirm("Reset all platform data, orders, and portfolio to default demo state?")) {
    app.resetState();
    app.showToast("Platform state reset to initial demo seeds.", "success");
  }
}

function resetDemoBalance() {
  app.data.user.cashBalance = 100000.0;
  app.saveState();
  app.updateTopBarBalance();
  app.renderDashboardMetrics();
  app.showToast("Demo trading funds reset to ₹1,00,000.", "success");
}

function testAndSaveApiUrl() {
  const url = document.getElementById("apiUrlInput").value.trim();
  const statusEl = document.getElementById("apiConnStatus");
  statusEl.innerText = "Connecting to FastAPI...";
  statusEl.className = "text-muted";

  fetch(`${url}/health`, { method: "GET" })
    .then(r => r.json())
    .then(data => {
      localStorage.setItem("stockx_api_url", url);
      app.apiBase = url;
      statusEl.innerText = "Connected to FastAPI server ✓";
      statusEl.className = "text-positive";
      app.showToast("Connected to live FastAPI backend!", "success");
    })
    .catch(err => {
      statusEl.innerText = "FastAPI server offline (Running on standalone demo engine)";
      statusEl.className = "text-accent";
      app.showToast("Operating on standalone simulator mode.", "info");
    });
}

// Initialization on DOM load
document.addEventListener("DOMContentLoaded", () => {
  app.renderAll();
  app.startPriceTicker();
  setupSearch();

  // Mobile navigation button
  const mobileToggle = document.getElementById("mobileNavToggle");
  const sidebar = document.getElementById("appSidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Theme toggle button
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Click outside to close notification dropdown
  document.addEventListener("click", (e) => {
    const container = document.getElementById("notifDropdownContainer");
    const dropdown = document.getElementById("notifDropdown");
    if (container && dropdown && !container.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
});
