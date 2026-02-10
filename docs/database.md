Database Design
Users

id

email

password

created_at

Expenses

id

user_id

amount

category

date

Portfolio

id

user_id

symbol

quantity

average_price

Strategies

id

user_id

name

rules_json

Backtest Results

id

strategy_id

roi

drawdown

created_at

Relationships

User → Expenses
User → Portfolio
User → Strategies
Strategy → Results