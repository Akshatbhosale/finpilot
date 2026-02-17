import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

class LLMService:

    @staticmethod
    def get_advice(prompt: str):
        try:
            res = requests.post(
                OLLAMA_URL,
                json={
                    "model": "llama2",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=60
            )

            data = res.json()
            return data.get("response", "").strip()

        except Exception as e:
            return "AI service unavailable."
