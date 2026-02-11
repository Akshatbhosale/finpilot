from fastapi import FastAPI
from app.core.database import engine, Base

app = FastAPI(title="FinPilot API")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "FinPilot backend running with DB"}
