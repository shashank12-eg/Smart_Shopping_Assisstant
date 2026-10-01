import requests
from providers.base_provider import BaseProductProvider

class FlipkartProvider(BaseProductProvider):
    def __init__(self, api_key: str = ""):
        super().__init__("Flipkart", api_key)

    def fetch_product_data(self, query: str, category: str = None) -> dict:
        if not self.api_key:
            return {
                "status": "unavailable",
                "provider": self.name,
                "message": "Data unavailable: Flipkart API credentials not configured in environment.",
                "items": []
            }
        try:
            headers = {"Fk-Affiliate-Id": self.api_key}
            response = requests.get(
                "https://affiliate-api.flipkart.net/affiliate/1.0/search.json",
                headers=headers,
                params={"query": query, "resultCount": 10},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                raw_products = data.get("products", [])
                items = []
                for p in raw_products:
                    base_info = p.get("productBaseInfoV1", {})
                    price_info = base_info.get("flipkartSellingPrice", {})
                    items.append({
                        "name": base_info.get("title", ""),
                        "brand": base_info.get("productBrand", ""),
                        "model": "",
                        "category": category or "General",
                        "current_price": float(price_info.get("amount", 0.0)),
                        "previous_price": float(base_info.get("flipkartMrp", {}).get("amount", 0.0)),
                        "rating": float(base_info.get("productRating", 4.0) or 4.0),
                        "review_count": 0,
                        "image": list(base_info.get("imageUrls", {}).values())[0] if base_info.get("imageUrls") else "",
                        "product_url": base_info.get("productUrl", ""),
                        "specifications": {},
                        "availability": "In Stock" if base_info.get("inStock") else "Out of Stock"
                    })
                return {
                    "status": "success",
                    "provider": self.name,
                    "message": f"Successfully fetched {len(items)} items from Flipkart.",
                    "items": items
                }
            else:
                return {
                    "status": "unavailable",
                    "provider": self.name,
                    "message": f"Data unavailable: Flipkart API status {response.status_code}",
                    "items": []
                }
        except Exception as e:
            return {
                "status": "error",
                "provider": self.name,
                "message": f"Data unavailable: {str(e)}",
                "items": []
            }
