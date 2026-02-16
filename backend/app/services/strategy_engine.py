class StrategyEngine:

    @staticmethod
    def calculate_expected_return(allocation):
        """
        allocation example:
        {
            "large_cap": 40,
            "mid_cap": 20,
            "small_cap": 10,
            "gold": 15,
            "debt": 15
        }
        """

        # average annual returns (approx realistic values)
        returns = {
            "large_cap": 0.08,
            "mid_cap": 0.11,
            "small_cap": 0.14,
            "gold": 0.07,
            "debt": 0.06,
        }

        total_return = 0

        for asset, percent in allocation.items():
            total_return += (percent / 100) * returns[asset]

        return total_return

    @staticmethod
    def future_value(monthly_investment, years, expected_return):
        months = years * 12
        r = expected_return / 12

        fv = 0
        for _ in range(months):
            fv = (fv + monthly_investment) * (1 + r)

        return round(fv, 2)

    @staticmethod
    def calculate_risk_score(allocation):
        risk_values = {
            "large_cap": 2,
            "mid_cap": 3,
            "small_cap": 5,
            "gold": 3,
            "debt": 1,
        }

        risk_score = 0

        for asset, percent in allocation.items():
            risk_score += (percent / 100) * risk_values[asset]

        return round(risk_score, 2)
        
    @staticmethod
    def get_predefined_strategies():
        return {
            "aggressive": {
                "large_cap": 20,
                "mid_cap": 30,
                "small_cap": 40,
                "gold": 5,
                "debt": 5,
            },
            "balanced": {
                "large_cap": 40,
                "mid_cap": 20,
                "small_cap": 10,
                "gold": 15,
                "debt": 15,
            },
            "conservative": {
                "large_cap": 30,
                "mid_cap": 10,
                "small_cap": 5,
                "gold": 20,
                "debt": 35,
            },
        }

    @staticmethod
    def simulate_rebalancing_with_history(monthly_investment, years, allocation):
        returns = {
            "large_cap": 0.08,
            "mid_cap": 0.11,
            "small_cap": 0.14,
            "gold": 0.07,
            "debt": 0.06,
        }

        portfolio = {k: 0 for k in allocation.keys()}
        history = []

        months = years * 12

        for month in range(1, months + 1):
            # invest monthly
            for asset, percent in allocation.items():
                portfolio[asset] += monthly_investment * (percent / 100)

            # monthly growth
            for asset in portfolio:
                r = returns[asset] / 12
                portfolio[asset] *= (1 + r)

            # yearly checkpoint
            if month % 12 == 0:
                total = sum(portfolio.values())
                year = month // 12

                history.append({
                    "year": year,
                    "value": round(total, 2)
                })

                # rebalance
                for asset, percent in allocation.items():
                    portfolio[asset] = total * (percent / 100)

        return history

    @staticmethod
    def simulate_without_rebalance_with_history(monthly_investment, years, allocation):
        returns = {
            "large_cap": 0.08,
            "mid_cap": 0.11,
            "small_cap": 0.14,
            "gold": 0.07,
            "debt": 0.06,
        }

        portfolio = {k: 0 for k in allocation.keys()}
        history = []

        months = years * 12

        for month in range(1, months + 1):
            for asset, percent in allocation.items():
                portfolio[asset] += monthly_investment * (percent / 100)

            for asset in portfolio:
                r = returns[asset] / 12
                portfolio[asset] *= (1 + r)

            if month % 12 == 0:
                total = sum(portfolio.values())
                year = month // 12

                history.append({
                    "year": year,
                    "value": round(total, 2)
                })

        return history

    @staticmethod
    def generate_insights(allocation, expected_return, risk_score):
        insights = []

        if risk_score > 7:
            insights.append("Your portfolio risk is high.")

        if allocation["small_cap"] > 40:
            insights.append("You are heavily invested in small cap stocks.")

        if allocation["debt"] < 10:
            insights.append("Consider adding debt for stability.")

        if expected_return < 0.09:
            insights.append("Returns are moderate. You could increase equity.")

        if not insights:
            insights.append("Your portfolio looks well balanced.")

        return insights

    @staticmethod
    def required_monthly_investment(goal_amount, years, expected_return):
        months = years * 12
        r = expected_return / 12

        if r == 0:
            return goal_amount / months

        sip = goal_amount * r / ((1 + r) ** months - 1)
        return round(sip, 2)




