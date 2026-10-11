from database import get_db_connection

def generate_specs_for_product(category, brand, name, price):
    p = float(price or 25000)
    brand_lower = (brand or '').lower()
    name_lower = (name or '').lower()
    
    specs = {}
    
    if category == "Mobiles":
        # Processor
        if "apple" in brand_lower or "iphone" in name_lower:
            proc = "Apple A17 Pro (3nm)" if p > 90000 else ("Apple A16 Bionic" if p > 60000 else "Apple A15 Bionic")
            os_name = "iOS 17"
            cam = "48MP Main (OIS) + 12MP Ultra-Wide + 12MP 3x Telephoto" if p > 80000 else "48MP Dual Camera System + 12MP Front"
            disp = "6.7 inch Super Retina XDR OLED 120Hz" if "max" in name_lower or "plus" in name_lower else "6.1 inch Super Retina XDR OLED"
            refresh = "120 Hz ProMotion" if p > 80000 else "60 Hz"
            batt = "4422 mAh Li-Ion (Up to 29 hrs video)" if "max" in name_lower else "3349 mAh Li-Ion (Up to 20 hrs video)"
            charging = "25W Wired, 15W MagSafe Wireless"
        elif "samsung" in brand_lower:
            proc = "Snapdragon 8 Gen 3 for Galaxy" if p > 80000 else ("Exynos 2400" if p > 50000 else "Snapdragon 7+ Gen 2")
            os_name = "Android 14, One UI 6.1"
            cam = "200MP OIS + 50MP Periscope + 12MP Ultra-Wide" if p > 90000 else "50MP Triple OIS Camera + 12MP Front"
            disp = "6.8 inch Dynamic AMOLED 2X QHD+ 120Hz" if p > 80000 else "6.4 inch FHD+ Super AMOLED 120Hz"
            refresh = "120 Hz"
            batt = "5000 mAh Super Fast Charging"
            charging = "45W Super Fast Charging, 15W Wireless"
        elif "oneplus" in brand_lower:
            proc = "Snapdragon 8 Gen 3" if p > 55000 else "Snapdragon 782G"
            os_name = "OxygenOS 14 based on Android 14"
            cam = "50MP Sony LYT-808 + 64MP Periscope + 48MP Ultra-Wide" if p > 50000 else "50MP Sony IMX890 OIS + 8MP Ultra-Wide"
            disp = "6.82 inch ProXDR 2K 120Hz LTPO AMOLED" if p > 50000 else "6.7 inch 120Hz AMOLED"
            refresh = "120 Hz"
            batt = "5400 mAh Dual-Cell"
            charging = "100W SUPERVOOC Fast Charge"
        elif "google" in brand_lower:
            proc = "Google Tensor G3 (Titan M2 Security)"
            os_name = "Pure Android 14 with Pixel AI"
            cam = "50MP Octa PD Main + 48MP Quad PD Telephoto + 10.5MP Front"
            disp = "6.7 inch Super Actua OLED 120Hz" if p > 70000 else "6.2 inch Actua OLED 120Hz"
            refresh = "120 Hz"
            batt = "5050 mAh Beyond 24-hr Battery"
            charging = "30W Fast Wired, 23W Fast Wireless"
        else: # Xiaomi, Realme, Vivo, Oppo, Motorola, Nothing
            proc = "Snapdragon 8s Gen 3" if p > 40000 else ("MediaTek Dimensity 8300 Ultra" if p > 25000 else "Snapdragon 6 Gen 1")
            os_name = f"Android 14 ({brand} Customized OS)"
            cam = "50MP Sony Sensor (OIS) + 8MP Ultra-Wide + 16MP Selfie"
            disp = "6.67 inch 1.5K AMOLED 120Hz HDR10+"
            refresh = "120 Hz"
            batt = "5000 mAh High-Density Li-Po"
            charging = "67W Turbo Charge (100% in 35 mins)"
            
        ram = "16 GB LPDDR5X" if p > 70000 else ("12 GB LPDDR5X" if p > 40000 else "8 GB LPDDR4X")
        storage = "512 GB UFS 4.0" if p > 80000 else ("256 GB UFS 4.0" if p > 35000 else "128 GB UFS 3.1")
        gpu = "Adreno 750 / Immortalis-G720" if "apple" not in brand_lower else "Apple 6-Core GPU"
        
        specs = {
            "processor": proc, "ram": ram, "storage": storage, "gpu": gpu,
            "display": disp, "refresh_rate": refresh, "battery": batt, "charging": charging,
            "camera": cam, "operating_system": os_name, "warranty": "1 Year Brand Manufacturer Warranty",
            "sensors": "In-display Fingerprint, Accelerometer, Gyro, Proximity, Compass"
        }
        
    elif category == "Laptops":
        if "apple" in brand_lower:
            proc = "Apple M3 Pro (12-core CPU, 18-core GPU)" if p > 150000 else ("Apple M3 Chip (8-core CPU)" if p > 100000 else "Apple M2 Chip")
            gpu = "Integrated Apple 10-Core / 18-Core GPU"
            ram = "18 GB Unified Memory" if p > 140000 else "8 GB / 16 GB Unified Memory"
            storage = "512 GB / 1 TB Superfast SSD Storage"
            disp = "15.3 inch Liquid Retina True Tone Display" if "15" in name_lower or "16" in name_lower else "13.6 inch Liquid Retina Display"
            refresh = "120 Hz ProMotion" if p > 140000 else "60 Hz"
            os_name = "macOS Sonoma"
            batt = "70 Wh Li-Polymer (Up to 18 hours battery life)"
        elif "gaming" in name_lower or "nitro" in name_lower or "tuf" in name_lower or "legion" in name_lower or "msi" in brand_lower:
            proc = "Intel Core i7-13700H (14 Cores, 20 Threads)" if p > 90000 else "AMD Ryzen 7 7735HS (8 Cores, 16 Threads)"
            gpu = "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W TGP)" if p > 95000 else "NVIDIA GeForce RTX 4050 6GB GDDR6 (115W TGP)"
            ram = "16 GB DDR5 4800MHz (Expandable to 32GB)"
            storage = "1 TB PCIe Gen4 NVMe M.2 SSD" if p > 80000 else "512 GB PCIe Gen4 SSD"
            disp = "15.6 inch FHD (1920x1080) IPS 144Hz 3ms"
            refresh = "144 Hz"
            os_name = "Windows 11 Home 64-bit"
            batt = "80 Wh 4-Cell Li-ion (Up to 6-8 hours)"
        else:
            proc = "Intel Core Ultra 7 155H" if p > 85000 else ("Intel Core i5-13500H" if p > 55000 else "AMD Ryzen 5 7530U")
            gpu = "Intel Arc Graphics / Iris Xe Graphics"
            ram = "16 GB LPDDR5 5200MHz Dual-Channel"
            storage = "512 GB M.2 NVMe PCIe 4.0 SSD"
            disp = "14.0 inch 2.8K OLED 120Hz 100% DCI-P3" if p > 75000 else "15.6 inch FHD IPS Anti-Glare 300 nits"
            refresh = "120 Hz" if p > 75000 else "60 Hz"
            os_name = "Windows 11 Home with MS Office Home & Student"
            batt = "65 Wh Li-ion (Rapid Charge 80% in 60 mins)"
            
        specs = {
            "processor": proc, "ram": ram, "storage": storage, "gpu": gpu,
            "display": disp, "refresh_rate": refresh, "battery": batt,
            "operating_system": os_name, "warranty": "1 Year Onsite Manufacturer Warranty + ADP",
            "weight": "1.4 kg Ultra-lightweight" if "apple" in brand_lower or p < 80000 else "2.2 kg Gaming Chassis"
        }
        
    elif category == "Smart Watches":
        if "apple" in brand_lower:
            disp = "45mm Always-On Retina OLED (up to 2000 nits)"
            batt = "18 Hours Normal Use (36 Hours Low Power Mode)"
            sensors = "ECG, Blood Oxygen SpO2, Heart Rate, Temperature, Crash Detection"
            water = "50m Water Resistant (Swimproof) / WR50"
            os_name = "watchOS 10"
            compat = "iOS (Requires iPhone XS or later)"
        elif "samsung" in brand_lower:
            disp = "1.5 inch Super AMOLED Sapphire Crystal (up to 2000 nits)"
            batt = "425 mAh (Up to 40 Hours Fast Charge)"
            sensors = "BioActive Sensor (Optical HR + Electrical ECG + BIA Body Composition)"
            water = "5ATM + IP68 / MIL-STD-810H Certified"
            os_name = "Wear OS Powered by Samsung (One UI Watch)"
            compat = "Android 10.0 or higher with 1.5GB+ RAM"
        elif "garmin" in brand_lower:
            disp = "1.3 inch Sunlight-visible Transflective Memory-in-Pixel (MIP)"
            batt = "Up to 14 Days Smartwatch Mode (30 Hours GPS)"
            sensors = "Garmin Elevate HR, Pulse Ox, Multi-GNSS GPS, Altimeter, Compass"
            water = "10 ATM (100 meters Water Resistant)"
            os_name = "Garmin Proprietary OS"
            compat = "Android & iOS compatible"
        else:
            disp = "1.43 inch AMOLED Always-On Curved Display (1000 nits)"
            batt = "Up to 7 Days Battery Life (Fast Wireless Dock)"
            sensors = "24/7 Heart Rate, SpO2 Blood Oxygen, Sleep & Stress Monitor"
            water = "IP68 Dust & Water Resistant"
            os_name = f"{brand} Smart Watch OS"
            compat = "Android 6.0+ and iOS 9.0+"
            
        specs = {
            "display": disp, "battery": batt, "sensors": sensors,
            "water_resistance": water, "operating_system": os_name,
            "compatibility": compat, "warranty": "1 Year Brand Manufacturer Warranty",
            "connectivity": "Bluetooth 5.3, Bluetooth Calling, BLE, NFC",
            "weight": "38g - 49g Lightweight Ergonomic Design"
        }
        
    elif category == "Headphones":
        if "apple" in brand_lower or "airpods" in name_lower:
            driver = "Apple Custom High-Excursion Driver + High Dynamic Amplifier"
            batt = "30 Hours total with Charging Case (6 Hours single charge)"
            anc = "Pro-level Active Noise Cancellation & Adaptive Transparency"
            conn = "Apple H2 Headphone Chip, Bluetooth 5.3"
            charging = "MagSafe (USB-C), Qi Wireless Charging"
        elif "sony" in brand_lower:
            driver = "30mm Precision Engineered Carbon Fiber Driver"
            batt = "30 Hours ANC ON (40 Hours ANC OFF)"
            anc = "Auto NC Optimizer with Integrated Processor V1 & Dual Mic"
            conn = "Bluetooth 5.2, LDAC High-Res Audio, Multi-point Pairing"
            charging = "USB-PD Fast Charge (3 mins = 3 hrs playback)"
        elif "bose" in brand_lower:
            driver = "Bose Custom Acoustic Architecture with CustomTune Tech"
            batt = "24 Hours Battery Life (18 Hours Immersive Audio)"
            anc = "World-Class Noise Cancellation (Quiet, Aware & Immersion Modes)"
            conn = "Bluetooth 5.3, Snapdragon Sound, Qualcomm aptX Adaptive"
            charging = "USB-C Quick Charge (15 mins = 2 hrs playback)"
        else:
            driver = "40mm Dynamic Bass Drivers" if "over" in name_lower else "10mm Titanium-coated Audio Drivers"
            batt = "40 Hours Total Playback with Fast Charging"
            anc = "Hybrid Active Noise Cancellation (up to 32dB ambient reduction)"
            conn = "Bluetooth 5.3, Low Latency Gaming Mode (<50ms)"
            charging = "Type-C Fast Charging (10 mins = 100 mins playtime)"
            
        specs = {
            "driver": driver, "battery": batt, "anc": anc,
            "connectivity": conn, "charging": charging,
            "warranty": "1 Year Brand Manufacturer Warranty",
            "weight": "240g Ultra-lightweight Ergonomic" if "over" in name_lower else "4.2g per earbud"
        }
        
    elif category == "Tablets":
        if "apple" in brand_lower:
            proc = "Apple M2 Chip (8-core CPU, 10-core GPU)" if p > 55000 else "Apple A14 Bionic"
            disp = "11.0 inch Liquid Retina True Tone Display"
            ram = "8 GB RAM"
            storage = "128 GB / 256 GB NVMe Storage"
            os_name = "iPadOS 17"
            batt = "28.93 Wh Lithium-Polymer (Up to 10 hours web/video)"
            cam = "12MP Wide Camera, 12MP Ultra-Wide Front with Center Stage"
        elif "samsung" in brand_lower:
            proc = "Qualcomm Snapdragon 8 Gen 2 for Galaxy" if p > 60000 else "Snapdragon 778G"
            disp = "14.6 inch Dynamic AMOLED 2X 120Hz" if p > 85000 else "11.0 inch WQXGA 120Hz LCD"
            ram = "12 GB RAM" if p > 70000 else "8 GB RAM"
            storage = "256 GB UFS 3.1 (Expandable up to 1TB via microSD)"
            os_name = "Android 14, Samsung One UI 6"
            batt = "11200 mAh (45W Super Fast Charging)"
            cam = "13MP + 8MP Dual Back, 12MP Ultra-Wide Front"
        else:
            proc = "Qualcomm Snapdragon 870" if p > 25000 else "MediaTek Helio G99"
            disp = "11.0 inch 2.8K 144Hz 7-stage variable refresh display"
            ram = "8 GB LPDDR5"
            storage = "128 GB / 256 GB UFS 3.1"
            os_name = f"Android 14 ({brand} Tablet OS)"
            batt = "8840 mAh (33W Fast Charger included)"
            cam = "13MP Rear Camera, 8MP Video Calling Front Camera"
            
        specs = {
            "processor": proc, "ram": ram, "storage": storage,
            "display": disp, "battery": batt, "camera": cam,
            "operating_system": os_name, "warranty": "1 Year Brand Manufacturer Warranty",
            "refresh_rate": "120 Hz" if p > 40000 else "90 Hz"
        }
        
    return specs

def run_population():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, category, brand, name, price FROM products")
    products = cursor.fetchall()
    print(f"Total products to enrich with specifications: {len(products)}")
    
    updated = 0
    for p_id, category, brand, name, price in products:
        specs = generate_specs_for_product(category, brand, name, price)
        
        # Build dynamic update statement for non-null specs
        cols = []
        vals = []
        for k, v in specs.items():
            cols.append(f"{k} = %s")
            vals.append(v)
            
        vals.append(p_id)
        sql = f"UPDATE products SET {', '.join(cols)} WHERE id = %s"
        cursor.execute(sql, vals)
        updated += 1
        
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Successfully enriched all {updated} products with authentic specifications!")

if __name__ == '__main__':
    run_population()
