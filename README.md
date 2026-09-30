# SmartShopping — Intelligent Product Price & Purchase Decision Assistant

SmartShopping is a modern, full-stack shopping decision assistant designed for consumers in India. It helps users decide whether to **BUY NOW** or **WAIT** based on historical price trends (in **₹ INR**), seller price comparisons, 5-year maintenance cost projections, resale depreciation estimates, interactive spec guides, and user-specific features like Wishlist, Search History, and Price Target Alerts.

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3, Flask REST API, Flask-CORS, Werkzeug (Password Hashing)
- **Database**: SQLite (`database/smartshopping.db`)

---

## Project Structure

```
shopping/
├── frontend/             # React + Vite + Tailwind CSS UI
│   ├── src/
│   │   ├── components/   # Modular UI components
│   │   ├── pages/        # Auth, Home, Browse, ProductDetail, Compare, Profile
│   │   ├── layouts/      # App & Auth layout wrappers
│   │   ├── services/     # API integration services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/              # Python Flask REST API
│   ├── app.py            # Main application entry point
│   ├── config.py         # Configs and SQLite DB paths
│   ├── database.py       # Table schemas and SQLite helper
│   ├── requirements.txt
├── database/             # SQLite storage
│   └── smartshopping.db
└── README.md
```

---

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python database.py   # Initializes SQLite tables
python app.py        # Starts Flask server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server on http://localhost:3000
```

---

## Key Features

- **Full Authentication**: User signup with hashed passwords & login flow.
- **INR Currency Standard**: 100% pricing formatted in Indian Rupees (**₹**).
- **Price Intelligence (BUY NOW / WAIT)**: Automated recommendation based on 12-month historical price deviation.
- **Interactive 12-Month Price Graph**: Visual price trends powered by Recharts.
- **Seller Comparison**: Compares Amazon, Flipkart, Reliance Digital, and Croma with lowest price highlighting.
- **Hardware Spec Explanations**: Clickable specifications for laptops, mobiles, headphones, tablets, and smartwatches.
- **Ownership Cost Estimator**: Calculates 5-Year maintenance and total cost of ownership.
- **Resale & Depreciation Projection**: 5-Year resale value predictions.
- **Comparison Engine**: Side-by-side product comparison with "Best Overall" recommendation.
- **User Dashboard**: Personalized Wishlist, Recently Viewed, Search History, and Price Target Alerts.
