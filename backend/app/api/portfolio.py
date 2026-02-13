from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.portfolio import PortfolioCreate

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.post("/")
def save_portfolio(
    data: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()

    if existing:
        existing.large_cap = data.large_cap
        existing.mid_cap = data.mid_cap
        existing.small_cap = data.small_cap
        existing.gold = data.gold
        existing.debt = data.debt
        db.commit()
        return existing

    new_portfolio = Portfolio(
        large_cap=data.large_cap,
        mid_cap=data.mid_cap,
        small_cap=data.small_cap,
        gold=data.gold,
        debt=data.debt,
        user_id=current_user.id
    )

    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)

    return new_portfolio


@router.get("/")
def get_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    return portfolio
