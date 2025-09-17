from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    description: str
    amount: float
    transaction_type: str
    timestamp: Optional[datetime] = None

    @validator("transaction_type")
    def check_type(cls, v):
        if v not in ("income", "expense"):
            raise ValueError("transaction_type must be 'income' or 'expense'")
        return v

class TransactionOut(BaseModel):
    id: int
    description: str
    amount: float
    transaction_type: str
    category: Optional[str]
    auto_tagged: bool
    timestamp: datetime

    class Config:
        orm_mode = True

class ReclassifyRequest(BaseModel):
    category: str