import requests
from providers.base_provider import BaseProductProvider

class MyntraProvider(BaseProductProvider):
    def __init__(self, api_key: str = ""):
        super().__init__("Myntra", api_key)

    def fetch_product_data(self, query: str, category: str = None) -> dict:
        if not self.api_key:
            return {
                "status": "unavailable",
                "provider": self.name,
                "message": "Data unavailable: Myntra API credentials not configured in environment.",
                "items": []
            }
        try:
            response = requests.get(
                "https://api.myntra.com/v1/search",
                headers={"Authorization": f"Bearer {self.api_key}"},
                params={"query": query},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "success",
                    "provider": self.name,
                    "message": "Fetched data from Myntra.",
                    "items": data.get("items", [])
                }
            return {
                "status": "unavailable",
                "provider": self.name,
                "message": f"Data unavailable: Myntra API status {response.status_code}",
                "items": []
            }
        except Exception as e:
            return {
                "status": "error",
                "provider": self.name,
                "message": f"Data unavailable: {str(e)}",
                "items": []
            }
