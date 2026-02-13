from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/")
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_expense = Expense(
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        user_id=current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense

@router.get("/")
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.created_at.desc())
        .all()
    )

    return expenses

@router.get("/summary/monthly")
def monthly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_month = datetime.now().month
    current_year = datetime.now().year

    total = (
        db.query(func.sum(Expense.amount))
        .filter(
            Expense.user_id == current_user.id,
            func.extract("month", Expense.created_at) == current_month,
            func.extract("year", Expense.created_at) == current_year
        )
        .scalar()
    )

    return {"monthly_total": total or 0}

@router.get("/summary/category")
def category_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == current_user.id)
        .group_by(Expense.category)
        .all()
    )

    return [{"category": r[0], "total": r[1]} for r in results]
