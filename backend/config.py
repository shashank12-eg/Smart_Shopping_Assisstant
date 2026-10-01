import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(BASE_DIR, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

# MySQL Database Configuration
DB_HOST     = os.environ.get('DB_HOST',     'localhost')
DB_PORT     = int(os.environ.get('DB_PORT', 3306))
DB_USER     = os.environ.get('DB_USER',     'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'root')
DB_NAME     = os.environ.get('DB_NAME',     'smartshopping')

SECRET_KEY  = os.environ.get('SECRET_KEY',  'smartshopping-secret-key-cse-2026')

# External API & Retailer Data Providers Config
AMAZON_API_KEY        = os.environ.get('AMAZON_API_KEY', '')
FLIPKART_API_KEY      = os.environ.get('FLIPKART_API_KEY', '')
MEESHO_API_KEY        = os.environ.get('MEESHO_API_KEY', '')
MYNTRA_API_KEY        = os.environ.get('MYNTRA_API_KEY', '')
RAPIDAPI_SHOPPING_KEY = os.environ.get('RAPIDAPI_SHOPPING_KEY', '')
SERPAPI_KEY           = os.environ.get('SERPAPI_KEY', '')

# Optional AI Intelligence Model API Keys
GEMINI_API_KEY        = os.environ.get('GEMINI_API_KEY', '')
OPENAI_API_KEY        = os.environ.get('OPENAI_API_KEY', '')
