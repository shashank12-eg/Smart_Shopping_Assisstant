# SmartShopping — Intelligent Product Price & Purchase Decision Assistant

SmartShopping is a full-stack real-data shopping intelligence platform designed for Indian e-commerce. It helps consumers decide whether to **BUY NOW** or **WAIT** based on multi-period historical price observations (in **₹ INR**), multi-retailer live comparisons (Amazon, Flipkart, Reliance Digital, Croma, Meesho, Myntra), 5-year maintenance cost projections, resale depreciation estimates, interactive hardware spec guides, and personalized tools (Wishlist, Search History, Price Target Alerts, Comparison Engine).

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3, Flask REST API, Flask-CORS, PyJWT, Werkzeug (Password Hashing)
- **Database**: MySQL 8 (`smartshopping` database via `mysql-connector-python`)
- **Data Providers Architecture**: Modular provider system for Amazon, Flipkart, Meesho, Myntra, with graceful fallback to "Data unavailable" when feeds are unconfigured or offline.

---

## Project Structure

```
Smart_Shopping_Assisstant/
├── frontend/             # React 18 + Vite + Tailwind CSS UI
│   ├── src/
│   │   ├── components/   # ProductCard, PriceGraph, SellerComparisonTable, SearchBar, etc.
│   │   ├── pages/        # Auth (Login/Signup), Home, Browse, ProductDetail, Compare, Profile, Wishlist
│   │   ├── layouts/      # Navbar & Footer
│   │   ├── services/     # API integration (JWT token handling)
│   │   ├── context/      # AuthContext
│   │   ├── utils/        # Formatters, compareStorage
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/              # Python Flask REST API
│   ├── providers/        # Modular Provider System (Amazon, Flipkart, Meesho, Myntra)
│   │   ├── base_provider.py
│   │   ├── amazon_provider.py
│   │   ├── flipkart_provider.py
│   │   ├── meesho_provider.py
│   │   ├── myntra_provider.py
│   │   └── provider_manager.py
│   ├── app.py            # Main application entry point & API endpoints
│   ├── config.py         # Configs & MySQL parameters loaded from .env
│   ├── database.py       # Safe schema initialization and migration
│   ├── seed_data.py      # Canonical product database seeder
│   ├── category_normalizer.py # Standardized category mapping
│   ├── test_integration.py    # Automated test suite
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
└── README.md
```

---

## Installation & Setup

### 1. MySQL Database Setup

Ensure MySQL Server is running locally.

Configure `.env` in `backend/`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=smartshopping
SECRET_KEY=smartshopping-secret-key-cse-2026

# Optional: Add provider API keys if available
AMAZON_API_KEY=
FLIPKART_API_KEY=
MEESHO_API_KEY=
MYNTRA_API_KEY=
RAPIDAPI_SHOPPING_KEY=
SERPAPI_KEY=

# Optional: AI Model Keys
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python database.py        # Initializes & migrates MySQL database tables
python seed_data.py       # Seeds canonical products & sellers
python test_integration.py # Runs integration test suite
python app.py             # Starts Flask server on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run build             # Verifies production build
npm run dev               # Starts Vite dev server on http://localhost:3000
```

---

## Key Features

1. **Authentication**: User signup, login, JWT token persistence, protected routes, and logout. Supports any standard valid email address with secure password hashing.
2. **Category Normalization**: Automatically maps variations (e.g. `mobile`, `smartphone`, `phone` -> `Mobiles`; `notebook`, `macbook` -> `Laptops`; `earbuds`, `headset` -> `Headphones`).
3. **Product URL Analyzer (SSRF-Protected)**:
   - Paste product links directly from Amazon India (`amazon.in`), Flipkart (`flipkart.com`), Meesho, Myntra, Croma, or Reliance Digital.
   - Server-side domain whitelist & SSRF protection against private IP probing.
   - Automatically resolves product title, brand, category, image, and initial price history baseline.
   - Runs the complete 9-stage SmartShopping AI Intelligence Engine for instant BUY/WAIT recommendation, price forecasting, resale projections, and ownership costs.
4. **Live Working Retailer Links**:
   - Clicking **"Buy on Amazon"** opens Amazon's live search endpoint (`https://www.amazon.in/s?k=...`) with no 404/broken page errors.
   - Similarly, Flipkart, Croma, Reliance Digital, Meesho, and Myntra buttons open active live shopping searches.
5. **Smooth Page Navigation**:
   - Integrated `ScrollToTop` router component ensures navigating from HomePage or shortcuts to `/analyze-url` starts cleanly at the top of the viewport.
6. **Multi-Retailer Price Intelligence**: Compares Amazon, Flipkart, Reliance Digital, Croma, Meesho, and Myntra. If a feed is unconfigured, displays "Data unavailable" instead of fabricated figures.
7. **Multi-Period Price Analytics**: Tracks timestamped observations across 7-day, 30-day, 3-month, 6-month, and 12-month intervals with Recharts.
8. **Purchase Decision Engine**: Computes historical deviation to recommend **BUY NOW**, **WAIT ~10 DAYS**, **WAIT ~20 DAYS**, **WAIT ~1 MONTH**, or **MONITOR**.
9. **Search & Debounced Autocomplete**: Real-time product search by name, brand, model, category, and specs.
10. **Side-by-Side Comparison Engine**: Category-enforced comparison (Mobile vs Mobile, Laptop vs Laptop, etc.) with transparent 60/40 scoring methodology and price intelligence metrics.
11. **Complete User Suite**: Wishlist, Price Drop Alerts with threshold percentages, Search History, and 5-Year Maintenance / Resale depreciation models.
