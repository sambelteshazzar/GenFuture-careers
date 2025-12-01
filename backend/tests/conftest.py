import importlib
import os

import pytest


@pytest.fixture(scope="session")
def client(tmp_path, monkeypatch):
    """Create a TestClient using a temporary sqlite DB so tests don't touch local files.

    We set DATABASE_URL before importing the app so the app's SQLAlchemy engine
    uses the test DB. Then we reload modules to ensure engine is recreated.
    """
    db_file = tmp_path / "test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db_file}")

    # reload modules so they pick up the test DATABASE_URL
    # import modules from package-root 'app'
    try:
        import app.database as database_module
        importlib.reload(database_module)
    except Exception:
        # if database module not yet imported, importing via importlib
        importlib.invalidate_caches()

    try:
        import app.main as main_module
        importlib.reload(main_module)
    except Exception:
        importlib.invalidate_caches()

    from fastapi.testclient import TestClient

    # Import main after DB env set/reloaded
    import app.main as _main

    client = TestClient(_main.app)

    # Create DB tables in the test DB just in case
    try:
        # models.Base is accessible via app.models
        import app.models.models as models_module

        from app.database import engine

        models_module.Base.metadata.create_all(bind=engine)
    except Exception:
        # not fatal for simple endpoint tests
        pass

    yield client
