import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_DIR = os.path.join(os.path.dirname(BASE_DIR), 'database')
DATABASE_PATH = os.path.join(DATABASE_DIR, 'smartshopping.db')

SECRET_KEY = os.environ.get('SECRET_KEY', 'smartshopping-secret-key-cse-2026')

os.makedirs(DATABASE_DIR, exist_ok=True)
