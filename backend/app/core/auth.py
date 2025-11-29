from datetime import datetime, timedelta
from typing import Optional
import uuid
import logging
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import models
from .. import schemas
from ..core.config import settings

# Security configuration
_logger = logging.getLogger("genfuture.auth")

# Enforce SECRET_KEY in non-development environments
if settings.SECRET_KEY:
    SECRET_KEY = settings.SECRET_KEY
elif settings.ENVIRONMENT == "development":
    SECRET_KEY = "dev-insecure-secret-change-me"
    try:
        _logger.warning("SECRET_KEY not set; using insecure development default. Set SECRET_KEY in environment.")
    except Exception:
        pass
else:
    raise RuntimeError("SECRET_KEY must be set when ENVIRONMENT is not 'development'")

ALGORITHM = settings.JWT_ALGORITHM or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES or 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    """
    Authenticate a user by email and password.

    Server-side diagnostics (does not leak secrets):
      - Logs when user not found
      - Logs when password mismatch
      - Logs on success
      - Logs unexpected exceptions

    NOTE: No plaintext passwords or hashes are logged.
    """
    try:
        user = get_user(db, email)
        if not user:
            try:
                _logger.info("auth.authenticate_user: user_not_found email=%s", email)
            except Exception:
                pass
            return False

        if not verify_password(password, user.hashed_password):
            try:
                _logger.info(
                    "auth.authenticate_user: password_mismatch email=%s user_id=%s",
                    email,
                    getattr(user, "id", None),
                )
            except Exception:
                pass
            return False

        try:
            _logger.info(
                "auth.authenticate_user: success email=%s user_id=%s",
                email,
                getattr(user, "id", None),
            )
        except Exception:
            pass
        return user
    except Exception as e:
        try:
            _logger.exception("auth.authenticate_user: error email=%s err=%s", email, e)
        except Exception:
            pass
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    now = datetime.utcnow()
    to_encode = data.copy()
    expire = now + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    claims = {
        "exp": expire,
        "iat": now,
        "nbf": now,
        "jti": str(uuid.uuid4()),
    }
    to_encode.update(claims)
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Default refresh token lifetime (days)
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a refresh token (longer-lived). Caller should include {"type": "refresh"} in data.
    """
    now = datetime.utcnow()
    to_encode = data.copy()
    expire = now + (expires_delta if expires_delta else timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    claims = {
        "exp": expire,
        "iat": now,
        "nbf": now,
        "jti": str(uuid.uuid4()),
    }
    to_encode.update(claims)
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user