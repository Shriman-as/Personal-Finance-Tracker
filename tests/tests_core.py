import sys, os
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app
from backend.app.database import Base, engine, SessionLocal
from backend.app import models

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create and drop tables once per test session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    """Provide a fresh session per test, rollback afterwards."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

def create_transaction_in_db(db, description="Test Transaction", amount=-10, ttype="expense"):
    obj = models.Transaction(
        description=description,
        amount=amount,
        transaction_type=ttype,
        category="Testing",
        auto_tagged=False,
        timestamp=datetime.utcnow()
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# POST /transactions/
def test_add_transaction_success():
    payload = {
        "description": "Groceries",
        "amount": 50,
        "transaction_type": "expense"
    }
    response = client.post("/transactions/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Groceries"
    assert data["amount"] == -50.0 
    assert data["transaction_type"] == "expense"
    assert "id" in data

def test_add_transaction_validation_error():
    payload = {"description": "Rent for apartment", "amount": 1000, "transaction_type": "income"}
    r = client.post("/transactions/", json=payload)
    assert r.status_code == 400
    assert "Rent cannot be income" in r.json()["detail"]

def test_add_transaction_duplicate(db):
    tx = create_transaction_in_db(db, description="Uber Ride", amount=-20)
    payload = {
        "description": "Uber Ride",
        "amount": 20,
        "transaction_type": "expense",
        "timestamp": (datetime.utcnow() + timedelta(seconds=1)).isoformat()
    }
    r = client.post("/transactions/", json=payload)
    assert r.status_code == 409
    assert f"Duplicate transaction (id={tx.id})" in r.json()["detail"]

# GET /transactions/
def test_list_transactions(db):
    create_transaction_in_db(db, description="Flipkart", amount=-200)
    r = client.get("/transactions/")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any("Flipkart" in d["description"] for d in data)

# PATCH /transactions/{id}/reclassify
def test_reclassify_transaction_success(db):
    tx = create_transaction_in_db(db, description="Amazon", amount=-100)
    r = client.patch(f"/transactions/{tx.id}/reclassify", json={"category": "Shopping"})
    assert r.status_code == 200
    assert r.json()["category"] == "Shopping"

def test_reclassify_transaction_not_found():
    r = client.patch("/transactions/9999/reclassify", json={"category": "Unknown"})
    assert r.status_code == 404
    assert r.json()["detail"] == "Transaction not found"

# DELETE /transactions/{id}
def test_delete_transaction_success(db):
    tx = create_transaction_in_db(db)
    r = client.delete(f"/transactions/{tx.id}")
    assert r.status_code == 200
    assert r.json() == {"status": "deleted"}

def test_delete_transaction_not_found():
    r = client.delete("/transactions/9999")
    assert r.status_code == 404
    assert r.json()["detail"] == "Transaction not found"

# GET /transactions/summary
def test_get_summary(db):
    create_transaction_in_db(db, description="Salary", amount=5000, ttype="income")
    create_transaction_in_db(db, description="Netflix", amount=-500, ttype="expense")
    r = client.get("/transactions/summary")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    months = [item["month"] for item in data]
    assert all(len(m) == 7 for m in months)
    categories = [item["category"] for item in data]
    assert any(c in categories for c in ["Salary", "Entertainment", "Testing"])
