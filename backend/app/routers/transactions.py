from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import SessionLocal
from .. import schemas, crud

router = APIRouter(prefix="/transactions", tags=["transactions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TransactionOut)
def add_transaction(payload: schemas.TransactionCreate, db: Session = Depends(get_db)):
    try:
        obj, duplicate = crud.create_transaction(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if duplicate:
        # duplicates return 409 with existing transaction
        raise HTTPException(status_code=409, detail=f"Duplicate transaction (id={obj.id})")
    return obj

@router.get("/", response_model=List[schemas.TransactionOut])
def list_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_transactions(db, skip=skip, limit=limit)

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_transaction(db, transaction_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"status": "deleted"}

@router.patch("/{transaction_id}/reclassify", response_model=schemas.TransactionOut)
def reclassify(transaction_id: int, req: schemas.ReclassifyRequest, db: Session = Depends(get_db)):
    obj = crud.reclassify_transaction(db, transaction_id, req.category)
    if not obj:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return obj

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    return crud.summary_monthly_by_category(db)
