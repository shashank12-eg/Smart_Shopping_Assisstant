import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(BASE_DIR, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

# MySQL Database Configuration

# MySQL Database Configuration
_is_railway = bool(
    os.environ.get("RAILWAY_ENVIRONMENT_NAME")
    or os.environ.get("RAILWAY_ENVIRONMENT")
)

DB_HOST = (os.getenv("DB_HOST") or "").strip()

# If DB_HOST is missing or incorrectly set to localhost,
# try Railway's MySQL-provided hostname.
if not DB_HOST or DB_HOST.lower() in ("localhost", "127.0.0.1"):
    DB_HOST = (os.getenv("MYSQLHOST") or "").strip()

if not DB_HOST:
    if _is_railway:
        raise RuntimeError(
            "Database host is missing. Set DB_HOST to your Railway MySQL hostname."
        )
    DB_HOST = "localhost"

DB_PORT = int(
    os.getenv("DB_PORT") or os.getenv("MYSQLPORT") or "3306"
)
DB_USER = os.getenv("DB_USER") or os.getenv("MYSQLUSER") or "root"
DB_PASSWORD = (
    os.getenv("DB_PASSWORD")
    if os.getenv("DB_PASSWORD") is not None
    else os.getenv("MYSQLPASSWORD", "root")
)
DB_NAME = (
    os.getenv("DB_NAME")
    or os.getenv("MYSQLDATABASE")
    or "smartshopping"
)


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
