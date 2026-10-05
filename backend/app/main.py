"""
TomatoCare AI - Main FastAPI Application Entrypoint.
Provides REST API for leaf disease classification, Grad-CAM XAI, history journal, and analytics.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.database.session import engine, Base
from backend.app.services.model_manager import ModelManager

# Import routers
from backend.app.api.endpoints.predict import router as predict_router
from backend.app.api.endpoints.explain import router as explain_router
from backend.app.api.endpoints.diseases import router as diseases_router
from backend.app.api.endpoints.history import router as history_router
from backend.app.api.endpoints.analytics import router as analytics_router
from backend.app.api.endpoints.model import router as model_router
from backend.app.api.endpoints.assistant import router as assistant_router
from backend.app.api.endpoints.feedback import router as feedback_router
from backend.app.api.endpoints.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for application startup and shutdown events."""
    print("================================================================")
    print(" TomatoCare AI — Production Inference & Research Backend")
    print(" EfficientNetB0 Tomato Leaf Disease Classification System")
    print("================================================================")
    
    # 1. Initialize SQLite database tables
    try:
        Base.metadata.create_all(bind=engine)
        print("[+] Database tables initialized successfully.")
    except Exception as e:
        print(f"[!] Database initialization error: {e}")

    # 2. Initialize Model Manager singleton and load weights
    model_mgr = ModelManager.get_instance(artifacts_dir=settings.ARTIFACTS_DIR)
    model_mgr.initialize()

    yield

    print("[*] TomatoCare AI backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI backend for Tomato Leaf Disease Detection and Classification using EfficientNetB0.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router, prefix=settings.API_PREFIX, tags=["Health"])
app.include_router(predict_router, prefix=settings.API_PREFIX, tags=["Inference"])
app.include_router(explain_router, prefix=settings.API_PREFIX, tags=["Explainability"])
app.include_router(diseases_router, prefix=settings.API_PREFIX, tags=["Disease Encyclopedia"])
app.include_router(history_router, prefix=settings.API_PREFIX, tags=["Health Journal"])
app.include_router(analytics_router, prefix=settings.API_PREFIX, tags=["Analytics"])
app.include_router(model_router, prefix=settings.API_PREFIX, tags=["Model Info & Metrics"])
app.include_router(assistant_router, prefix=settings.API_PREFIX, tags=["Plant Assistant"])
app.include_router(feedback_router, prefix=settings.API_PREFIX, tags=["Feedback & Audit"])


@app.get("/")
def root():
    """Root endpoint for status redirect and greeting."""
    return {
        "project": "TomatoCare AI",
        "description": "Tomato Leaf Disease Detection and Classification Using EfficientNetB0",
        "docs_url": "/docs",
        "api_health": f"{settings.API_PREFIX}/health",
        "classes_supported": 10
    }
