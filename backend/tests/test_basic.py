import os


def test_readme_present():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    readme = os.path.join(root, "README.md")
    assert os.path.isfile(readme), "Root README.md is missing"


def test_start_scripts_present():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    backend_script = os.path.join(root, "backend", "start_backend.sh")
    frontend_script = os.path.join(root, "frontend", "start_frontend.sh")
    assert os.path.isfile(backend_script), "backend/start_backend.sh is missing"
    assert os.path.isfile(frontend_script), "frontend/start_frontend.sh is missing"
