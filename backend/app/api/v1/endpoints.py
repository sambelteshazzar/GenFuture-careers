import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ... import schemas
from ...models import models
from ...database import get_db, engine
from ...core.auth import get_current_active_user

router = APIRouter()
logger = logging.getLogger("genfuture.endpoints")


@router.get("/")
def api_v1_root():
    return {"status": "ok", "service": "GenFuture API", "version": "v1"}

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user

@router.get("/universities/nearby", response_model=List[schemas.University])
def get_nearby_universities(
    latitude: float,
    longitude: float,
    limit: int = 20,
    offset: int = 0,
    country: Optional[str] = None,
    type: Optional[str] = None,
    ranking_min: Optional[int] = None,
    ranking_max: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Return nearby universities sorted by proximity with optional filters, paginated via offset/limit after sorting."""
    # Local import to avoid global changes
    import math

    def haversine_km(lat1, lon1, lat2, lon2):
        try:
            if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
                return float('inf')
            # convert to radians
            rlat1 = lat1 * math.pi / 180.0
            rlon1 = lon1 * math.pi / 180.0
            rlat2 = lat2 * math.pi / 180.0
            rlon2 = lon2 * math.pi / 180.0
            dlat = rlat2 - rlat1
            dlon = rlon2 - rlon1
            a = math.sin(dlat/2)**2 + math.cos(rlat1) * math.cos(rlat2) * math.sin(dlon/2)**2
            c = 2 * math.asin(min(1.0, math.sqrt(a)))
            return 6371.0 * c
        except Exception:
            return float('inf')

    # Sanitize pagination
    limit = max(1, min(limit, 100))
    offset = max(0, offset)

    # Build filterable query
    q = db.query(models.University)
    if country:
        q = q.filter(models.University.country.ilike(f"%{country}%"))
    if type:
        q = q.filter(models.University.type.ilike(f"%{type}%"))
    if ranking_min is not None:
        q = q.filter(models.University.ranking >= ranking_min)
    if ranking_max is not None:
        q = q.filter(models.University.ranking <= ranking_max)

    items = q.all()

    # Sort by proximity (lat/lon provided by client)
    items_sorted = sorted(
        items,
        key=lambda u: haversine_km(latitude, longitude, getattr(u, "latitude", None), getattr(u, "longitude", None))
    )

    # Apply pagination after sorting
    universities = items_sorted[offset: offset + limit]

    try:
        num_unis = len(universities)
        num_courses = 0
        num_career_paths = 0
        for u in universities:
            cs = getattr(u, "courses", []) or []
            num_courses += len(cs)
            for c in cs:
                num_career_paths += len(getattr(c, "career_paths", []) or [])
        logger.info(
            f"[v1] nearby lat={latitude} lon={longitude} limit={limit} offset={offset} "
            f"filters={{country:{country}, type:{type}, ranking_min:{ranking_min}, ranking_max:{ranking_max}}} "
            f"universities={num_unis} courses={num_courses} career_paths={num_career_paths}"
        )
    except Exception as e:
        logger.warning(f"[v1] nearby metrics logging failed: {e}")
    return universities

@router.get("/universities/nearby-lite")
def get_nearby_universities_lite(
    latitude: float,
    longitude: float,
    limit: int = 20,
    offset: int = 0,
    country: Optional[str] = None,
    type: Optional[str] = None,
    ranking_min: Optional[int] = None,
    ranking_max: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """Lightweight variant without nested relationships; sorts by proximity; supports basic filters; paginated after sorting."""
    # Local import to avoid global changes
    import math

    def haversine_km(lat1, lon1, lat2, lon2):
        try:
            if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
                return float('inf')
            rlat1 = lat1 * math.pi / 180.0
            rlon1 = lon1 * math.pi / 180.0
            rlat2 = lat2 * math.pi / 180.0
            rlon2 = lon2 * math.pi / 180.0
            dlat = rlat2 - rlat1
            dlon = rlon2 - rlon1
            a = math.sin(dlat/2)**2 + math.cos(rlat1) * math.cos(rlat2) * math.sin(dlon/2)**2
            c = 2 * math.asin(min(1.0, math.sqrt(a)))
            return 6371.0 * c
        except Exception:
            return float('inf')

    limit = max(1, min(limit, 100))
    offset = max(0, offset)

    q = db.query(models.University)
    if country:
        q = q.filter(models.University.country.ilike(f"%{country}%"))
    if type:
        q = q.filter(models.University.type.ilike(f"%{type}%"))
    if ranking_min is not None:
        q = q.filter(models.University.ranking >= ranking_min)
    if ranking_max is not None:
        q = q.filter(models.University.ranking <= ranking_max)

    items = q.all()
    items_sorted = sorted(
        items,
        key=lambda u: haversine_km(latitude, longitude, getattr(u, "latitude", None), getattr(u, "longitude", None))
    )
    paged = items_sorted[offset: offset + limit]

    result = []
    for u in paged:
        result.append({
            "id": u.id,
            "name": u.name,
            "latitude": u.latitude,
            "longitude": u.longitude,
            "country": u.country,
            "city": u.city,
            "type": u.type,
            "ranking": u.ranking,
            "website": u.website,
        })
    try:
        logger.info(
            f"[v1] nearby-lite lat={latitude} lon={longitude} limit={limit} offset={offset} "
            f"filters={{country:{country}, type:{type}, ranking_min:{ranking_min}, ranking_max:{ranking_max}}} "
            f"universities={len(result)}"
        )
    except Exception as e:
        logger.warning(f"[v1] nearby-lite metrics logging failed: {e}")
    return result

@router.get("/universities/{university_id}/courses", response_model=List[schemas.Course])
def get_university_courses(
    university_id: int,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    limit = max(1, min(limit, 100))
    offset = max(0, offset)
    courses = (
        db.query(models.Course)
        .filter(models.Course.university_id == university_id)
        .offset(offset)
        .limit(limit)
        .all()
    )
    try:
        logger.info(f"[v1] courses university_id={university_id} limit={limit} offset={offset} count={len(courses)}")
    except Exception as e:
        logger.warning(f"[v1] courses metrics logging failed: {e}")
    # Return 200 with empty list when no results found for idempotent list endpoints
    return courses

@router.get("/courses/{course_id}/career-paths", response_model=List[schemas.CareerPath])
def get_course_career_paths(
    course_id: int,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    limit = max(1, min(limit, 100))
    offset = max(0, offset)
    career_paths = (
        db.query(models.CareerPath)
        .filter(models.CareerPath.course_id == course_id)
        .offset(offset)
        .limit(limit)
        .all()
    )
    # Return 200 with empty list when no results
    return career_paths
