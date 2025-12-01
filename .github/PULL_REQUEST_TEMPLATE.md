## Summary

This PR contains non-destructive improvements for the frontend testing and CI pipeline.
It adds Vitest unit tests, test setup, coverage configuration and CI steps to run tests and upload coverage artifacts.

Branch: dev/frontend-tests

## Changes included
- Add frontend unit tests for: App, Header, Footer, Logo, LandingPage, AuthPage, DashboardPage
- Fixed test setup (IntersectionObserver polyfill) and React imports in test files
- vitest configuration with coverage reporting (v8 provider) and CI scripts
- CI changes: run frontend tests, produce coverage artifacts and enforce 60% line coverage
- Archived legacy `frontend-new` into `archive/legacy-frontend-new`

## Why
Improves confidence by verifying UI components with unit tests and adding coverage and CI checks so future changes won't accidentally break the UI.

## Notes for reviewers
- This branch is safe, non-destructive, and only adds tests / CI / docs.
- Running tests locally: `cd frontend && npm ci && npm run test:ci`

If you'd like, I can also update the lockfile or expand tests to cover more components before merging.
