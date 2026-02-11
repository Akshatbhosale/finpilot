from fastapi import FastAPI
from app.core.database import engine, Base
from app.models.user import User
from app.api.auth import router as auth_router

app = FastAPI(title="FinPilot API")

app.include_router(auth_router)
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "FinPilot backend running with DB"}
