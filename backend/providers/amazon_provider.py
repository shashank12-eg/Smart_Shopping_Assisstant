import requests
from providers.base_provider import BaseProductProvider

class AmazonProvider(BaseProductProvider):
    def __init__(self, api_key: str = ""):
        super().__init__("Amazon", api_key)

    def fetch_product_data(self, query: str, category: str = None) -> dict:
        if not self.api_key:
            return {
                "status": "unavailable",
                "provider": self.name,
                "message": "Data unavailable: Amazon API credentials not configured in environment.",
                "items": []
            }
        
        try:
            # Official / Permitted API request (e.g. Amazon Product Advertising API or RapidAPI integration)
            headers = {
                "X-RapidAPI-Key": self.api_key,
                "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
            }
            response = requests.get(
                "https://real-time-amazon-data.p.rapidapi.com/search",
                headers=headers,
                params={"query": query, "country": "IN"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                raw_items = data.get("data", {}).get("products", [])
                items = []
                for p in raw_items:
                    price_str = str(p.get("product_price", "0")).replace("₹", "").replace(",", "")
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 0.0
                    
                    if price > 0:
                        items.append({
                            "name": p.get("product_title", ""),
                            "brand": p.get("brand", ""),
                            "model": "",
                            "category": category or "General",
                            "current_price": price,
                            "previous_price": price,
                            "rating": float(p.get("product_star_rating", 4.0) or 4.0),
                            "review_count": int(p.get("product_num_ratings", 0) or 0),
                            "image": p.get("product_photo", ""),
                            "product_url": p.get("product_url", ""),
                            "specifications": {},
                            "availability": "In Stock" if p.get("is_prime", False) else "Available"
                        })
                return {
                    "status": "success",
                    "provider": self.name,
                    "message": f"Successfully fetched {len(items)} items from Amazon.",
                    "items": items
                }
            else:
                return {
                    "status": "unavailable",
                    "provider": self.name,
                    "message": f"Data unavailable: Amazon API responded with status {response.status_code}",
                    "items": []
                }
        except Exception as e:
            return {
                "status": "error",
                "provider": self.name,
                "message": f"Data unavailable: {str(e)}",
                "items": []
            }
