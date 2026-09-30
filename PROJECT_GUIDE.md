# SmartShopping — Complete Project & Architecture Guide

Welcome to the comprehensive technical documentation for **SmartShopping — Intelligent Product Price & Purchase Decision Assistant**.

---

## 1. Project Overview

SmartShopping is a full-stack shopping decision intelligence platform built for consumers in India.

### Problem Solved
E-commerce shoppers in India face dynamic pricing across major retailers (Amazon, Flipkart, Reliance Digital, Croma). They struggle to determine:
- Is today's price actually cheap or artificially inflated?
- Which seller offers the true lowest price?
- What are the hidden 5-year maintenance and total ownership costs?
- How fast does the product depreciate over 5 years?

SmartShopping solves this by providing:
1. **Gmail-Only Authentication**: Enforces strict `@gmail.com` validation across frontend and Flask backend.
2. **12-Month Historical Price Analytics** in Indian Rupees (**₹**).
3. **BUY NOW vs. WAIT Recommendation Engine** based on percentage deviation from historical averages.
4. **Multi-Retailer Price Comparison** with instant lowest-price detection.
5. **Category-Aware Product Comparison**: Live search bar & category filtering prioritizing products from the same category bucket (e.g. comparing Mobiles with Mobiles).
6. **Clickable Specification Guides** for non-technical users.
7. **5-Year Maintenance Cost Estimator** & **Total Ownership Cost** math.
8. **5-Year Resale Depreciation Projection**.
9. **User-Specific Utilities**: Wishlist, Search History tracking, Price Target Alerts, and Side-by-Side Product Comparison (2-4 limit).

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BROWSER / CLIENT                                 │
│                                                                             │
│  React 18 + Vite SPA (Port 3000)                                           │
│  ├── Tailwind CSS (Dark Glassmorphism Theme)                                │
│  ├── Recharts (12-Month Price Trend Graphs)                                 │
│  ├── React Router v6 (Client-Side Navigation & Route Guards)               │
│  └── AuthContext (JWT Storage & User State)                                │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ HTTP REST Requests (JSON)
                                     │ Authorization: Bearer <JWT_Token>
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLASK BACKEND API                                │
│                                                                             │
│  Python 3 + Flask API (Port 5000)                                           │
│  ├── app.py (CORS, JWT Token Verification, Gmail Regex Validation)         │
│  ├── Price Intelligence Engine (Deviation & Confidence Logic)               │
│  ├── Category Normalization (Smartphones/Mobiles bucket mapping)           │
│  └── Password Hashing (Werkzeug scrypt)                                     │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ SQL Queries (sqlite3)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SQLITE DATABASE                                 │
│                                                                             │
│  database/smartshopping.db                                                  │
│  ├── users              ├── sellers              ├── search_history         │
│  ├── products           ├── product_sellers      ├── recently_viewed        │
│  ├── price_history      ├── wishlist             └── price_alerts           │
└────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Technology Stack

- **Frontend**: React 18, Vite 5, React Router DOM v6, Tailwind CSS v3, Recharts v2, Lucide React icons.
- **Backend**: Python 3.14, Flask 3.0.3 REST API, Flask-CORS 4.0.1, Werkzeug 3.0.3 (Password Hashing), PyJWT 2.8.0.
- **Database**: SQLite 3 (`database/smartshopping.db`).
- **Currency Standard**: Indian Rupees (**₹**) natively formatted using `en-IN` locale.

---

## 4. API Endpoints Table

| Method | Endpoint | Purpose | Auth Required | SQLite Tables Used |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/signup` | Create user account with Gmail regex validation & hashed password | No | `users` |
| `POST` | `/api/auth/login` | Authenticate user with Gmail regex validation & issue JWT token | No | `users` |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes | `users` |
| `GET` | `/api/products` | Fetch catalog with category & search filters | Yes (for search history) | `products`, `wishlist`, `search_history` |
| `GET` | `/api/products/<id>` | Fetch product details, 12M history, sellers, maintenance & resale math | Yes (for recently viewed) | `products`, `price_history`, `product_sellers`, `sellers`, `recently_viewed` |
| `GET` | `/api/products/suggestions` | Live search autocomplete suggestions | No | `products` |
| `GET` | `/api/categories` | Return distinct category list | No | `products` |
| `GET` | `/api/products/compare?ids=1,2` | Side-by-side comparison matrix | No | `products` |
| `GET` | `/api/wishlist` | Retrieve user wishlist items | Yes | `wishlist`, `products` |
| `POST` | `/api/wishlist` | Add product to user wishlist | Yes | `wishlist` |
| `DELETE` | `/api/wishlist/<id>` | Remove product from user wishlist | Yes | `wishlist` |
| `GET` | `/api/search-history` | Fetch user's search history queries | Yes | `search_history` |
| `DELETE` | `/api/search-history/<id>` | Delete single search history query | Yes | `search_history` |
| `DELETE` | `/api/search-history/clear` | Clear all search history for user | Yes | `search_history` |
| `GET` | `/api/recently-viewed` | Fetch user's recently viewed products | Yes | `recently_viewed`, `products` |
| `GET` | `/api/price-alerts` | Fetch active user price target alerts | Yes | `price_alerts`, `products` |
| `POST` | `/api/price-alerts` | Set target price alert in ₹ | Yes | `price_alerts` |
| `DELETE` | `/api/price-alerts/<id>` | Delete target price alert | Yes | `price_alerts` |
| `GET` | `/api/profile` | Fetch user profile statistics | Yes | `users`, `wishlist`, `search_history`, `recently_viewed`, `price_alerts` |

---

## 5. How to Run & Debug

### Commands
1. **Start Backend**:
   ```bash
   cd backend
   python app.py
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

### Debugging Tips
- **Frontend Console**: Open Chrome DevTools (`F12`) $\rightarrow$ Console tab to inspect React errors or API fetch exceptions.
- **Network Tab**: Filter by `Fetch/XHR` to inspect raw request payload and response JSON status codes.
- **SQLite Database**: Execute `python backend/database.py` or inspect table contents via `sqlite3 database/smartshopping.db`.
