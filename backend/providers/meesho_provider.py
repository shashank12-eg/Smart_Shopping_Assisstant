import requests
from providers.base_provider import BaseProductProvider

class MeeshoProvider(BaseProductProvider):
    def __init__(self, api_key: str = ""):
        super().__init__("Meesho", api_key)

    def fetch_product_data(self, query: str, category: str = None) -> dict:
        if not self.api_key:
            return {
                "status": "unavailable",
                "provider": self.name,
                "message": "Data unavailable: Meesho API credentials not configured in environment.",
                "items": []
            }
        try:
            # Official Meesho product feed integration
            response = requests.get(
                "https://api.meesho.com/v1/products/search",
                headers={"Authorization": f"Bearer {self.api_key}"},
                params={"q": query},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "success",
                    "provider": self.name,
                    "message": "Fetched data from Meesho.",
                    "items": data.get("products", [])
                }
            return {
                "status": "unavailable",
                "provider": self.name,
                "message": f"Data unavailable: Meesho API status {response.status_code}",
                "items": []
            }
        except Exception as e:
            return {
                "status": "error",
                "provider": self.name,
                "message": f"Data unavailable: {str(e)}",
                "items": []
            }
