from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Import API Routers
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.soundbox import router as soundbox_router
from app.api.v1.campaigns import router as campaigns_router
from app.api.v1.copilot import router as copilot_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routers under /api/v1
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(soundbox_router, prefix=settings.API_V1_STR)
app.include_router(campaigns_router, prefix=settings.API_V1_STR)
app.include_router(copilot_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to Vyapaar AI - AI-Powered Merchant Growth Copilot (Paytm Edition)",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
