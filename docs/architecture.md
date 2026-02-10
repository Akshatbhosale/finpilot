System Architecture
FinPilot
1. Architecture Style

The system follows a modular monolith architecture.

All backend modules exist in one FastAPI application but are separated into logical components.

This approach:

reduces complexity

speeds development

is ideal for solo projects

can scale later

2. High-Level Flow
React Frontend
      ↓
FastAPI Backend
      ↓
PostgreSQL Database
      ↓
External Market APIs


Frontend communicates with backend via REST APIs.

Backend handles:

authentication

financial calculations

data storage

strategy simulation

3. Backend Modules

Auth Module

login

register

JWT handling

Expense Module

add expense

category analytics

Portfolio Module

add assets

track value

Strategy Module

define rules

run backtests

Market Data Module

fetch stock data

provide historical prices

Each module will have:

routes

services

models

4. Deployment Architecture (Final Phase)
AWS EC2
 ├── Docker
 │   ├── frontend container
 │   ├── backend container
 │   └── postgres container
 └── Nginx reverse proxy


CI/CD:
GitHub Actions → deploy to EC2.

5. Security Overview

JWT authentication

hashed passwords

input validation

environment variables

HTTPS

