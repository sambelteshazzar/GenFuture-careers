from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from .database import engine
from .models import models
from .api.v1 import endpoints
from .api.v1 import auth as auth_router
from .api.v1 import external as external_router
from .core.config import settings
from .core.ratelimit import init_rate_limiter
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("[MAIN] Initializing GenFuture Careers API...")

models.Base.metadata.create_all(bind=engine)
logger.info("[MAIN] Database tables created/verified")

app = FastAPI(title="GenFuture Careers API")
logger.info("[MAIN] FastAPI application created")

# Initialize rate limiting middleware/handlers
try:
    init_rate_limiter(app)
    logger.info("[MAIN] Rate limiter initialized")
except Exception as e:
    logger.warning(f"[MAIN] Rate limiter initialization failed: {e}")

# Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # Baseline security headers
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "no-referrer-when-downgrade")
        response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=()")
        # Content Security Policy (allow Hipolabs external API)
        csp = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://universities.hipolabs.com"
        response.headers.setdefault("Content-Security-Policy", csp)
        # HSTS only for production
        if settings.ENVIRONMENT == "production":
            response.headers.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
        return response

# Determine allowed CORS origins from environment (pydantic settings)
origins_env = settings.CORS_ALLOW_ORIGINS or ""
if origins_env.strip():
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    allow_origins = ["http://localhost:5173", "http://localhost:5174"]  # sensible dev defaults

# Determine allowed hosts
hosts_env = settings.ALLOWED_HOSTS or ""
allowed_hosts = [h.strip() for h in hosts_env.split(",") if h.strip()]
if not allowed_hosts:
    allowed_hosts = ["*"] if settings.ENVIRONMENT == "development" else ["localhost"]

logger.info(f"[MAIN] CORS allow_origins = {allow_origins}")
logger.info(f"[MAIN] ALLOWED_HOSTS = {allowed_hosts}")

# Add Host protection
app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# Add CORS middleware (tighten in production)
if settings.ENVIRONMENT == "production":
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type"]
else:
    allow_methods = ["*"]
    allow_headers = ["*"]

# Add CORS middleware (configured above)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=allow_methods,
    allow_headers=allow_headers,
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

app.include_router(endpoints.router, prefix="/api/v1", tags=["data"])
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(external_router.router, prefix="/api/v1", tags=["external"])

@app.get("/")
def read_root():
    return {"message": "Welcome to GenFuture Careers API"}

@app.get("/healthz")
def healthz():
    """Liveness probe."""
    return {"status": "ok"}

@app.get("/readyz")
def readyz():
    """Readiness probe with DB check."""
    db_ok = True
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
    except Exception as e:
        logger.warning(f"[MAIN] DB readiness check failed: {e}")
        db_ok = False
    return {"status": "ok" if db_ok else "degraded", "database": db_ok}
