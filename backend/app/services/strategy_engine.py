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
