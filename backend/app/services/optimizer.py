from app.services.strategy_engine import StrategyEngine
import copy

class PortfolioOptimizer:

    @staticmethod
    def optimize(allocation):
        best_allocation = allocation
        best_score = StrategyEngine.calculate_expected_return(allocation) - (
            0.5 * StrategyEngine.calculate_risk_score(allocation)
        )

        # Try shifting 5% between assets
        keys = list(allocation.keys())

        for i in keys:
            for j in keys:
                if i == j:
                    continue

                new_alloc = copy.deepcopy(allocation)

                if new_alloc[i] >= 5:
                    new_alloc[i] -= 5
                    new_alloc[j] += 5

                    score = StrategyEngine.calculate_expected_return(new_alloc) - (
                        0.5 * StrategyEngine.calculate_risk_score(new_alloc)
                    )

                    if score > best_score:
                        best_score = score
                        best_allocation = new_alloc

        return best_allocation
