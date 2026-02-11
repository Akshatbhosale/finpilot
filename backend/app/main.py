from fastapi import FastAPI

app = FastAPI(title="FinPilot API")

@app.get("/")
def root():
    return {"message": "FinPilot backend running"}
