from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
import httpx
import logging

from ...schemas import schemas
from ...models import models
from ...database import get_db
from ...core.config import settings
from ...core.ratelimit import limiter

router = APIRouter(prefix="/external", tags=["external"])

logger = logging.getLogger("genfuture.external")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO)

HIPO_URL = "https://universities.hipolabs.com/search"

# Curated fallback external careers for common courses, used when API keys are missing
FALLBACK_CAREERS: Dict[str, List[Dict[str, Any]]] = {
    "computer science": [
        {"name": "Software Engineer", "description": "Build and maintain software systems across web, mobile, and cloud.", "avg_salary": "$120k - $180k/year", "growth_rate": "22% growth expected"},
        {"name": "Data Engineer", "description": "Design data pipelines and infrastructure for analytics and ML.", "avg_salary": "$110k - $170k/year", "growth_rate": "21% growth expected"},
        {"name": "Cloud Solutions Architect", "description": "Design cloud-native solutions and lead platform migrations.", "avg_salary": "$130k - $200k/year", "growth_rate": "20% growth expected"},
    ],
    "business administration": [
        {"name": "Product Manager", "description": "Drive product strategy and execution across cross-functional teams.", "avg_salary": "$100k - $180k/year", "growth_rate": "14% growth expected"},
        {"name": "Business Operations Analyst", "description": "Optimize processes and operational performance using data.", "avg_salary": "$75k - $130k/year", "growth_rate": "12% growth expected"},
    ],
    "medicine": [
        {"name": "Physician (General)", "description": "Primary care diagnosis and treatment.", "avg_salary": "$180k - $300k/year", "growth_rate": "7% growth expected"},
        {"name": "Medical Informatics Specialist", "description": "Integrate clinical workflows with health IT and data systems.", "avg_salary": "$120k - $160k/year", "growth_rate": "15% growth expected"},
    ],
    "electrical engineering": [
        {"name": "Power Systems Engineer", "description": "Plan and maintain transmission and distribution infrastructure.", "avg_salary": "$95k - $150k/year", "growth_rate": "10% growth expected"},
        {"name": "Embedded Systems Engineer", "description": "Design firmware and embedded software for devices.", "avg_salary": "$90k - $140k/year", "growth_rate": "12% growth expected"},
    ],
    "finance": [
        {"name": "Quantitative Analyst", "description": "Model risk and valuation using statistical techniques.", "avg_salary": "$110k - $220k/year", "growth_rate": "13% growth expected"},
        {"name": "Corporate Finance Associate", "description": "Support M&A, capital raising, and financial planning.", "avg_salary": "$95k - $180k/year", "growth_rate": "12% growth expected"},
    ],
}


async def _hipolabs_search(name: Optional[str], country: Optional[str]) -> List[Dict[str, Any]]:
    params: Dict[str, str] = {}
    if name:
        params["name"] = name
    if country:
        params["country"] = country
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(HIPO_URL, params=params)
        resp.raise_for_status()
        return resp.json()


def _normalize_university(item: Dict[str, Any]) -> schemas.University:
    web_pages = item.get("web_pages") or []
    website = web_pages[0] if isinstance(web_pages, list) and web_pages else None
    return schemas.University(
        id=0,
        name=item.get("name") or "Unknown University",
        latitude=0.0,
        longitude=0.0,
        country=item.get("country"),
        city=item.get("state-province"),
        type=None,
        ranking=None,
        website=website,
        courses=[],
    )


@limiter.limit("60/minute")
@router.get("/universities/search", response_model=List[schemas.University])
async def universities_search(
    request: Request,
    name: Optional[str] = Query(None, description="University name contains"),
    country: Optional[str] = Query(None, description="Country name (English)"),
    db: Session = Depends(get_db),
):
    try:
        raw = await _hipolabs_search(name=name, country=country)
    except Exception as e:
        logger.warning(f"[external] Hipolabs fetch failed: {e}")
        raw = []

    normalized: List[schemas.University] = []
    if not raw:
        # Local fallback when external source is unavailable or empty
        q_local = db.query(models.University)
        if name:
            q_local = q_local.filter(models.University.name.ilike(f"%{(name or '').strip()}%"))
        if country:
            q_local = q_local.filter(func.lower(models.University.country) == (country or "").strip().lower())
        local_models = q_local.limit(50).all()
        for m in local_models:
            normalized.append(
                schemas.University(
                    id=m.id,
                    name=m.name,
                    latitude=m.latitude or 0.0,
                    longitude=m.longitude or 0.0,
                    country=m.country,
                    city=m.city,
                    type=m.type,
                    ranking=m.ranking,
                    website=m.website,
                    courses=[],
                )
            )
        logger.info(f"[external] fallback_local name={name} country={country} total_local={len(normalized)}")
    else:
        # Normalize external payload to schema items
        normalized = [_normalize_university(item) for item in raw]

    # Map normalized external items to local DB IDs where possible (case-insensitive + fallbacks)
    matched = 0
    matched_strict = 0
    matched_city = 0
    matched_partial = 0
    mapped: List[schemas.University] = []

    for uni in normalized:
        local = None
        name_key = (uni.name or "").strip().lower()
        country_key = (uni.country or "").strip().lower()
        city_key = (uni.city or "").strip().lower()

        # Attempt 1: strict match on name + country (case-insensitive)
        q = db.query(models.University).filter(
            func.lower(models.University.name) == name_key
        )
        if country_key:
            q = q.filter(func.lower(models.University.country) == country_key)
        local = q.first()
        if local:
            matched += 1
            matched_strict += 1
        else:
            # Attempt 2: include city if provided (still case-insensitive)
            if city_key:
                q2 = db.query(models.University).filter(
                    func.lower(models.University.name) == name_key
                )
                if country_key:
                    q2 = q2.filter(func.lower(models.University.country) == country_key)
                q2 = q2.filter(func.lower(models.University.city) == city_key)
                local = q2.first()
                if local:
                    matched += 1
                    matched_city += 1

        if not local:
            # Attempt 3: partial name match (ILIKE) with optional country constraint
            like_pattern = f"%{name_key}%"
            q3 = db.query(models.University).filter(
                models.University.name.ilike(like_pattern)
            )
            if country_key:
                q3 = q3.filter(func.lower(models.University.country) == country_key)
            local = q3.first()
            if local:
                matched += 1
                matched_partial += 1

        if local:
            # Assign real local ID so the UI can fetch courses via /universities/{id}/courses
            uni.id = local.id

        mapped.append(uni)

    logger.info(
        f"[external] universities_search name={name} country={country} "
        f"total={len(normalized)} matched_local={matched} "
        f"(strict={matched_strict}, city={matched_city}, partial={matched_partial})"
    )

    # Deduplicate by (name, country, city, id)
    seen = set()
    result: List[schemas.University] = []
    for uni in mapped:
        key = (uni.name, uni.country, uni.city, uni.id)
        if key in seen:
            continue
        seen.add(key)
        result.append(uni)
    return result


