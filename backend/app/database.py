from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path
import logging
from .core.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Debug logging for database configuration
_logger = logging.getLogger("genfuture.db")
if not _logger.handlers:
    logging.basicConfig(level=logging.INFO)

try:
    resolved_url = str(engine.url)
except Exception:
    resolved_url = "unavailable"
try:
    db_path = None
    if resolved_url.startswith("sqlite"):
        # For sqlite, engine.url.database gives the file path (may be relative)
        db_path = str(Path(engine.url.database).resolve()) if engine.url.database else None
except Exception:
    db_path = None

_logger.info(f"[DB] SQLALCHEMY_DATABASE_URL={SQLALCHEMY_DATABASE_URL}")
_logger.info(f"[DB] engine.url={resolved_url}")
_logger.info(f"[DB] cwd={Path.cwd()}")
if db_path:
    _logger.info(f"[DB] sqlite resolved path={db_path}")
    _logger.info(f"[DB] Database file exists: {Path(db_path).exists()}")
else:
    _logger.warning("[DB] Could not resolve database path")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
