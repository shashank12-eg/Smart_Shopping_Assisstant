from providers.amazon_provider import AmazonProvider
from providers.flipkart_provider import FlipkartProvider
from providers.meesho_provider import MeeshoProvider
from providers.myntra_provider import MyntraProvider
import config

class ProductProviderManager:
    """
    Central Manager to query available product providers.
    Supports official APIs, product feeds, licensed data integrations.
    Never fabricates fake data — returns 'Data unavailable' if provider credentials/feeds are missing.
    """
    def __init__(self):
        self.providers = {
            "Amazon": AmazonProvider(api_key=config.AMAZON_API_KEY or config.RAPIDAPI_SHOPPING_KEY),
            "Flipkart": FlipkartProvider(api_key=config.FLIPKART_API_KEY),
            "Meesho": MeeshoProvider(api_key=config.MEESHO_API_KEY),
            "Myntra": MyntraProvider(api_key=config.MYNTRA_API_KEY)
        }

    def fetch_from_all(self, query: str, category: str = None) -> dict:
        results = {}
        for name, provider in self.providers.items():
            results[name] = provider.fetch_product_data(query, category)
        return results

    def get_provider_status(self) -> dict:
        status = {}
        for name, provider in self.providers.items():
            status[name] = {
                "name": name,
                "configured": bool(provider.api_key),
                "status": "Ready" if provider.api_key else "Data unavailable (API key not configured)"
            }
        return status

provider_manager = ProductProviderManager()
