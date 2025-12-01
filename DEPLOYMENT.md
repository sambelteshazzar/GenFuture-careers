# Deployment Checklist for GenFuture

This file contains a concise guide for preparing and deploying GenFuture to production.

## Pre-deployment checklist

- [ ] Secrets: Provide production `SECRET_KEY`, `DATABASE_URL`, and any third-party credentials via your secrets manager (GitHub Actions secrets, Vault, etc.). Do NOT store secrets in the repository.
- [ ] Database: Provision a managed Postgres (or MySQL) instance and set `DATABASE_URL` accordingly.
- [ ] Migrations: Add and apply DB migrations (Alembic recommended). Ensure a migration job runs during deployment.
- [ ] Build images: Build and push backend and frontend images to a registry (GHCR/Docker Hub). Use CI to build & scan the images.

## Quick deploy (docker-compose)

1. Create a `.env.prod` next to `docker-compose.prod.yml` with at minimum:

```
ENVIRONMENT=production
SECRET_KEY=... (use a secure random string)
DATABASE_URL=postgresql://user:pass@db:5432/genfuture
POSTGRES_USER=genfuture
POSTGRES_PASSWORD=strongpassword
POSTGRES_DB=genfuture
```

2. Build and run:

```bash
# build and start services (CI pushes recommended)
docker compose -f docker-compose.prod.yml up --build -d
```

3. Run DB migrations (example using Alembic):

```bash
docker compose -f docker-compose.prod.yml run --rm backend alembic upgrade head
```

## Security hardening

- Ensure `SECRET_KEY` is set and strong.
- Offload static file serving to CDN or Nginx (frontend is Dockerized with Nginx).
- Ensure IDS, rate-limiting, and monitoring (Sentry, Prometheus) are configured.
- Run dependency scans and verify no unresolved high/critical vulnerabilities.

## CI/CD

- Add image publish steps to `.github/workflows/docker-build.yml` to push to GHCR or Docker Hub.
- Add automated security scans (Dependabot, pip-audit/npm audit in CI, or Snyk).

## Rollback plan

- Keep image tags for each release and use the previous tag to roll back quickly.
- Test recovery: snapshot DB before migrations and practice rollback in staging.

