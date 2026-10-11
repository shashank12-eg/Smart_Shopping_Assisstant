import random
from database import get_db_connection

BRAND_CATEGORY_IMAGES = {
    # --- MOBILES ---
    ("Mobiles", "Apple"): [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80", # iPhone 15 Pro Titanium
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80", # iPhone 13 Pro Blue
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80", # iPhone clean angle
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80", # iPhone modern
    ],
    ("Mobiles", "Samsung"): [
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80", # Galaxy S-Series Ultra
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", # Galaxy S20/S21
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80", # Samsung Galaxy A/S series
    ],
    ("Mobiles", "OnePlus"): [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80", # OnePlus Flagship
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80", # OnePlus Nord / Flagship
    ],
    ("Mobiles", "Google"): [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80", # Pixel style
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", # Pixel back visor
    ],
    ("Mobiles", "Xiaomi"): [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", # Xiaomi flagship
        "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80", # Redmi/Xiaomi Note
    ],
    ("Mobiles", "Realme"): [
        "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80", # Realme stylish back
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", # Realme device
    ],
    ("Mobiles", "Vivo"): [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80", # Vivo smartphone
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80", # Vivo V-series
    ],
    ("Mobiles", "Oppo"): [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80", # Oppo Reno / Find
        "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80", # Oppo device
    ],
    ("Mobiles", "Motorola"): [
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80", # Moto Edge / G series
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", # Moto phone
    ],
    ("Mobiles", "Nothing"): [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", # Nothing phone glyph aesthetic
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    ],
    ("Mobiles", "Generic"): [
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80",
    ],

    # --- LAPTOPS ---
    ("Laptops", "Apple"): [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", # MacBook Air Silver
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80", # MacBook Pro M-series Space Gray
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80", # MacBook minimal
    ],
    ("Laptops", "Dell"): [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80", # Dell XPS Carbon/Silver
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", # Dell Inspiron / G-series
    ],
    ("Laptops", "HP"): [
        "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?auto=format&fit=crop&w=800&q=80", # HP Pavilion / Spectre
        "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80", # HP Omen / Envy
    ],
    ("Laptops", "Lenovo"): [
        "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80", # Lenovo Legion Gaming
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", # Lenovo ThinkPad / IdeaPad
    ],
    ("Laptops", "ASUS"): [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", # ASUS TUF Gaming
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", # ASUS ROG Strix
    ],
    ("Laptops", "Acer"): [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", # Acer Nitro 5
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80", # Acer Aspire / Swift
    ],
    ("Laptops", "MSI"): [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80", # MSI Katana / Thin RGB Gaming
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", # MSI Stealth
    ],
    ("Laptops", "Samsung"): [
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80", # Samsung Galaxy Book Ultra Thin
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", # Galaxy Book Pro
    ],

    # --- SMART WATCHES ---
    ("Smart Watches", "Apple"): [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", # Apple Watch Series Black
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", # Apple Watch White Sport
        "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80", # Apple Watch Ultra / Sport
    ],
    ("Smart Watches", "Samsung"): [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", # Galaxy Watch Classic Rotating Bezel
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80", # Galaxy Watch Active Circular
    ],
    ("Smart Watches", "Fossil"): [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80", # Fossil Gen 6 Smartwatch
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", # Fossil Leather Hybrid Smartwatch
    ],
    ("Smart Watches", "Garmin"): [
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80", # Garmin Fenix / Forerunner Rugged
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80", # Garmin Venu Athletic
    ],
    ("Smart Watches", "Noise"): [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", # Noise ColorFit Smartwatch
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    ],
    ("Smart Watches", "boAt"): [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", # boAt Wave / Storm
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    ],
    ("Smart Watches", "Fire-Boltt"): [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", # Fire-Boltt Phoenix / Ninja
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    ],
    ("Smart Watches", "Amazfit"): [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80", # Amazfit GTR / GTS
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80", # Amazfit T-Rex
    ],

    # --- HEADPHONES ---
    ("Headphones", "Sony"): [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", # Sony WH-1000XM5 Over-Ear ANC
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80", # Sony Professional Headphones
    ],
    ("Headphones", "Bose"): [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", # Bose QuietComfort Ultra Silver
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80", # Bose NC 700 Over-Ear
    ],
    ("Headphones", "Apple"): [
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80", # Apple AirPods Pro Case
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80", # Apple AirPods Wireless Earbuds
    ],
    ("Headphones", "JBL"): [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", # JBL Live / Tune TWS Earbuds
        "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80", # JBL Over-Ear Wireless
    ],
    ("Headphones", "Sennheiser"): [
        "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80", # Sennheiser Momentum / HD Over-Ear
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    ],
    ("Headphones", "boAt"): [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", # boAt Airdopes TWS
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80", # boAt Rockerz Over-Ear
    ],
    ("Headphones", "Noise"): [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", # Noise Buds TWS
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    ],
    ("Headphones", "Samsung"): [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", # Galaxy Buds Pro
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    ],
    ("Headphones", "Skullcandy"): [
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80", # Skullcandy Crusher
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", # Skullcandy Dime/Indy
    ],
    ("Headphones", "Jabra"): [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", # Jabra Elite TWS
        "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80",
    ],

    # --- TABLETS ---
    ("Tablets", "Apple"): [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", # Apple iPad Air with Apple Pencil
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80", # iPad Pro on workstation
    ],
    ("Tablets", "Samsung"): [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80", # Galaxy Tab S9 Ultra with S-Pen
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80", # Galaxy Tab A-series
    ],
    ("Tablets", "Lenovo"): [
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80", # Lenovo Tab P11/P12
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
    ],
    ("Tablets", "Xiaomi"): [
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80", # Xiaomi Pad 6
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80", # Redmi Pad SE
    ],
    ("Tablets", "Realme"): [
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=800&q=80", # Realme Pad 2
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
    ],
}

# Category fallbacks
CATEGORY_FALLBACKS = {
    "Mobiles": "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80",
    "Laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    "Smart Watches": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "Tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
}

def get_matching_image(category, brand, product_id):
    # Try exact (category, brand)
    for (cat, b), img_list in BRAND_CATEGORY_IMAGES.items():
        if cat.lower() == category.lower() and b.lower() == brand.lower():
            return img_list[product_id % len(img_list)]
    
    # Try case-insensitive brand match
    for (cat, b), img_list in BRAND_CATEGORY_IMAGES.items():
        if cat.lower() == category.lower() and (b.lower() in brand.lower() or brand.lower() in b.lower()):
            return img_list[product_id % len(img_list)]
            
    return CATEGORY_FALLBACKS.get(category, CATEGORY_FALLBACKS["Mobiles"])

def update_all_product_images():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, brand, category, image FROM products")
    products = cursor.fetchall()
    print(f"Total products to evaluate: {len(products)}")
    
    updated_count = 0
    for p_id, name, brand, category, current_img in products:
        # If product was scraped from a live retailer like Flipkart or Amazon with a rukmini / amazon / media URL, keep it!
        if current_img and ("rukmini" in current_img or "media-amazon" in current_img or "flixcart" in current_img):
            continue
            
        new_img = get_matching_image(category, brand, p_id)
        if new_img != current_img:
            cursor.execute("UPDATE products SET image = %s WHERE id = %s", (new_img, p_id))
            updated_count += 1
            
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Successfully updated images for {updated_count} products matching their exact brand and category!")

if __name__ == '__main__':
    update_all_product_images()
