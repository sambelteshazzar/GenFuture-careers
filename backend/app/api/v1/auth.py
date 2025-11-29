from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt
import logging

from ... import schemas
from ...core import auth
from ...database import get_db
from ...core.ratelimit import limiter
from ...core.config import settings

router = APIRouter()
logger = logging.getLogger("genfuture.auth.routes")

@router.post("/token", response_model=schemas.Token)
@limiter.limit("5/minute")
def login_for_access_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    # Normalize and log attempt (never log passwords)
    email_in = (form_data.username or "").strip().lower()
    client_ip = getattr(getattr(request, "client", None), "host", None)
    try:
        logger.info("auth.token: login_attempt email=%s ip=%s", email_in, client_ip)
    except Exception:
        pass

    user = auth.authenticate_user(db, email_in, form_data.password)
    if not user:
        try:
            logger.info("auth.token: login_failed email=%s ip=%s", email_in, client_ip)
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    # Create and set refresh token (HttpOnly cookie)
    refresh_token = auth.create_refresh_token(data={"sub": user.email, "type": "refresh"})
    secure_cookie = settings.ENVIRONMENT != "development"
    try:
        logger.info(
            "auth.token: login_success email=%s user_id=%s ip=%s secure_cookie=%s",
            getattr(user, "email", None),
            getattr(user, "id", None),
            client_ip,
            secure_cookie,
        )
    except Exception:
        pass
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/",
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh", response_model=schemas.Token)
@limiter.limit("10/minute")
def refresh_token(request: Request, response: Response):
    client_ip = getattr(getattr(request, "client", None), "host", None)
    token = request.cookies.get("refresh_token")
    if not token:
        try:
            logger.info("auth.refresh: missing_cookie ip=%s", client_ip)
        except Exception:
            pass
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        if payload.get("type") != "refresh":
            try:
                logger.info("auth.refresh: wrong_type ip=%s", client_ip)
            except Exception:
                pass
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        email: str = payload.get("sub")
        if not email:
            try:
                logger.info("auth.refresh: missing_sub ip=%s", client_ip)
            except Exception:
                pass
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token subject")
    except JWTError:
        try:
            logger.info("auth.refresh: jwt_error ip=%s", client_ip)
        except Exception:
            pass
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    # Issue new access token and rotate refresh token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(data={"sub": email}, expires_delta=access_token_expires)
    new_refresh = auth.create_refresh_token(data={"sub": email, "type": "refresh"})
    secure_cookie = settings.ENVIRONMENT != "development"
    try:
        logger.info("auth.refresh: success email=%s ip=%s secure_cookie=%s", email, client_ip, secure_cookie)
    except Exception:
        pass
    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/",
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=schemas.User)
@limiter.limit("3/minute")
async def register_user(request: Request, response: Response, user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Normalize/strip fields
    client_ip = getattr(getattr(request, "client", None), "host", None)
    normalized_email = (user.email or "").strip().lower()
    try:
        logger.info("auth.register: attempt email=%s ip=%s", normalized_email, client_ip)
    except Exception:
        pass

    db_user = auth.get_user(db, email=normalized_email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Ensure the email we pass to create_user is normalized for consistency
    fixed_user = schemas.UserCreate(
        email=normalized_email,
        first_name=(user.first_name or "").strip(),
        last_name=(user.last_name or "").strip(),
        password=user.password,
    )
    created = auth.create_user(db=db, user=fixed_user)

    # Set refresh cookie to align with login flow
    try:
        new_refresh = auth.create_refresh_token(data={"sub": normalized_email, "type": "refresh"})
        secure_cookie = settings.ENVIRONMENT != "development"
        response.set_cookie(
            key="refresh_token",
            value=new_refresh,
            httponly=True,
            secure=secure_cookie,
            samesite="lax",
            max_age=7 * 24 * 3600,
            path="/",
        )
        try:
            logger.info(
                "auth.register: success email=%s user_id=%s ip=%s secure_cookie=%s",
                normalized_email,
                getattr(created, "id", None),
                client_ip,
                secure_cookie,
            )
        except Exception:
            pass
    except Exception:
        # Do not fail user creation if cookie setting fails; log best-effort
        try:
            logger.exception("auth.register: cookie_set_failed email=%s ip=%s", normalized_email, client_ip)
        except Exception:
            pass

    return created
