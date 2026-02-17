from app.services.llm_service import LLMService

class AIAdvisor:

    @staticmethod
    def generate_advice(allocation, expected_return, risk_score):
        rule_based = []

        if risk_score > 7:
            rule_based.append("Your portfolio risk is high.")

        if allocation["small_cap"] > 40:
            rule_based.append("High exposure to small cap stocks.")

        if allocation["debt"] < 10:
            rule_based.append("Consider adding debt for stability.")

        if not rule_based:
            rule_based.append("Your portfolio looks balanced.")

        # -------- LLM prompt --------
        prompt = f"""
You are a financial advisor.

Portfolio allocation: {allocation}
Expected return: {expected_return}
Risk score: {risk_score}

Give short 2-line investment advice.
"""

        ai_text = LLMService.get_advice(prompt)

        return {
            "rule_based": rule_based,
            "ai_advice": ai_text
        }
