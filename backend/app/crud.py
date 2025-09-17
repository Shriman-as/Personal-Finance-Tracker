from sqlalchemy.orm import Session
from sqlalchemy import case, func
from . import models, schemas, utils
from datetime import datetime, timedelta

DUPLICATE_WINDOW_SECONDS = 120  # 2 minutes window for duplicate detection

def create_transaction(db: Session, t: schemas.TransactionCreate):
    # validation: rent cannot be income (example from requirements)
    if 'rent' in t.description.lower() and t.transaction_type == "income":
        raise ValueError("Rent cannot be income")

    # ensure sign: expenses stored negative, incomes positive
    amount = float(t.amount)
    if t.transaction_type == "expense" and amount > 0:
        amount = -amount
    if t.transaction_type == "income" and amount < 0:
        amount = abs(amount)

    # duplicate detection: same description & same amount within time window
    now = t.timestamp or datetime.utcnow()
    window_start = now - timedelta(seconds=DUPLICATE_WINDOW_SECONDS)
    dup = db.query(models.Transaction).filter(
        models.Transaction.description == t.description,
        models.Transaction.amount == amount,
        models.Transaction.timestamp >= window_start
    ).first()
    if dup:
        # treat as duplicate — return existing
        return dup, True

    category = utils.auto_categorize(t.description)
    db_obj = models.Transaction(
        description=t.description,
        amount=amount,
        transaction_type=t.transaction_type,
        category=category,
        auto_tagged=bool(category),
        timestamp=now
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj, False

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).order_by(models.Transaction.id.asc()).offset(skip).limit(limit).all()

def delete_transaction(db: Session, tx_id: int):
    obj = db.query(models.Transaction).filter(models.Transaction.id == tx_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def reclassify_transaction(db: Session, tx_id: int, new_category: str):
    obj = db.query(models.Transaction).filter(models.Transaction.id == tx_id).first()
    if not obj:
        return None
    obj.category = new_category
    obj.auto_tagged = False
    db.commit()
    db.refresh(obj)
    return obj

def summary_monthly_by_category(db):
    """
    Return monthly income/expense summary grouped by category.
    Works safely even with NULL categories and no transactions.
    """
    income_case = case((models.Transaction.transaction_type == "income", models.Transaction.amount), else_=0)
    expense_case = case((models.Transaction.transaction_type == "expense", models.Transaction.amount), else_=0)
    q = (
        db.query(
            func.strftime('%Y-%m', models.Transaction.timestamp).label('month'),
            models.Transaction.category,
            func.sum(income_case).label('income_sum'),
            func.sum(expense_case).label('expense_sum')
        )
        .group_by('month', models.Transaction.category)
        .order_by('month')
    )
    rows = q.all()
    results = []
    for r in rows:
        income = float(r.income_sum or 0)
        expense = abs(float(r.expense_sum or 0))  # convert negative to positive
        results.append({
            "month": r.month,
            "category": r.category or "Uncategorized",
            "income": income,
            "expense": expense
        })
    return results
 