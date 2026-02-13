from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.portfolio import Portfolio
from app.services.strategy_engine import StrategyEngine

router = APIRouter(prefix="/strategy", tags=["Strategy"])


@router.get("/simulate")
def simulate_strategy(
    monthly_investment: float,
    years: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()

    if not portfolio:
        return {"error": "Portfolio not set"}

    allocation = {
        "large_cap": portfolio.large_cap,
        "mid_cap": portfolio.mid_cap,
        "small_cap": portfolio.small_cap,
        "gold": portfolio.gold,
        "debt": portfolio.debt,
    }

    expected_return = StrategyEngine.calculate_expected_return(allocation)

    future_value = StrategyEngine.future_value(
        monthly_investment,
        years,
        expected_return
    )

    risk_score = StrategyEngine.calculate_risk_score(allocation)

    return {
        "expected_return_percent": round(expected_return * 100, 2),
        "future_value": future_value,
        "risk_score":risk_score
    }

@router.get("/compare")
def compare_strategies(
    monthly_investment: float,
    years: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()

    if not portfolio:
        return {"error": "Portfolio not set"}

    user_allocation = {
        "large_cap": portfolio.large_cap,
        "mid_cap": portfolio.mid_cap,
        "small_cap": portfolio.small_cap,
        "gold": portfolio.gold,
        "debt": portfolio.debt,
    }

    strategies = StrategyEngine.get_predefined_strategies()

    results = {}

    # user strategy
    expected_return = StrategyEngine.calculate_expected_return(user_allocation)
    future_value = StrategyEngine.future_value(monthly_investment, years, expected_return)
    risk = StrategyEngine.calculate_risk_score(user_allocation)

    results["your_strategy"] = {
        "expected_return": round(expected_return * 100, 2),
        "future_value": future_value,
        "risk_score": risk,
    }

    # predefined strategies
    for name, alloc in strategies.items():
        er = StrategyEngine.calculate_expected_return(alloc)
        fv = StrategyEngine.future_value(monthly_investment, years, er)
        rs = StrategyEngine.calculate_risk_score(alloc)

        results[name] = {
            "expected_return": round(er * 100, 2),
            "future_value": fv,
            "risk_score": rs,
        }

    return results
