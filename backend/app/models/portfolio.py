from sqlalchemy import Column, Integer, Float, ForeignKey
from app.core.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)

    large_cap = Column(Float, default=0)
    mid_cap = Column(Float, default=0)
    small_cap = Column(Float, default=0)
    gold = Column(Float, default=0)
    debt = Column(Float, default=0)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