def _to_career_path_schema_from_model(m: models.CareerPath) -> schemas.CareerPath:
    return schemas.CareerPath(
        id=m.id,
        name=m.name,
        description=m.description,
        avg_salary=m.avg_salary,
        growth_rate=m.growth_rate,
        course_id=m.course_id,
    )


async def _fetch_external_careers_for_course(course_name: str) -> List[Dict[str, Any]]:
    name_key = (course_name or "").strip().lower()
    # If API keys are not configured, serve curated external-like data
    if not getattr(settings, "ONET_API_KEY", None) or not getattr(settings, "BLS_API_KEY", None):
        return FALLBACK_CAREERS.get(name_key, [])

    results: List[Dict[str, Any]] = []
    # Minimal O*NET integration placeholder: if API keys provided, attempt to query by keyword
    try:
        # O*NET My Next Move careers search (keyword-based)
        # API docs: https://services.onetcenter.org/
        # Note: exact endpoint may vary by key privileges; we call a common search path and ignore errors.
        query_keywords = [kw for kw in name_key.split() if kw]
        params = {"q": " ".join(query_keywords), "start": 1, "end": 10}
        auth = (getattr(settings, "ONET_API_KEY", ""), "")  # O*NET uses HTTP Basic with API key as username
        async with httpx.AsyncClient(timeout=10.0, auth=auth) as client:
            resp = await client.get("https://services.onetcenter.org/ws/mnm/careers/search", params=params)
            if resp.status_code == 200:
                data = resp.json()
                # Normalize a few items if present
                items = data if isinstance(data, list) else (data.get("careers") or [])
                for item in items[:10]:
                    title = item.get("title") or item.get("career") or "Unknown Career"
                    summary = item.get("summary") or item.get("description")
                    results.append({"name": title, "description": summary, "avg_salary": None, "growth_rate": None})
    except Exception:
        # Ignore O*NET errors
        pass

    # Attempt to enrich with BLS wage/growth if available
    try:
        if results:
            # Simple enrichment heuristic: set placeholders indicating data source intended
            for r in results:
                if not r.get("avg_salary"):
                    r["avg_salary"] = "See BLS Occupational Employment Statistics"
                if not r.get("growth_rate"):
                    r["growth_rate"] = "See BLS Employment Projections"
    except Exception:
        pass

    # If nothing could be fetched, fall back to curated data
    if not results:
        return FALLBACK_CAREERS.get(name_key, [])
    return results


@limiter.limit("60/minute")
@router.get("/careers/by-course/{course_id}", response_model=List[schemas.CareerPath])
async def careers_by_course(request: Request, course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    local = db.query(models.CareerPath).filter(models.CareerPath.course_id == course_id).all()
    local_schemas = [_to_career_path_schema_from_model(cp) for cp in local]

    external: List[schemas.CareerPath] = []
    try:
        ext_items = await _fetch_external_careers_for_course(course.name or "")
        for item in ext_items:
            external.append(
                schemas.CareerPath(
                    id=0,
                    name=item.get("name", "Unknown Career"),
                    description=item.get("description"),
                    avg_salary=item.get("avg_salary"),
                    growth_rate=item.get("growth_rate"),
                    course_id=course_id,
                )
            )
    except Exception:
        # Swallow external errors and fallback to local only
        external = []

    # Merge by unique name, prefer local info over external
    merged: Dict[str, schemas.CareerPath] = {}
    for cp in external:
        merged[cp.name] = cp
    for cp in local_schemas:
        merged[cp.name] = cp

    return list(merged.values())