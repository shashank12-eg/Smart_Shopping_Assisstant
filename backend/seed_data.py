from werkzeug.security import generate_password_hash
from database import init_db, get_db_connection


def seed_database():
    # Ensure all tables exist
    init_db()

    conn   = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data safely
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    for tbl in ["product_sellers", "price_history", "wishlist",
                "search_history", "recently_viewed", "price_alerts",
                "products", "sellers", "users"]:
        cursor.execute(f"TRUNCATE TABLE {tbl}")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    conn.commit()

    # 1. Seed Demo User
    demo_password_hash = generate_password_hash("password123")
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        ("Shashank Sharma", "shashank@gmail.com", demo_password_hash)
    )

    # 2. Seed Retailer Sellers (Amazon, Flipkart, Meesho, Myntra, Reliance Digital, Croma)
    sellers_list = ["Amazon", "Flipkart", "Meesho", "Myntra", "Reliance Digital", "Croma"]
    seller_ids   = {}
    for s in sellers_list:
        cursor.execute("INSERT INTO sellers (name) VALUES (%s)", (s,))
        seller_ids[s] = cursor.lastrowid

    # 3. Seed Canonical Products across 5 normalized categories
    products_data = [
        # --- LAPTOPS ---
        {
            "canonical_name": "Acer Nitro 5 Gaming Laptop AN515",
            "name": "Acer Nitro 5 Gaming Laptop", "brand": "Acer", "model": "AN515-58", "category": "Laptops",
            "price": 62999, "previous_price": 64999, "rating": 4.5, "review_count": 340,
            "description": "High performance gaming laptop powered by AMD Ryzen 7 7735HS and NVIDIA GeForce RTX 3050. Features a 144Hz FHD display for fluid gaming.",
            "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
            "processor": "AMD Ryzen 7 7735HS (8 Cores, up to 4.75 GHz)",
            "ram": "16 GB DDR5 4800MHz", "storage": "512 GB PCIe Gen4 NVMe M.2 SSD",
            "gpu": "NVIDIA GeForce RTX 3050 6GB GDDR6",
            "battery": "57 Wh 4-Cell Li-ion (Up to 6 hours)",
            "display": "15.6 inch FHD (1920x1080) IPS 144Hz", "refresh_rate": "144 Hz",
            "operating_system": "Windows 11 Home", "warranty": "1 Year International Travelers Warranty",
            "sellers": {"Amazon": 62999, "Flipkart": 61499, "Reliance Digital": 63500, "Croma": 63999},
            "history": [68999, 67499, 66999, 65999, 64999, 66500, 67000, 65499, 64299, 63999, 63499, 62999]
        },
        {
            "canonical_name": "ASUS TUF Gaming A15 FA506",
            "name": "ASUS TUF Gaming A15", "brand": "ASUS", "model": "FA506NC", "category": "Laptops",
            "price": 74990, "previous_price": 76990, "rating": 4.6, "review_count": 520,
            "description": "Military-grade durable gaming laptop with AMD Ryzen 7 7435HS and NVIDIA RTX 4050 graphics. Anti-dust cooling system for marathon sessions.",
            "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
            "processor": "AMD Ryzen 7 7435HS", "ram": "16 GB DDR5 4800MHz",
            "storage": "1 TB PCIe 4.0 NVMe SSD", "gpu": "NVIDIA GeForce RTX 4050 6GB TGP 140W",
            "battery": "90 Wh 4-Cell Li-ion (Up to 8 hours)",
            "display": "15.6 inch FHD 144Hz vIPS-level", "refresh_rate": "144 Hz",
            "operating_system": "Windows 11 Home", "warranty": "1 Year Onsite Warranty",
            "sellers": {"Amazon": 74990, "Flipkart": 73990, "Reliance Digital": 75500, "Croma": 74990},
            "history": [81990, 79990, 78990, 77990, 76990, 76500, 75990, 75490, 74990, 75200, 74990, 74990]
        },
        {
            "canonical_name": "Apple MacBook Air M2 2023",
            "name": "Apple MacBook Air M2", "brand": "Apple", "model": "MLXW3HN/A", "category": "Laptops",
            "price": 89900, "previous_price": 92900, "rating": 4.8, "review_count": 1280,
            "description": "Incredibly thin and fast MacBook powered by Apple M2 chip. Up to 18 hours of battery life with silent fanless design.",
            "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            "processor": "Apple M2 Chip (8-core CPU, 8-core GPU)", "ram": "8 GB Unified Memory",
            "storage": "256 GB Superfast SSD Storage", "gpu": "Integrated 8-Core Apple GPU",
            "battery": "52.6 Wh Lithium-Polymer (Up to 18 hours)",
            "display": "13.6 inch Liquid Retina True Tone Display", "refresh_rate": "60 Hz",
            "operating_system": "macOS Sonoma", "warranty": "1 Year AppleCare Warranty",
            "sellers": {"Amazon": 89900, "Flipkart": 88490, "Reliance Digital": 89900, "Croma": 90900},
            "history": [99900, 97900, 95900, 94900, 93900, 92500, 91900, 90900, 89900, 89900, 89500, 89900]
        },
        {
            "canonical_name": "Lenovo Legion Slim 5 Gen 8",
            "name": "Lenovo Legion Slim 5", "brand": "Lenovo", "model": "82Y9009DIN", "category": "Laptops",
            "price": 108990, "previous_price": 112990, "rating": 4.7, "review_count": 410,
            "description": "Slim and powerful creator/gaming laptop with Intel Core i7 13700H, RTX 4060, and OLED high refresh rate display.",
            "image": "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80",
            "processor": "Intel Core i7-13700H (14 Cores, 20 Threads)", "ram": "16 GB DDR5 5200MHz",
            "storage": "1 TB SSD M.2 2280 PCIe 4.0", "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6",
            "battery": "80 Wh (Up to 7 hours)", "display": "16 inch WQXGA (2560x1600) IPS 165Hz",
            "refresh_rate": "165 Hz", "operating_system": "Windows 11 Home",
            "warranty": "1 Year Onsite + Legion VIP Care",
            "sellers": {"Amazon": 108990, "Flipkart": 107500, "Reliance Digital": 109990, "Croma": 108990},
            "history": [119990, 117990, 115990, 114990, 112990, 111500, 110990, 109990, 108990, 109500, 108990, 108990]
        },

        # --- MOBILES ---
        {
            "canonical_name": "Apple iPhone 15 Pro 128GB",
            "name": "Apple iPhone 15 Pro", "brand": "Apple", "model": "A3102", "category": "Mobiles",
            "price": 127990, "previous_price": 134900, "rating": 4.8, "review_count": 2150,
            "description": "Titanium design with A17 Pro chip, customizable Action button, and versatile 48MP main camera system.",
            "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
            "processor": "Apple A17 Pro (3nm)", "ram": "8 GB RAM", "storage": "128 GB NVMe Storage",
            "display": "6.1 inch Super Retina XDR OLED 120Hz ProMotion",
            "battery": "3274 mAh Li-Ion (Up to 23 hrs video)",
            "camera": "48MP Main + 12MP Ultra-Wide + 12MP 3x Telephoto",
            "charging": "20W Wired, 15W MagSafe Wireless", "operating_system": "iOS 17",
            "warranty": "1 Year Apple Warranty",
            "sellers": {"Amazon": 127990, "Flipkart": 126900, "Reliance Digital": 128900, "Croma": 127990},
            "history": [134900, 134900, 132900, 131900, 129900, 129500, 128900, 128500, 127990, 127990, 127500, 127990]
        },
        {
            "canonical_name": "Samsung Galaxy S24 Ultra 5G 256GB",
            "name": "Samsung Galaxy S24 Ultra 5G", "brand": "Samsung", "model": "SM-S928B", "category": "Mobiles",
            "price": 129999, "previous_price": 134999, "rating": 4.7, "review_count": 1890,
            "description": "Galaxy AI companion smartphone with Snapdragon 8 Gen 3, Titanium frame, integrated S-Pen, and 200MP camera.",
            "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
            "processor": "Qualcomm Snapdragon 8 Gen 3 for Galaxy", "ram": "12 GB LPDDR5X",
            "storage": "256 GB UFS 4.0", "display": "6.8 inch Dynamic AMOLED 2X QHD+ 120Hz",
            "battery": "5000 mAh (45W Super Fast Charging)",
            "camera": "200MP Main + 50MP 5x Telephoto + 10MP 3x Telephoto + 12MP Ultra-Wide",
            "charging": "45W Fast Wired, 15W Wireless", "operating_system": "Android 14, One UI 6.1",
            "warranty": "1 Year Manufacturer Warranty",
            "sellers": {"Amazon": 129999, "Flipkart": 128499, "Reliance Digital": 130500, "Croma": 129999},
            "history": [139999, 137999, 135999, 134999, 132999, 131999, 130999, 129999, 129999, 130200, 129999, 129999]
        },
        {
            "canonical_name": "OnePlus 12 5G 256GB",
            "name": "OnePlus 12 5G", "brand": "OnePlus", "model": "CPH2573", "category": "Mobiles",
            "price": 64999, "previous_price": 69999, "rating": 4.6, "review_count": 940,
            "description": "Smooth Beyond Belief with Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, and 100W SUPERVOOC charging.",
            "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
            "processor": "Snapdragon 8 Gen 3 Mobile Platform", "ram": "12 GB LPDDR5X",
            "storage": "256 GB UFS 4.0", "display": "6.82 inch ProXDR 2K 120Hz LTPO AMOLED",
            "battery": "5400 mAh Dual-cell",
            "camera": "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultra-wide",
            "charging": "100W Wired SUPERVOOC, 50W AIRVOOC Wireless",
            "operating_system": "OxygenOS 14 based on Android 14", "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 64999, "Flipkart": 63999, "Reliance Digital": 64999, "Croma": 65499},
            "history": [69999, 68999, 67999, 66999, 65999, 66500, 65500, 64999, 64999, 65200, 64999, 64999]
        },

        # --- HEADPHONES ---
        {
            "canonical_name": "Sony WH-1000XM5 Noise Canceling Headphones",
            "name": "Sony WH-1000XM5 Wireless Headphones", "brand": "Sony", "model": "WH1000XM5/B", "category": "Headphones",
            "price": 26990, "previous_price": 29990, "rating": 4.8, "review_count": 1420,
            "description": "Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality with 30-hr battery life.",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "driver": "30mm Precision Engineered Driver", "battery": "30 Hours ANC ON (40 Hours ANC OFF)",
            "anc": "Auto NC Optimizer Industry-Leading ANC", "connectivity": "Bluetooth 5.2, LDAC, Multi-point Connection",
            "weight": "250g Ultra-lightweight", "charging": "USB-PD Quick Charge (3 mins = 3 hrs play)",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 26990, "Flipkart": 25990, "Reliance Digital": 27490, "Croma": 26990},
            "history": [34990, 32990, 31990, 29990, 28990, 28500, 27990, 27490, 26990, 26990, 26490, 26990]
        },
        {
            "canonical_name": "Bose QuietComfort Ultra Over-Ear Headphones",
            "name": "Bose QuietComfort Ultra Headphones", "brand": "Bose", "model": "QC-ULTRA", "category": "Headphones",
            "price": 35900, "previous_price": 38900, "rating": 4.7, "review_count": 860,
            "description": "Breakthrough spatialized audio for more immersive listening with world-class noise cancellation and CustomTune tech.",
            "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
            "driver": "Bose Custom Acoustic Architecture", "battery": "24 Hours Battery Life (18 Hours Immersive Audio)",
            "anc": "Quiet Mode, Aware Mode, Immersion Mode", "connectivity": "Bluetooth 5.3, Snapdragon Sound",
            "weight": "252g", "charging": "USB-C (15 mins = 2 hrs play)", "warranty": "1 Year Bose India Warranty",
            "sellers": {"Amazon": 35900, "Flipkart": 34900, "Reliance Digital": 35900, "Croma": 36500},
            "history": [39900, 38900, 37900, 36900, 36500, 36200, 35900, 35900, 35900, 35900, 35400, 35900]
        },

        # --- SMART WATCHES ---
        {
            "canonical_name": "Apple Watch Series 9 GPS 45mm",
            "name": "Apple Watch Series 9 GPS", "brand": "Apple", "model": "MR993HN/A", "category": "Smart Watches",
            "price": 41900, "previous_price": 44900, "rating": 4.7, "review_count": 980,
            "description": "S9 SiP enables double tap gesture, brighter display, faster on-device Siri, and advanced health sensors.",
            "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
            "display": "45mm Always-On Retina Display (up to 2000 nits)",
            "battery": "18 Hours Normal Use (36 Hours Low Power Mode)",
            "sensors": "ECG, Blood Oxygen, Heart Rate, Temperature, Crash Detection",
            "water_resistance": "50m Water Resistant (Swimproof)", "compatibility": "iOS (Requires iPhone XS or later)",
            "operating_system": "watchOS 10", "warranty": "1 Year Apple Warranty",
            "sellers": {"Amazon": 41900, "Flipkart": 40900, "Reliance Digital": 41900, "Croma": 42490},
            "history": [44900, 44900, 43900, 43500, 42900, 42500, 42100, 41900, 41900, 41900, 41400, 41900]
        },
        {
            "canonical_name": "Samsung Galaxy Watch 6 Classic 47mm",
            "name": "Samsung Galaxy Watch 6 Classic", "brand": "Samsung", "model": "SM-R960", "category": "Smart Watches",
            "price": 32999, "previous_price": 35999, "rating": 4.6, "review_count": 640,
            "description": "Timeless iconic rotating bezel with 30% larger screen, personalized sleep coaching, and BIA body composition scanner.",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "display": "1.5 inch Super AMOLED Sapphire Crystal Display",
            "battery": "425 mAh (up to 40 hours)",
            "sensors": "BioActive Sensor (ECG, BIA, HR), Temperature, Infrared",
            "water_resistance": "5ATM + IP68 / MIL-STD-810H", "compatibility": "Android 10.0 or higher",
            "operating_system": "Wear OS Powered by Samsung", "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 32999, "Flipkart": 31999, "Reliance Digital": 33500, "Croma": 32999},
            "history": [38999, 37999, 36999, 35999, 34999, 34500, 33999, 33499, 32999, 32999, 32499, 32999]
        },

        # --- TABLETS ---
        {
            "canonical_name": "Apple iPad Air M2 11-inch 128GB",
            "name": "Apple iPad Air M2 (11-inch)", "brand": "Apple", "model": "MUWC3HN/A", "category": "Tablets",
            "price": 59900, "previous_price": 62900, "rating": 4.8, "review_count": 890,
            "description": "Freshly redesigned 11-inch iPad Air supercharged by the Apple M2 chip with Liquid Retina display and Wi-Fi 6E.",
            "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
            "processor": "Apple M2 Chip (8-core CPU, 10-core GPU)", "ram": "8 GB RAM",
            "storage": "128 GB Storage", "display": "11 inch Liquid Retina LED Backlit Multi-Touch",
            "battery": "28.93 Wh rechargeable lithium-polymer (Up to 10 hrs)",
            "camera": "12MP Wide back camera, 12MP Ultra Wide front",
            "operating_system": "iPadOS 17", "warranty": "1 Year Apple Warranty",
            "sellers": {"Amazon": 59900, "Flipkart": 58900, "Reliance Digital": 59900, "Croma": 60500},
            "history": [64900, 63900, 62900, 61900, 60900, 60500, 59900, 59900, 59900, 59900, 59400, 59900]
        },
        {
            "canonical_name": "Samsung Galaxy Tab S9 Ultra 256GB",
            "name": "Samsung Galaxy Tab S9 Ultra", "brand": "Samsung", "model": "SM-X910", "category": "Tablets",
            "price": 108999, "previous_price": 114999, "rating": 4.7, "review_count": 530,
            "description": "Massive 14.6 inch Dynamic AMOLED 2X display, IP68 water resistance, included S Pen, and Snapdragon 8 Gen 2 power.",
            "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
            "processor": "Qualcomm Snapdragon 8 Gen 2 for Galaxy", "ram": "12 GB RAM",
            "storage": "256 GB Expandable up to 1TB", "display": "14.6 inch Dynamic AMOLED 2X 120Hz HDR10+",
            "battery": "11200 mAh (45W Fast Charging)",
            "camera": "13MP + 8MP Dual Back, 12MP + 12MP Dual Front",
            "operating_system": "Android 13, One UI 5.1", "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 108999, "Flipkart": 107499, "Reliance Digital": 109999, "Croma": 108999},
            "history": [119999, 117999, 115999, 114999, 112999, 111500, 110999, 109999, 108999, 108999, 107999, 108999]
        }
    ]

    months_list = [
        "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026",
        "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026"
    ]

    for p in products_data:
        cursor.execute('''
            INSERT INTO products (
                canonical_name, name, brand, model, category, price, previous_price, rating, review_count,
                description, image, processor, ram, storage, gpu, battery, display, refresh_rate,
                operating_system, warranty, camera, charging, sensors, driver, anc, connectivity, weight, water_resistance, compatibility
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            p["canonical_name"], p["name"], p["brand"], p["model"], p["category"], p["price"], p["previous_price"], p["rating"], p["review_count"],
            p["description"], p["image"],
            p.get("processor"), p.get("ram"), p.get("storage"), p.get("gpu"), p.get("battery"),
            p.get("display"), p.get("refresh_rate"), p.get("operating_system"), p.get("warranty"),
            p.get("camera"), p.get("charging"), p.get("sensors"), p.get("driver"),
            p.get("anc"), p.get("connectivity"), p.get("weight"),
            p.get("water_resistance"), p.get("compatibility")
        ))
        product_id = cursor.lastrowid

        # 12-month timestamped price history
        for i, hist_price in enumerate(p["history"]):
            cursor.execute(
                "INSERT INTO price_history (product_id, month, price) VALUES (%s, %s, %s)",
                (product_id, months_list[i], hist_price)
            )

        # Seller prices
        for seller_name, seller_price in p["sellers"].items():
            s_id  = seller_ids[seller_name]
            q_name = p['name'].replace(' ', '+')
            ret = seller_name.lower()
            if 'amazon' in ret:
                p_url = f"https://www.amazon.in/s?k={q_name}"
            elif 'flipkart' in ret:
                p_url = f"https://www.flipkart.com/search?q={q_name}"
            elif 'croma' in ret:
                p_url = f"https://www.croma.com/searchB?q={q_name}%3Arelevance"
            elif 'reliance' in ret:
                p_url = f"https://www.reliancedigital.in/search?q={q_name}"
            elif 'meesho' in ret:
                p_url = f"https://www.meesho.com/search?q={q_name}"
            elif 'myntra' in ret:
                p_url = f"https://www.myntra.com/{p['name'].replace(' ', '-')}"
            else:
                p_url = f"https://www.google.com/search?q={seller_name}+{q_name}"
            cursor.execute(
                "INSERT INTO product_sellers (product_id, seller_id, price, previous_price, product_url, availability, source_provider) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (product_id, s_id, seller_price, p["previous_price"], p_url, "In Stock", "Provider Feed")
            )

    conn.commit()
    cursor.close()
    conn.close()
    print("[DB] Database successfully seeded with canonical products across all 5 normalized categories!")


if __name__ == '__main__':
    seed_database()
