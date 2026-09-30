import os
import sqlite3
import jwt
import datetime
import re
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from config import DATABASE_PATH, SECRET_KEY
from database import init_db, get_db_connection

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

CORS(app, resources={r"/api/*": {"origins": "*"}})

GMAIL_REGEX = r'^[A-Za-z0-9._%+-]+@gmail\.com$'

# Ensure database tables exist on server startup
with app.app_context():
    init_db()

# --- AUTH HELPER DECORATOR ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        current_user = None
        if token:
            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                conn = get_db_connection()
                cursor = conn.cursor()
                user_row = cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (data['user_id'],)).fetchone()
                conn.close()
                if user_row:
                    current_user = dict(user_row)
            except Exception:
                pass
        
        return f(current_user, *args, **kwargs)
    return decorated


# --- AUTHENTICATION ROUTES ---
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required.'}), 400

    if not re.match(GMAIL_REGEX, email):
        return jsonify({'error': 'Please enter a valid Gmail address ending in @gmail.com.'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    existing = cursor.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({'error': 'An account with this email already exists.'}), 400

    password_hash = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        (name, email, password_hash)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()

    token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'message': 'Account created successfully!',
        'token': token,
        'user': {'id': user_id, 'name': name, 'email': email}
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Please provide email and password.'}), 400

    if not re.match(GMAIL_REGEX, email):
        return jsonify({'error': 'Invalid Gmail address or password.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    user_row = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not user_row or not check_password_hash(user_row['password_hash'], password):
        return jsonify({'error': 'Invalid Gmail address or password.'}), 401

    user = dict(user_row)
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {'id': user['id'], 'name': user['name'], 'email': email}
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized. Token invalid or expired.'}), 401
    return jsonify({'user': current_user}), 200


# --- CATEGORIES & SEARCH SUGGESTIONS ---
@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("SELECT DISTINCT category FROM products ORDER BY category ASC").fetchall()
    conn.close()
    categories = [r['category'] for r in rows]
    return jsonify({'categories': categories}), 200


@app.route('/api/products/suggestions', methods=['GET'])
def get_search_suggestions():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({'suggestions': []}), 200

    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        SELECT id, name, brand, category, price, image 
        FROM products 
        WHERE name LIKE ? OR brand LIKE ? OR category LIKE ?
        LIMIT 6
    """
    pattern = f"%{query}%"
    rows = cursor.execute(sql, (pattern, pattern, pattern)).fetchall()
    conn.close()

    suggestions = [dict(r) for r in rows]
    return jsonify({'suggestions': suggestions}), 200


# --- PRODUCTS LISTING & SEARCH ---
@app.route('/api/products', methods=['GET'])
@token_required
def get_products(current_user):
    category = request.args.get('category', '').strip()
    search = request.args.get('search', '').strip()
    sort_by = request.args.get('sort', 'relevance').strip()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Record search history if search term is provided and user is logged in
    if search and current_user:
        cursor.execute(
            "INSERT INTO search_history (user_id, search_keyword) VALUES (?, ?)",
            (current_user['id'], search)
        )
        conn.commit()

    sql = "SELECT * FROM products WHERE 1=1"
    params = []

    if category and category.lower() != 'all':
        cat_lower = category.lower()
        if cat_lower in ['mobiles', 'mobile', 'smartphones', 'smartphone']:
            sql += " AND (category = 'Mobiles' OR category = 'Smartphones')"
        elif cat_lower in ['headphones', 'headphone', 'earphones', 'earbuds']:
            sql += " AND (category = 'Headphones' OR category = 'Earphones')"
        elif cat_lower in ['laptops', 'laptop']:
            sql += " AND category = 'Laptops'"
        elif cat_lower in ['smart watches', 'smart watch', 'watches', 'watch']:
            sql += " AND (category = 'Smart Watches' OR category = 'Watches')"
        elif cat_lower in ['tablets', 'tablet']:
            sql += " AND category = 'Tablets'"
        else:
            sql += " AND category = ?"
            params.append(category)

    if search:
        sql += " AND (name LIKE ? OR brand LIKE ? OR category LIKE ? OR processor LIKE ? OR description LIKE ?)"
        pattern = f"%{search}%"
        params.extend([pattern, pattern, pattern, pattern, pattern])

    # Sorting
    if sort_by == 'price_low_high':
        sql += " ORDER BY price ASC"
    elif sort_by == 'price_high_low':
        sql += " ORDER BY price DESC"
    elif sort_by == 'rating':
        sql += " ORDER BY rating DESC"
    elif sort_by == 'newest':
        sql += " ORDER BY id DESC"
    else:
        sql += " ORDER BY rating DESC, price ASC"

    rows = cursor.execute(sql, params).fetchall()

    # Get wishlist items for current user to set is_wishlisted flag
    wishlist_set = set()
    if current_user:
        w_rows = cursor.execute("SELECT product_id FROM wishlist WHERE user_id = ?", (current_user['id'],)).fetchall()
        wishlist_set = {r['product_id'] for r in w_rows}

    conn.close()

    products = []
    for r in rows:
        p = dict(r)
        p['is_wishlisted'] = p['id'] in wishlist_set
        products.append(p)

    return jsonify({'products': products, 'count': len(products)}), 200


# --- PRODUCT DETAILS & PRICE INTELLIGENCE ---
@app.route('/api/products/<int:product_id>', methods=['GET'])
@token_required
def get_product_detail(current_user, product_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    p_row = cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not p_row:
        conn.close()
        return jsonify({'error': 'Product not found.'}), 404

    product = dict(p_row)

    # Track recently viewed if logged in
    if current_user:
        cursor.execute(
            "INSERT INTO recently_viewed (user_id, product_id) VALUES (?, ?)",
            (current_user['id'], product_id)
        )
        conn.commit()

    # 12-Month Price History
    history_rows = cursor.execute(
        "SELECT id, month, price FROM price_history WHERE product_id = ? ORDER BY id ASC",
        (product_id,)
    ).fetchall()
    price_history = [dict(h) for h in history_rows]

    # Seller Prices
    seller_rows = cursor.execute("""
        SELECT ps.id, s.name as seller_name, ps.price, ps.product_url
        FROM product_sellers ps
        JOIN sellers s ON ps.seller_id = s.id
        WHERE ps.product_id = ?
        ORDER BY ps.price ASC
    """, (product_id,)).fetchall()
    sellers = [dict(s) for s in seller_rows]

    # Wishlist & Alert status
    is_wishlisted = False
    active_alert = None
    if current_user:
        w_row = cursor.execute("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id)).fetchone()
        is_wishlisted = bool(w_row)
        a_row = cursor.execute("SELECT id, target_price, status FROM price_alerts WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id)).fetchone()
        if a_row:
            active_alert = dict(a_row)

    conn.close()

    # --- PRICE INTELLIGENCE CALCULATION ---
    prices = [h['price'] for h in price_history] if price_history else [product['price']]
    current_price = product['price']
    lowest_price = min(prices)
    highest_price = max(prices)
    avg_price = sum(prices) / len(prices)
    diff_from_avg = current_price - avg_price
    pct_diff = ((current_price - avg_price) / avg_price) * 100
    estimated_savings = max(0, round(avg_price - current_price))

    if pct_diff <= -3.0:
        recommendation = "BUY NOW"
        status_color = "GREEN"
        confidence = 94
        reason = f"The current price (₹{current_price:,.0f}) is {abs(pct_diff):.1f}% below the 12-month average (₹{avg_price:,.0f}). This represents an excellent buying opportunity!"
    elif pct_diff <= 3.0:
        recommendation = "AVERAGE PRICE"
        status_color = "YELLOW"
        confidence = 78
        reason = f"The current price (₹{current_price:,.0f}) is close to the 12-month average (₹{avg_price:,.0f}). You may buy now or wait for festival sales for bigger discounts."
    else:
        recommendation = "WAIT"
        status_color = "RED"
        confidence = 88
        reason = f"The current price (₹{current_price:,.0f}) is {pct_diff:.1f}% higher than the 12-month average (₹{avg_price:,.0f}). We recommend setting a price alert and waiting."

    price_intelligence = {
        'current_price': current_price,
        'lowest_price': lowest_price,
        'highest_price': highest_price,
        'avg_price': round(avg_price, 2),
        'diff_from_avg': round(diff_from_avg, 2),
        'pct_diff': round(pct_diff, 1),
        'estimated_savings': estimated_savings,
        'recommendation': recommendation,
        'status_color': status_color,
        'confidence': confidence,
        'reason': reason
    }

    # --- 5-YEAR MAINTENANCE COST MODEL ---
    cat = product['category'].lower()
    if 'laptop' in cat:
        m_battery = 4500
        m_service = 1500 * 5
        m_power = 12000
        m_acc = 3000
    elif 'headphone' in cat or 'earphone' in cat or 'earbud' in cat:
        m_battery = 2000
        m_service = 500 * 5
        m_power = 1500
        m_acc = 1000
    elif 'mobile' in cat or 'smartphone' in cat or cat == 'phone' or cat == 'phones':
        m_battery = 3500
        m_service = 1000 * 5
        m_power = 4000
        m_acc = 2500
    elif 'watch' in cat:
        m_battery = 2500
        m_service = 800 * 5
        m_power = 1500
        m_acc = 1500
    else:
        m_battery = 3000
        m_service = 1000 * 5
        m_power = 3000
        m_acc = 2000

    total_maintenance = m_battery + m_service + m_power + m_acc
    total_ownership_cost = current_price + total_maintenance

    maintenance_cost_breakdown = {
        'battery_replacement': m_battery,
        'annual_servicing': m_service,
        'electricity_power': m_power,
        'accessories_chargers': m_acc,
        'total_maintenance_5yr': total_maintenance,
        'total_ownership_cost_5yr': total_ownership_cost
    }

    # --- 5-YEAR RESALE & DEPRECIATION MODEL ---
    depreciation_years = []
    retention_rates = [0.80, 0.68, 0.55, 0.45, 0.35]
    for idx, rate in enumerate(retention_rates, 1):
        resale_val = round(current_price * rate)
        dep_loss = round(current_price - resale_val)
        depreciation_years.append({
            'year': f"Year {idx}",
            'retained_pct': int(rate * 100),
            'resale_value': resale_val,
            'depreciation_loss': dep_loss
        })

    # --- SPECIFICATIONS EXPLANATION DICTIONARY ---
    spec_explanations = {
        'Processor': 'The CPU/Processor is the brain of your device. Higher clock speeds and more cores provide faster application loading and multitasking.',
        'RAM': 'RAM (Random Access Memory) holds active apps in memory. 16GB or higher allows seamless gaming, video editing, and browsing with dozens of open tabs.',
        'Storage': 'Storage (SSD/NVMe) holds your operating system, software, photos, and videos. SSDs provide lightning-fast boot and load times compared to HDDs.',
        'GPU': 'The Graphics Processing Unit renders images, 3D graphics, and games. Dedicated GPUs (like RTX series) are essential for modern gaming and video rendering.',
        'Display': 'Display specifications define visual clarity and color accuracy. Higher resolutions (FHD/2K/4K) and OLED panels offer sharper images and vibrant contrast.',
        'Refresh Rate': 'Refresh Rate (Hz) indicates how many times per second the screen updates. 120Hz or 144Hz offers ultra-smooth animations and fast gaming responsiveness.',
        'Battery': 'Battery capacity (mAh or Wh) determines how long your device lasts on a single charge under typical usage.',
        'Operating System': 'The OS (Windows, macOS, Android, iOS) governs user interface, security updates, and software compatibility.',
        'ANC': 'Active Noise Cancellation uses microphones to cancel external background noise for an immersive audio experience.',
        'Camera': 'Camera sensors, megapixels, and optical stabilization determine photo/video sharpness, low-light performance, and zoom capabilities.'
    }

    product['is_wishlisted'] = is_wishlisted
    product['active_alert'] = active_alert

    return jsonify({
        'product': product,
        'price_history': price_history,
        'sellers': sellers,
        'price_intelligence': price_intelligence,
        'maintenance_cost': maintenance_cost_breakdown,
        'resale_depreciation': depreciation_years,
        'spec_explanations': spec_explanations
    }), 200


# --- WISHLIST API ---
@app.route('/api/wishlist', methods=['GET'])
@token_required
def get_wishlist(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT p.*, w.created_at as wishlisted_at
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    """, (current_user['id'],)).fetchall()
    conn.close()

    wishlist_items = [dict(r) for r in rows]
    return jsonify({'wishlist': wishlist_items, 'count': len(wishlist_items)}), 200


@app.route('/api/wishlist', methods=['POST'])
@token_required
def add_to_wishlist(current_user):
    if not current_user:
        return jsonify({'error': 'Please login to save items to your wishlist.'}), 401

    data = request.get_json() or {}
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'error': 'Product ID is required.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
            (current_user['id'], product_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'message': 'Product added to wishlist successfully!'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'message': 'Product is already in your wishlist.'}), 200


@app.route('/api/wishlist/<int:product_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(current_user, product_id):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Product removed from wishlist.'}), 200


# --- SEARCH HISTORY API ---
@app.route('/api/search-history', methods=['GET'])
@token_required
def get_search_history(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT id, search_keyword, searched_at 
        FROM search_history 
        WHERE user_id = ? 
        ORDER BY searched_at DESC 
        LIMIT 20
    """, (current_user['id'],)).fetchall()
    conn.close()

    history = [dict(r) for r in rows]
    return jsonify({'search_history': history}), 200


@app.route('/api/search-history/<int:history_id>', methods=['DELETE'])
@token_required
def delete_search_history_item(current_user, history_id):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM search_history WHERE id = ? AND user_id = ?", (history_id, current_user['id']))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Search history record deleted.'}), 200


@app.route('/api/search-history/clear', methods=['DELETE'])
@token_required
def clear_all_search_history(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM search_history WHERE user_id = ?", (current_user['id'],))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Search history cleared successfully.'}), 200


# --- RECENTLY VIEWED API ---
@app.route('/api/recently-viewed', methods=['GET'])
@token_required
def get_recently_viewed(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT DISTINCT p.*, MAX(rv.viewed_at) as last_viewed
        FROM recently_viewed rv
        JOIN products p ON rv.product_id = p.id
        WHERE rv.user_id = ?
        GROUP BY p.id
        ORDER BY last_viewed DESC
        LIMIT 10
    """, (current_user['id'],)).fetchall()
    conn.close()

    products = [dict(r) for r in rows]
    return jsonify({'recently_viewed': products}), 200


# --- PRICE ALERTS API ---
@app.route('/api/price-alerts', methods=['GET'])
@token_required
def get_price_alerts(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT pa.id, pa.target_price, pa.created_at, pa.status,
               p.id as product_id, p.name as product_name, p.brand, p.price as current_price, p.image
        FROM price_alerts pa
        JOIN products p ON pa.product_id = p.id
        WHERE pa.user_id = ?
        ORDER BY pa.created_at DESC
    """, (current_user['id'],)).fetchall()
    conn.close()

    alerts = []
    for r in rows:
        a = dict(r)
        a['is_reached'] = a['current_price'] <= a['target_price']
        alerts.append(a)

    return jsonify({'price_alerts': alerts}), 200


@app.route('/api/price-alerts', methods=['POST'])
@token_required
def create_price_alert(current_user):
    if not current_user:
        return jsonify({'error': 'Please login to set price alerts.'}), 401

    data = request.get_json() or {}
    product_id = data.get('product_id')
    target_price = data.get('target_price')

    if not product_id or not target_price:
        return jsonify({'error': 'Product ID and target price are required.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if active alert already exists
    existing = cursor.execute("SELECT id FROM price_alerts WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id)).fetchone()
    if existing:
        cursor.execute("UPDATE price_alerts SET target_price = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?", (target_price, existing['id']))
        alert_id = existing['id']
    else:
        cursor.execute(
            "INSERT INTO price_alerts (user_id, product_id, target_price) VALUES (?, ?, ?)",
            (current_user['id'], product_id, target_price)
        )
        alert_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return jsonify({'message': f'Price alert target of ₹{float(target_price):,.0f} set successfully!', 'alert_id': alert_id}), 201


@app.route('/api/price-alerts/<int:alert_id>', methods=['DELETE'])
@token_required
def delete_price_alert(current_user, alert_id):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM price_alerts WHERE id = ? AND user_id = ?", (alert_id, current_user['id']))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Price alert removed successfully.'}), 200


# --- PRODUCT COMPARISON API ---
@app.route('/api/products/compare', methods=['GET'])
def compare_products():
    ids_param = request.args.get('ids', '')
    if not ids_param:
        return jsonify({'error': 'Please provide product IDs to compare e.g., ?ids=1,2'}), 400

    id_list = [int(i.strip()) for i in ids_param.split(',') if i.strip().isdigit()]
    if len(id_list) < 1:
        return jsonify({'error': 'Invalid product IDs provided.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    placeholders = ','.join(['?'] * len(id_list))
    rows = cursor.execute(f"SELECT * FROM products WHERE id IN ({placeholders})", id_list).fetchall()
    conn.close()

    products = [dict(r) for r in rows]

    if not products:
        return jsonify({'error': 'No matching products found for comparison.'}), 404

    # Determine "Best Overall" product based on rating and price position
    best_product = max(products, key=lambda x: (x['rating'], -x['price']))
    best_overall = {
        'product_id': best_product['id'],
        'product_name': best_product['name'],
        'reason': f"{best_product['name']} scores highest in overall customer rating ({best_product['rating']}★) and offers a superior price-to-performance ratio in its category."
    }

    return jsonify({'products': products, 'best_overall': best_overall}), 200


# --- USER PROFILE OVERVIEW API ---
@app.route('/api/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    if not current_user:
        return jsonify({'error': 'Unauthorized access.'}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    u_id = current_user['id']

    wishlist_count = cursor.execute("SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?", (u_id,)).fetchone()['count']
    search_count = cursor.execute("SELECT COUNT(*) as count FROM search_history WHERE user_id = ?", (u_id,)).fetchone()['count']
    recent_count = cursor.execute("SELECT COUNT(*) as count FROM recently_viewed WHERE user_id = ?", (u_id,)).fetchone()['count']
    alerts_count = cursor.execute("SELECT COUNT(*) as count FROM price_alerts WHERE user_id = ?", (u_id,)).fetchone()['count']

    conn.close()

    return jsonify({
        'user': current_user,
        'stats': {
            'wishlist_count': wishlist_count,
            'search_count': search_count,
            'recently_viewed_count': recent_count,
            'alerts_count': alerts_count
        }
    }), 200


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'SmartShopping API Server is running successfully',
        'currency': 'INR (₹)'
    }), 200


if __name__ == '__main__':
    print("Starting SmartShopping Flask Backend Server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
