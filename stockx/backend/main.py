import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .database import engine, Base
from .seed_data import init_and_seed_db
from .routes.auth_routes import router as auth_router
from .routes.stock_routes import router as stock_router
from .routes.watchlist_routes import router as watchlist_router
from .routes.portfolio_routes import router as portfolio_router
from .routes.order_routes import router as order_router
from .routes.transaction_routes import router as transaction_router
from .routes.news_routes import router as news_router
from .routes.admin_routes import router as admin_router

# Initialize database schema and seeds
Base.metadata.create_all(bind=engine)
init_and_seed_db()

app = FastAPI(
    title="StockX API",
    description="Backend REST API for StockX modern stock market learning & simulation platform",
    version="1.0.0"
)

# Configure CORS for frontend access (localhost, mobile webview, preview environments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Route modules
app.include_router(auth_router)
app.include_router(stock_router)
app.include_router(watchlist_router)
app.include_router(portfolio_router)
app.include_router(order_router)
app.include_router(transaction_router)
app.include_router(news_router)
app.include_router(admin_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "StockX",
        "mode": "Simulation / Learning Demo",
        "version": "1.0.0"
    }

# Optionally serve frontend directly from FastAPI if frontend directory exists
frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(frontend_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("stockx.backend.main:app", host="0.0.0.0", port=8000, reload=True)
