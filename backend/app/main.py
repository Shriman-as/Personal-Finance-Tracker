from fastapi import FastAPI
from .database import Base, engine
from .routers import transactions
from fastapi.middleware.cors import CORSMiddleware
# create tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Finance Tracker", version="1.0.0")
origins = [
   "http://localhost:3001",
   "http://127.0.0.1:3000"
]
app.add_middleware(
   CORSMiddleware,
   allow_origins=origins,        
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)
app.include_router(transactions.router)
