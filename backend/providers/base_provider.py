from abc import ABC, abstractmethod

class BaseProductProvider(ABC):
    """
    Abstract Base Class for Retailer / Shopping Intelligence Data Providers.
    All retailer integrations (Amazon, Flipkart, Meesho, Myntra) implement this interface.
    """

    def __init__(self, name: str, api_key: str = ""):
        self.name = name
        self.api_key = api_key

    @abstractmethod
    def fetch_product_data(self, query: str, category: str = None) -> dict:
        """
        Fetch real product data and prices from provider API or feed.
        Must return dict format:
        {
            "status": "success" | "unavailable" | "error",
            "provider": self.name,
            "message": str,
            "items": [
                {
                    "name": str,
                    "brand": str,
                    "model": str,
                    "category": str,
                    "current_price": float,
                    "previous_price": float,
                    "rating": float,
                    "review_count": int,
                    "image": str,
                    "product_url": str,
                    "specifications": dict,
                    "availability": str
                }
            ]
        }
        """
        pass
