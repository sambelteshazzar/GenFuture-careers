def test_read_root(client):
    r = client.get("/")
    assert r.status_code == 200
    payload = r.json()
    assert payload.get("message") == "Welcome to GenFuture Careers API"


def test_healthz(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    payload = r.json()
    assert payload.get("status") == "ok"


def test_readyz(client):
    r = client.get("/readyz")
    assert r.status_code == 200
    payload = r.json()
    assert "status" in payload
    assert "database" in payload
