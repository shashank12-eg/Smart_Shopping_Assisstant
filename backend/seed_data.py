import sqlite3
from werkzeug.security import generate_password_hash
from config import DATABASE_PATH
from database import init_db

def seed_database():
    init_db()
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Clear existing data
    cursor.execute("DELETE FROM product_sellers")
    cursor.execute("DELETE FROM price_history")
    cursor.execute("DELETE FROM products")
    cursor.execute("DELETE FROM sellers")
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM wishlist")
    cursor.execute("DELETE FROM search_history")
    cursor.execute("DELETE FROM recently_viewed")
    cursor.execute("DELETE FROM price_alerts")

    # Reset autoincrement
    cursor.execute("DELETE FROM sqlite_sequence")

    # 1. Seed Demo User
    demo_password_hash = generate_password_hash("password123")
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        ("Shashank Sharma", "demo@smartshopping.com", demo_password_hash)
    )

    # 2. Seed Sellers
    sellers = ["Amazon", "Flipkart", "Reliance Digital", "Croma"]
    seller_ids = {}
    for s in sellers:
        cursor.execute("INSERT INTO sellers (name) VALUES (?)", (s,))
        seller_ids[s] = cursor.lastrowid

    # 3. Seed Products across exactly 5 categories: Headphones, Laptops, Mobiles, Smart Watches, Tablets
    products_data = [
        # --- LAPTOPS ---
        {
            "name": "Acer Nitro 5 Gaming Laptop",
            "brand": "Acer",
            "category": "Laptops",
            "price": 62999,
            "rating": 4.5,
            "description": "High performance gaming laptop powered by AMD Ryzen 7 7735HS and NVIDIA GeForce RTX 3050. Features a 144Hz FHD display for fluid gaming.",
            "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
            "processor": "AMD Ryzen 7 7735HS (8 Cores, up to 4.75 GHz)",
            "ram": "16 GB DDR5 4800MHz",
            "storage": "512 GB PCIe Gen4 NVMe M.2 SSD",
            "gpu": "NVIDIA GeForce RTX 3050 6GB GDDR6",
            "battery": "57 Wh 4-Cell Li-ion (Up to 6 hours)",
            "display": "15.6 inch FHD (1920x1080) IPS 144Hz",
            "refresh_rate": "144 Hz",
            "operating_system": "Windows 11 Home",
            "warranty": "1 Year International Travelers Warranty",
            "sellers": {"Amazon": 62999, "Flipkart": 61499, "Reliance Digital": 63500, "Croma": 63999},
            "history": [68999, 67499, 66999, 65999, 64999, 66500, 67000, 65499, 64299, 63999, 63499, 62999]
        },
        {
            "name": "ASUS TUF Gaming A15",
            "brand": "ASUS",
            "category": "Laptops",
            "price": 74990,
            "rating": 4.6,
            "description": "Military-grade durable gaming laptop with AMD Ryzen 7 7435HS and NVIDIA RTX 4050 graphics. Anti-dust cooling system for marathon sessions.",
            "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
            "processor": "AMD Ryzen 7 7435HS",
            "ram": "16 GB DDR5 4800MHz",
            "storage": "1 TB PCIe 4.0 NVMe SSD",
            "gpu": "NVIDIA GeForce RTX 4050 6GB TGP 140W",
            "battery": "90 Wh 4-Cell Li-ion (Up to 8 hours)",
            "display": "15.6 inch FHD 144Hz vIPS-level",
            "refresh_rate": "144 Hz",
            "operating_system": "Windows 11 Home",
            "warranty": "1 Year Onsite Warranty",
            "sellers": {"Amazon": 74990, "Flipkart": 73990, "Reliance Digital": 75500, "Croma": 74990},
            "history": [81990, 79990, 78990, 77990, 76990, 76500, 75990, 75490, 74990, 75200, 74990, 74990]
        },
        {
            "name": "Apple MacBook Air M2",
            "brand": "Apple",
            "category": "Laptops",
            "price": 89900,
            "rating": 4.8,
            "description": "Incredibly thin and fast MacBook powered by Apple M2 chip. Up to 18 hours of battery life with silent fanless design.",
            "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            "processor": "Apple M2 Chip (8-core CPU, 8-core GPU)",
            "ram": "8 GB Unified Memory",
            "storage": "256 GB Superfast SSD Storage",
            "gpu": "Integrated 8-Core Apple GPU",
            "battery": "52.6 Wh Lithium-Polymer (Up to 18 hours)",
            "display": "13.6 inch Liquid Retina True Tone Display",
            "refresh_rate": "60 Hz",
            "operating_system": "macOS Sonoma",
            "warranty": "1 Year AppleCare Warranty",
            "sellers": {"Amazon": 89900, "Flipkart": 88490, "Reliance Digital": 89900, "Croma": 90900},
            "history": [99900, 97900, 95900, 94900, 93900, 92500, 91900, 90900, 89900, 89900, 89500, 89900]
        },
        {
            "name": "Lenovo Legion Slim 5",
            "brand": "Lenovo",
            "category": "Laptops",
            "price": 108990,
            "rating": 4.7,
            "description": "Slim and powerful creator/gaming laptop with Intel Core i7 13700H, RTX 4060, and OLED high refresh rate display.",
            "image": "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80",
            "processor": "Intel Core i7-13700H (14 Cores, 20 Threads)",
            "ram": "16 GB DDR5 5200MHz",
            "storage": "1 TB SSD M.2 2280 PCIe 4.0",
            "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6",
            "battery": "80 Wh (Up to 7 hours)",
            "display": "16 inch WQXGA (2560x1600) IPS 165Hz",
            "refresh_rate": "165 Hz",
            "operating_system": "Windows 11 Home",
            "warranty": "1 Year Onsite + Legion VIP Care",
            "sellers": {"Amazon": 108990, "Flipkart": 107500, "Reliance Digital": 109990, "Croma": 108990},
            "history": [119990, 117990, 115990, 114990, 112990, 111500, 110990, 109990, 108990, 109500, 108990, 108990]
        },
        {
            "name": "Dell XPS 15 9530",
            "brand": "Dell",
            "category": "Laptops",
            "price": 184990,
            "rating": 4.8,
            "description": "Premium ultraportable creator laptop featuring 13th Gen Intel Core i7, 3.5K OLED Touch display, and CNC machined aluminum chassis.",
            "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
            "processor": "Intel Core i7-13700H (up to 5.0 GHz)",
            "ram": "32 GB DDR5 4800MHz",
            "storage": "1 TB NVMe M.2 PCIe SSD",
            "gpu": "NVIDIA GeForce RTX 4050 6GB GDDR6",
            "battery": "86 Wh 6-cell (Up to 10 hours)",
            "display": "15.6 inch 3.5K (3456x2160) OLED Touch",
            "refresh_rate": "60 Hz",
            "operating_system": "Windows 11 Pro",
            "warranty": "1 Year Dell Premium Support",
            "sellers": {"Amazon": 184990, "Flipkart": 182990, "Reliance Digital": 185000, "Croma": 184990},
            "history": [199990, 195990, 192990, 189990, 187990, 186500, 185990, 184990, 184990, 185200, 184990, 184990]
        },

        # --- MOBILES (All phone devices under 'Mobiles') ---
        {
            "name": "Apple iPhone 15 Pro",
            "brand": "Apple",
            "category": "Mobiles",
            "price": 127990,
            "rating": 4.8,
            "description": "Titanium design with A17 Pro chip, customizable Action button, and versatile 48MP main camera system.",
            "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
            "processor": "Apple A17 Pro (3nm)",
            "ram": "8 GB RAM",
            "storage": "128 GB NVMe Storage",
            "display": "6.1 inch Super Retina XDR OLED 120Hz ProMotion",
            "battery": "3274 mAh Li-Ion (Up to 23 hrs video)",
            "camera": "48MP Main + 12MP Ultra-Wide + 12MP 3x Telephoto",
            "charging": "20W Wired, 15W MagSafe Wireless",
            "operating_system": "iOS 17",
            "warranty": "1 Year Apple Warranty",
            "sellers": {"Amazon": 127990, "Flipkart": 126900, "Reliance Digital": 128900, "Croma": 127990},
            "history": [134900, 134900, 132900, 131900, 129900, 129500, 128900, 128500, 127990, 127990, 127500, 127990]
        },
        {
            "name": "Samsung Galaxy S24 Ultra 5G",
            "brand": "Samsung",
            "category": "Mobiles",
            "price": 129999,
            "rating": 4.7,
            "description": "Galaxy AI companion smartphone with Snapdragon 8 Gen 3, Titanium frame, integrated S-Pen, and 200MP camera.",
            "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
            "processor": "Qualcomm Snapdragon 8 Gen 3 for Galaxy",
            "ram": "12 GB LPDDR5X",
            "storage": "256 GB UFS 4.0",
            "display": "6.8 inch Dynamic AMOLED 2X QHD+ 120Hz",
            "battery": "5000 mAh (45W Super Fast Charging)",
            "camera": "200MP Main + 50MP 5x Telephoto + 10MP 3x Telephoto + 12MP Ultra-Wide",
            "charging": "45W Fast Wired, 15W Wireless",
            "operating_system": "Android 14, One UI 6.1",
            "warranty": "1 Year Manufacturer Warranty",
            "sellers": {"Amazon": 129999, "Flipkart": 128499, "Reliance Digital": 130500, "Croma": 129999},
            "history": [139999, 137999, 135999, 134999, 132999, 131999, 130999, 129999, 129999, 130200, 129999, 129999]
        },
        {
            "name": "OnePlus 12 5G",
            "brand": "OnePlus",
            "category": "Mobiles",
            "price": 64999,
            "rating": 4.6,
            "description": "Smooth Beyond Belief with Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, and 100W SUPERVOOC charging.",
            "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
            "processor": "Snapdragon 8 Gen 3 Mobile Platform",
            "ram": "12 GB LPDDR5X",
            "storage": "256 GB UFS 4.0",
            "display": "6.82 inch ProXDR 2K 120Hz LTPO AMOLED",
            "battery": "5400 mAh Dual-cell",
            "camera": "50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultra-wide",
            "charging": "100W Wired SUPERVOOC, 50W AIRVOOC Wireless",
            "operating_system": "OxygenOS 14 based on Android 14",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 64999, "Flipkart": 63999, "Reliance Digital": 64999, "Croma": 65499},
            "history": [69999, 68999, 67999, 66999, 65999, 66500, 65500, 64999, 64999, 65200, 64999, 64999]
        },
        {
            "name": "Google Pixel 8 5G",
            "brand": "Google",
            "category": "Mobiles",
            "price": 54999,
            "rating": 4.5,
            "description": "The helpful phone engineered by Google with Tensor G3 chip, advanced AI photography, and 7 years of OS updates.",
            "image": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
            "processor": "Google Tensor G3 (Titan M2 security)",
            "ram": "8 GB LPDDR5X",
            "storage": "128 GB UFS 3.1",
            "display": "6.2 inch Actua OLED Display 120Hz",
            "battery": "4575 mAh (27W Fast Charging)",
            "camera": "50MP Octa PD Main + 12MP Ultra-Wide",
            "charging": "27W Wired, 18W Qi Wireless",
            "operating_system": "Android 14 Stock",
            "warranty": "1 Year Official Warranty",
            "sellers": {"Amazon": 54999, "Flipkart": 52999, "Reliance Digital": 55499, "Croma": 54999},
            "history": [75999, 72999, 68999, 64999, 59999, 57999, 56999, 55999, 54999, 54999, 53999, 54999]
        },
        {
            "name": "Xiaomi 14 Ultra 5G",
            "brand": "Xiaomi",
            "category": "Mobiles",
            "price": 99999,
            "rating": 4.7,
            "description": "Leica Quad Camera flagship powered by Snapdragon 8 Gen 3, 1-inch Sony LYT-900 sensor, and 90W HyperCharge.",
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
            "processor": "Snapdragon 8 Gen 3 (4nm)",
            "ram": "16 GB LPDDR5X",
            "storage": "512 GB UFS 4.0",
            "display": "6.73 inch WQHD+ 120Hz AMOLED LTPO",
            "battery": "5000 mAh (90W HyperCharge)",
            "camera": "50MP 1-inch Leica Main + 50MP 3.2x Tele + 50MP 5x Periscope + 50MP Ultra-Wide",
            "charging": "90W Wired, 80W Wireless",
            "operating_system": "Xiaomi HyperOS based on Android 14",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 99999, "Flipkart": 98999, "Reliance Digital": 99999, "Croma": 100999},
            "history": [109999, 107999, 105999, 103999, 101999, 100999, 99999, 99999, 99999, 99999, 99499, 99999]
        },

        # --- HEADPHONES ---
        {
            "name": "Sony WH-1000XM5 Wireless Headphones",
            "brand": "Sony",
            "category": "Headphones",
            "price": 26990,
            "rating": 4.8,
            "description": "Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality with 30-hr battery life.",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "driver": "30mm Precision Engineered Driver",
            "battery": "30 Hours ANC ON (40 Hours ANC OFF)",
            "anc": "Auto NC Optimizer Industry-Leading ANC",
            "connectivity": "Bluetooth 5.2, LDAC, Multi-point Connection",
            "weight": "250g Ultra-lightweight",
            "charging": "USB-PD Quick Charge (3 mins = 3 hrs play)",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 26990, "Flipkart": 25990, "Reliance Digital": 27490, "Croma": 26990},
            "history": [34990, 32990, 31990, 29990, 28990, 28500, 27990, 27490, 26990, 26990, 26490, 26990]
        },
        {
            "name": "Bose QuietComfort Ultra Headphones",
            "brand": "Bose",
            "category": "Headphones",
            "price": 35900,
            "rating": 4.7,
            "description": "Breakthrough spatialized audio for more immersive listening with world-class noise cancellation and CustomTune tech.",
            "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
            "driver": "Bose Custom Acoustic Architecture",
            "battery": "24 Hours Battery Life (18 Hours Immersive Audio)",
            "anc": "Quiet Mode, Aware Mode, Immersion Mode",
            "connectivity": "Bluetooth 5.3, Snapdragon Sound",
            "weight": "252g",
            "charging": "USB-C (15 mins = 2 hrs play)",
            "warranty": "1 Year Bose India Warranty",
            "sellers": {"Amazon": 35900, "Flipkart": 34900, "Reliance Digital": 35900, "Croma": 36500},
            "history": [39900, 38900, 37900, 36900, 36500, 36200, 35900, 35900, 35900, 35900, 35400, 35900]
        },
        {
            "name": "JBL Tune 770NC Wireless ANC Headphones",
            "brand": "JBL",
            "category": "Headphones",
            "price": 6499,
            "rating": 4.4,
            "description": "Adaptive Noise Cancelling wireless over-ear headphones with JBL Pure Bass Sound and massive 70-hour battery life.",
            "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
            "driver": "40mm Dynamic Driver",
            "battery": "70 Hours (44 Hours with ANC)",
            "anc": "Adaptive Noise Cancelling with Smart Ambient",
            "connectivity": "Bluetooth 5.3 LE Audio",
            "weight": "232g",
            "charging": "USB-C Speed Charge (5 mins = 3 hrs play)",
            "warranty": "1 Year JBL Warranty",
            "sellers": {"Amazon": 6499, "Flipkart": 6299, "Reliance Digital": 6599, "Croma": 6499},
            "history": [7999, 7499, 7299, 6999, 6799, 6699, 6599, 6499, 6499, 6550, 6499, 6499]
        },
        {
            "name": "OnePlus Buds Pro 2 TWS Earbuds",
            "brand": "OnePlus",
            "category": "Headphones",
            "price": 11999,
            "rating": 4.6,
            "description": "Co-created with Dynaudio, MelodyBoost Dual Drivers, 48dB Smart Adaptive Noise Cancellation, and Spatial Audio.",
            "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
            "driver": "11mm + 6mm Dual Drivers",
            "battery": "39 Hours Total (Case + Earbuds)",
            "anc": "Up to 48dB Smart Adaptive ANC",
            "connectivity": "Bluetooth 5.3, LHDC 5.0",
            "weight": "4.9g per earbud",
            "charging": "Fast Charge (10 mins = 10 hrs play)",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 11999, "Flipkart": 11499, "Reliance Digital": 11999, "Croma": 12499},
            "history": [13999, 13499, 12999, 12499, 12199, 11999, 11999, 11999, 11999, 12100, 11999, 11999]
        },
        {
            "name": "boAt Nirvana 751 ANC Headphones",
            "brand": "boAt",
            "category": "Headphones",
            "price": 3999,
            "rating": 4.3,
            "description": "Hybrid Active Noise Cancellation wireless over-ear headphones with 40mm drivers and up to 65 hours playback.",
            "image": "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=800&q=80",
            "driver": "40mm High-Def Drivers",
            "battery": "65 Hours (54 Hours with ANC)",
            "anc": "Hybrid ANC up to 33dB",
            "connectivity": "Bluetooth 5.0, AUX Mode",
            "weight": "260g",
            "charging": "ASAP Charge (10 mins = 10 hrs play)",
            "warranty": "1 Year boAt Warranty",
            "sellers": {"Amazon": 3999, "Flipkart": 3799, "Reliance Digital": 3999, "Croma": 4199},
            "history": [4999, 4699, 4499, 4299, 4199, 4099, 3999, 3999, 3999, 4050, 3999, 3999]
        },

        # --- SMART WATCHES ---
        {
            "name": "Apple Watch Series 9 GPS",
            "brand": "Apple",
            "category": "Smart Watches",
            "price": 41900,
            "rating": 4.7,
            "description": "S9 SiP enables double tap gesture, brighter display, faster on-device Siri, and advanced health sensors.",
            "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
            "display": "45mm Always-On Retina Display (up to 2000 nits)",
            "battery": "18 Hours Normal Use (36 Hours Low Power Mode)",
            "sensors": "ECG, Blood Oxygen, Heart Rate, Temperature, Crash Detection",
            "water_resistance": "50m Water Resistant (Swimproof)",
            "compatibility": "iOS (Requires iPhone XS or later)",
            "operating_system": "watchOS 10",
            "warranty": "1 Year Apple Warranty",
            "sellers": {"Amazon": 41900, "Flipkart": 40900, "Reliance Digital": 41900, "Croma": 42490},
            "history": [44900, 44900, 43900, 43500, 42900, 42500, 42100, 41900, 41900, 41900, 41400, 41900]
        },
        {
            "name": "Samsung Galaxy Watch 6 Classic",
            "brand": "Samsung",
            "category": "Smart Watches",
            "price": 32999,
            "rating": 4.6,
            "description": "Timeless iconic rotating bezel with 30% larger screen, personalized sleep coaching, and BIA body composition scanner.",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "display": "1.5 inch Super AMOLED Sapphire Crystal Display",
            "battery": "425 mAh (up to 40 hours)",
            "sensors": "BioActive Sensor (ECG, BIA, HR), Temperature, Infrared",
            "water_resistance": "5ATM + IP68 / MIL-STD-810H",
            "compatibility": "Android 10.0 or higher",
            "operating_system": "Wear OS Powered by Samsung",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 32999, "Flipkart": 31999, "Reliance Digital": 33500, "Croma": 32999},
            "history": [38999, 37999, 36999, 35999, 34999, 34500, 33999, 33499, 32999, 32999, 32499, 32999]
        },
        {
            "name": "Garmin Forerunner 265 GPS",
            "brand": "Garmin",
            "category": "Smart Watches",
            "price": 50490,
            "rating": 4.8,
            "description": "Dedicated running and multisport smartwatch with colorful AMOLED display, training readiness metrics, and 13-day battery life.",
            "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
            "display": "1.3 inch AMOLED Touchscreen (416x416)",
            "battery": "Up to 13 Days in Smartwatch Mode (20 Hours GPS)",
            "sensors": "Elevate HR, Pulse Ox, Barometric Altimeter, Compass, Gyroscope",
            "water_resistance": "5 ATM Water Rating",
            "compatibility": "Android & iOS Compatible",
            "operating_system": "Garmin OS",
            "warranty": "1 Year Official Garmin Warranty",
            "sellers": {"Amazon": 50490, "Flipkart": 49990, "Reliance Digital": 50990, "Croma": 50490},
            "history": [55990, 54990, 53990, 52990, 51990, 51490, 50990, 50490, 50490, 50800, 50490, 50490]
        },
        {
            "name": "Amazfit GTR 4 Smart Watch",
            "brand": "Amazfit",
            "category": "Smart Watches",
            "price": 16999,
            "rating": 4.5,
            "description": "Dual-band circular polarized GPS tracking, 150+ sports modes, BioTracker 4.0 health sensor, and 14-day battery power.",
            "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
            "display": "1.43 inch HD AMOLED Display (466x466)",
            "battery": "475 mAh (up to 14 days typical usage)",
            "sensors": "BioTracker 4.0 PPG, Acceleration, Gyroscope, Geomagnetic",
            "water_resistance": "5 ATM Water Resistance",
            "compatibility": "Android 7.0 & iOS 12.0 or above",
            "operating_system": "Zepp OS 2.0",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 16999, "Flipkart": 16499, "Reliance Digital": 16999, "Croma": 17499},
            "history": [18999, 18499, 17999, 17499, 17199, 16999, 16999, 16999, 16999, 17100, 16999, 16999]
        },
        {
            "name": "Noise ColorFit Pro 5 Smartwatch",
            "brand": "Noise",
            "category": "Smart Watches",
            "price": 3499,
            "rating": 4.3,
            "description": "Feature-packed budget smartwatch with 1.85-inch AMOLED display, Bluetooth calling, SOS feature, and Noise Health Suite.",
            "image": "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
            "display": "1.85 inch AMOLED Display (60Hz Refresh)",
            "battery": "300 mAh (up to 7 days typical)",
            "sensors": "Heart Rate, SpO2, Sleep Tracker, Step Counter",
            "water_resistance": "IP68 Water & Dust Resistant",
            "compatibility": "Android & iOS (NoiseFit App)",
            "operating_system": "Noise OS",
            "warranty": "1 Year Noise Warranty",
            "sellers": {"Amazon": 3499, "Flipkart": 3299, "Reliance Digital": 3499, "Croma": 3699},
            "history": [4499, 4199, 3999, 3799, 3699, 3599, 3499, 3499, 3499, 3550, 3499, 3499]
        },

        # --- TABLETS ---
        {
            "name": "Apple iPad Air M2 (11-inch)",
            "brand": "Apple",
            "category": "Tablets",
            "price": 59900,
            "rating": 4.8,
            "description": "Freshly redesigned 11-inch iPad Air supercharged by the Apple M2 chip with Liquid Retina display and Wi-Fi 6E.",
            "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
            "processor": "Apple M2 Chip (8-core CPU, 10-core GPU)",
            "ram": "8 GB RAM",
            "storage": "128 GB Storage",
            "display": "11 inch Liquid Retina LED Backlit Multi-Touch",
            "battery": "28.93 Wh rechargeable lithium-polymer (Up to 10 hrs)",
            "camera": "12MP Wide back camera, 12MP Ultra Wide front",
            "operating_system": "iPadOS 17",
            "warranty": "1 Year Apple Warranty",
            "sellers": {"Amazon": 59900, "Flipkart": 58900, "Reliance Digital": 59900, "Croma": 60500},
            "history": [64900, 63900, 62900, 61900, 60900, 60500, 59900, 59900, 59900, 59900, 59400, 59900]
        },
        {
            "name": "Samsung Galaxy Tab S9 Ultra",
            "brand": "Samsung",
            "category": "Tablets",
            "price": 108999,
            "rating": 4.7,
            "description": "Massive 14.6 inch Dynamic AMOLED 2X display, IP68 water resistance, included S Pen, and Snapdragon 8 Gen 2 power.",
            "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
            "processor": "Qualcomm Snapdragon 8 Gen 2 for Galaxy",
            "ram": "12 GB RAM",
            "storage": "256 GB Expandable up to 1TB",
            "display": "14.6 inch Dynamic AMOLED 2X 120Hz HDR10+",
            "battery": "11200 mAh (45W Fast Charging)",
            "camera": "13MP + 8MP Dual Back, 12MP + 12MP Dual Front",
            "operating_system": "Android 13, One UI 5.1",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 108999, "Flipkart": 107499, "Reliance Digital": 109999, "Croma": 108999},
            "history": [119999, 117999, 115999, 114999, 112999, 111500, 110999, 109999, 108999, 108999, 107999, 108999]
        },
        {
            "name": "OnePlus Pad 2 Tablet",
            "brand": "OnePlus",
            "category": "Tablets",
            "price": 39999,
            "rating": 4.6,
            "description": "Powerful Productivity Tablet with Snapdragon 8 Gen 3, 3K 144Hz 7:5 ReadFit display, and 67W SUPERVOOC charging.",
            "image": "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80",
            "processor": "Snapdragon 8 Gen 3 Mobile Platform",
            "ram": "12 GB LPDDR5X",
            "storage": "256 GB UFS 3.1",
            "display": "12.1 inch 3K (3000x2120) 144Hz LCD",
            "battery": "9510 mAh (67W SUPERVOOC Charge)",
            "camera": "13MP Rear Camera, 8MP Front Camera",
            "operating_system": "OxygenOS 14.1 for Pad",
            "warranty": "1 Year OnePlus Warranty",
            "sellers": {"Amazon": 39999, "Flipkart": 38999, "Reliance Digital": 39999, "Croma": 40499},
            "history": [44999, 43999, 42999, 41999, 40999, 40499, 39999, 39999, 39999, 40200, 39999, 39999]
        },
        {
            "name": "Lenovo Tab P12 Pro",
            "brand": "Lenovo",
            "category": "Tablets",
            "price": 49999,
            "rating": 4.5,
            "description": "Entertainment and work power tablet with 12.6-inch 2K AMOLED 120Hz display, JBL Quad Speakers, and Lenovo Precision Pen 3.",
            "image": "https://images.unsplash.com/photo-1527698266440-12104e498b76?auto=format&fit=crop&w=800&q=80",
            "processor": "Qualcomm Snapdragon 870 Octa-Core",
            "ram": "8 GB LPDDR5",
            "storage": "256 GB UFS 3.1",
            "display": "12.6 inch 2K (2560x1600) AMOLED 120Hz",
            "battery": "10200 mAh (Quick Charge 4.0)",
            "camera": "13MP Wide + 5MP Ultra-Wide, 8MP Front",
            "operating_system": "Android 12 (Upgradable)",
            "warranty": "1 Year Lenovo Warranty",
            "sellers": {"Amazon": 49999, "Flipkart": 48999, "Reliance Digital": 49999, "Croma": 50999},
            "history": [54999, 53999, 52999, 51999, 50999, 50499, 49999, 49999, 49999, 50200, 49999, 49999]
        },
        {
            "name": "Xiaomi Pad 6 Tablet",
            "brand": "Xiaomi",
            "category": "Tablets",
            "price": 26999,
            "rating": 4.6,
            "description": "Best-in-class entertainment tablet with Snapdragon 870, 11-inch 2.8K 144Hz display, and Quad Speakers with Dolby Atmos.",
            "image": "https://images.unsplash.com/photo-1623126908029-58da08825869?auto=format&fit=crop&w=800&q=80",
            "processor": "Snapdragon 870 7nm Octa-Core",
            "ram": "8 GB LPDDR5",
            "storage": "256 GB UFS 3.1",
            "display": "11 inch 2.8K (2880x1800) 144Hz IPS",
            "battery": "8840 mAh (33W Fast Charging)",
            "camera": "13MP Rear, 8MP FocusFrame Front",
            "operating_system": "MIUI Pad 14 based on Android 13",
            "warranty": "1 Year Brand Warranty",
            "sellers": {"Amazon": 26999, "Flipkart": 25999, "Reliance Digital": 26999, "Croma": 27499},
            "history": [29999, 28999, 28499, 27999, 27499, 27199, 26999, 26999, 26999, 27100, 26999, 26999]
        }
    ]

    months_list = [
        "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026",
        "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026"
    ]

    for p in products_data:
        cursor.execute('''
            INSERT INTO products (
                name, brand, category, price, rating, description, image,
                processor, ram, storage, gpu, battery, display, refresh_rate,
                operating_system, warranty, camera, charging, sensors, driver,
                anc, connectivity, weight, water_resistance, compatibility
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p["name"], p["brand"], p["category"], p["price"], p["rating"], p["description"], p["image"],
            p.get("processor"), p.get("ram"), p.get("storage"), p.get("gpu"), p.get("battery"),
            p.get("display"), p.get("refresh_rate"), p.get("operating_system"), p.get("warranty"),
            p.get("camera"), p.get("charging"), p.get("sensors"), p.get("driver"),
            p.get("anc"), p.get("connectivity"), p.get("weight"), p.get("water_resistance"), p.get("compatibility")
        ))
        product_id = cursor.lastrowid

        # Insert 12-month price history
        for i, hist_price in enumerate(p["history"]):
            cursor.execute(
                "INSERT INTO price_history (product_id, month, price) VALUES (?, ?, ?)",
                (product_id, months_list[i], hist_price)
            )

        # Insert seller prices
        for seller_name, seller_price in p["sellers"].items():
            s_id = seller_ids[seller_name]
            p_url = f"https://www.{seller_name.lower().replace(' ', '')}.in/search?q={p['name'].replace(' ', '+')}"
            cursor.execute(
                "INSERT INTO product_sellers (product_id, seller_id, price, product_url) VALUES (?, ?, ?, ?)",
                (product_id, s_id, seller_price, p_url)
            )

    conn.commit()
    conn.close()
    print("Database successfully seeded with 25 realistic products across exactly 5 categories!")

if __name__ == '__main__':
    seed_database()
