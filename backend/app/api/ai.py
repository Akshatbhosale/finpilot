from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.portfolio import Portfolio
from app.models.user import User
from app.core.security import get_current_user
from app.services.strategy_engine import StrategyEngine
from app.services.ai_advisor import AIAdvisor

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/advice")
def get_advice(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).first()

    allocation = {
        "large_cap": portfolio.large_cap,
        "mid_cap": portfolio.mid_cap,
        "small_cap": portfolio.small_cap,
        "gold": portfolio.gold,
        "debt": portfolio.debt,
    }

    expected_return = StrategyEngine.calculate_expected_return(allocation)
    risk_score = StrategyEngine.calculate_risk_score(allocation)

    advice = AIAdvisor.generate_advice(
        allocation,
        expected_return,
        risk_score
    )

    return {"advice": advice}
