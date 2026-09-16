// StockX - Client Side Interactions

document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const menuBtn = document.getElementById("menuToggleBtn");
  const sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Stock search auto-complete
  const searchInput = document.getElementById("globalSearchInput");
  const searchDropdown = document.getElementById("searchDropdown");

  if (searchInput && searchDropdown) {
    let debounceTimer;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();

      if (!query) {
        searchDropdown.style.display = "none";
        searchDropdown.innerHTML = "";
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.length === 0) {
              searchDropdown.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No stocks found</div>`;
            } else {
              searchDropdown.innerHTML = data
                .map((s) => {
                  const isPos = s.change >= 0;
                  const sign = isPos ? "+" : "";
                  const colorClass = isPos ? "text-positive" : "text-negative";
                  return `
                    <div class="search-item" onclick="window.location.href='/stock/${s.symbol}'">
                      <div>
                        <div style="font-weight: 700; color: var(--text-primary);">${s.symbol}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${s.company_name}</div>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-weight: 700;">₹${Number(s.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        <div class="${colorClass}" style="font-size: 0.75rem; font-weight: 600;">${sign}${s.change_percent.toFixed(2)}%</div>
                      </div>
                    </div>
                  `;
                })
                .join("");
            }
            searchDropdown.style.display = "block";
          })
          .catch((err) => console.error("Search error:", err));
      }, 250);
    });

    // Close search dropdown on click outside
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.style.display = "none";
      }
    });

    // Enter key navigation
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const firstItem = searchDropdown.querySelector(".search-item");
        if (firstItem) {
          firstItem.click();
        } else if (searchInput.value.trim()) {
          window.location.href = `/stock/${searchInput.value.trim().toUpperCase()}`;
        }
      }
    });
  }
});

// ============================================================================
// Modal & Trade Handling
// ============================================================================

let currentTradeStock = null;
let currentTradePrice = 0;
let currentTradeType = "BUY";
let availableCash = 100000;
let ownedQuantity = 0;

function openTradeModal(symbol, price, type = "BUY", cash = 100000, owned = 0) {
  currentTradeStock = symbol;
  currentTradePrice = parseFloat(price);
  currentTradeType = type.toUpperCase();
  availableCash = parseFloat(cash);
  ownedQuantity = parseInt(owned, 10);

  const modal = document.getElementById("tradeModal");
  const title = document.getElementById("tradeModalTitle");
  const stockEl = document.getElementById("tradeModalStock");
  const priceEl = document.getElementById("tradeModalPrice");
  const qtyInput = document.getElementById("tradeQuantityInput");
  const submitBtn = document.getElementById("tradeSubmitBtn");
  const errorEl = document.getElementById("tradeErrorText");

  if (!modal) return;

  errorEl.style.display = "none";
  errorEl.innerText = "";
  qtyInput.value = 1;

  title.innerText = `${currentTradeType} ${symbol}`;
  stockEl.innerText = symbol;
  priceEl.innerText = `₹${currentTradePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  submitBtn.className = currentTradeType === "BUY" ? "btn btn-buy" : "btn btn-sell";
  submitBtn.style.width = "100%";
  submitBtn.innerText = `Confirm ${currentTradeType}`;

  updateTradeCalculation();
  modal.classList.add("active");
}

function closeTradeModal() {
  const modal = document.getElementById("tradeModal");
  if (modal) modal.classList.remove("active");
}

function updateTradeCalculation() {
  const qtyInput = document.getElementById("tradeQuantityInput");
  const totalEl = document.getElementById("tradeTotalAmount");
  const balanceEl = document.getElementById("tradeBalanceStatus");
  const submitBtn = document.getElementById("tradeSubmitBtn");
  const errorEl = document.getElementById("tradeErrorText");

  const qty = parseInt(qtyInput.value, 10) || 0;
  const total = qty * currentTradePrice;

  totalEl.innerText = `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  let isValid = true;
  let errorMsg = "";

  if (qty <= 0) {
    isValid = false;
    errorMsg = "Quantity must be greater than 0.";
  } else if (currentTradeType === "BUY") {
    balanceEl.innerText = `Available Cash: ₹${availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    if (total > availableCash) {
      isValid = false;
      errorMsg = "Insufficient demo cash for this order.";
    }
  } else if (currentTradeType === "SELL") {
    balanceEl.innerText = `Shares Owned: ${ownedQuantity}`;
    if (qty > ownedQuantity) {
      isValid = false;
      errorMsg = `Cannot sell more than owned shares (${ownedQuantity}).`;
    }
  }

  if (!isValid && errorMsg) {
    errorEl.innerText = errorMsg;
    errorEl.style.display = "block";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
  } else {
    errorEl.style.display = "none";
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
  }
}

function submitTrade() {
  const qtyInput = document.getElementById("tradeQuantityInput");
  const submitBtn = document.getElementById("tradeSubmitBtn");
  const errorEl = document.getElementById("tradeErrorText");

  const qty = parseInt(qtyInput.value, 10);
  if (!qty || qty <= 0) {
    errorEl.innerText = "Please enter a valid quantity.";
    errorEl.style.display = "block";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  fetch("/api/trade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbol: currentTradeStock,
      type: currentTradeType,
      quantity: qty
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        closeTradeModal();
        window.location.reload();
      } else {
        errorEl.innerText = data.error || "Trade execution failed.";
        errorEl.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.innerText = `Confirm ${currentTradeType}`;
      }
    })
    .catch((err) => {
      errorEl.innerText = "Network error. Please try again.";
      errorEl.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.innerText = `Confirm ${currentTradeType}`;
    });
}

// Watchlist toggle
function toggleWatchlist(symbol, btnElement) {
  fetch("/api/watchlist/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        if (btnElement) {
          if (data.in_watchlist) {
            btnElement.classList.add("btn-primary");
            btnElement.classList.remove("btn-secondary");
            btnElement.innerHTML = `★ In Watchlist`;
          } else {
            btnElement.classList.remove("btn-primary");
            btnElement.classList.add("btn-secondary");
            btnElement.innerHTML = `☆ Add to Watchlist`;
          }
        } else {
          window.location.reload();
        }
      }
    })
    .catch((err) => console.error("Watchlist toggle failed:", err));
}
