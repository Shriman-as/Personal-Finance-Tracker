from sqlalchemy import Column, Integer, String, Float, Boolean, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from .database import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable=False)
    category = Column(String, nullable=True)
    auto_tagged = Column(Boolean, nullable=False, default=True)
    timestamp = Column(TIMESTAMP, nullable=False, server_default=func.datetime('now'))
    __table_args__ = (CheckConstraint("transaction_type IN ('income','expense')", name="chk_type"),)
