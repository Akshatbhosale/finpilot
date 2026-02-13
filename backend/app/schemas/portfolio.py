from pydantic import BaseModel

class PortfolioCreate(BaseModel):
    large_cap: float
    mid_cap: float
    small_cap: float
    gold: float
    debt: float
