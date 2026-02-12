from fastapi import FastAPI
from app.core.database import engine, Base
from app.models.user import User
from app.api.auth import router as auth_router
from app.api.user import router as user_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="FinPilot API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created")

app.include_router(auth_router)
app.include_router(user_router)

@app.get("/")
def root():
    return {"message": "FinPilot backend running"}
