import random
from database import get_db_connection

brands_mobiles = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Motorola", "Google", "Nothing"]
brands_laptops = ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Samsung"]
brands_watches = ["Apple", "Samsung", "Garmin", "Fossil", "Amazfit", "Noise", "boAt", "Fire-Boltt"]
brands_headphones = ["Sony", "Bose", "Sennheiser", "JBL", "Apple", "Samsung", "boAt", "Noise", "Jabra", "Skullcandy"]
brands_tablets = ["Apple", "Samsung", "Lenovo", "Xiaomi", "Realme"]

def generate_product_name(category, brand):
    if category == "Mobiles":
        series = random.choice(["Pro", "Max", "Ultra", "Plus", "Lite", "5G", "SE"])
        return f"{brand} Smartphone {random.randint(10, 99)} {series} {random.choice(['128GB', '256GB', '512GB'])}"
    elif category == "Laptops":
        series = random.choice(["Pro", "Air", "Book", "Gaming", "Studio", "Slim"])
        return f"{brand} Laptop {series} {random.choice(['13-inch', '14-inch', '15.6-inch', '16-inch'])} {random.choice(['i5', 'i7', 'i9', 'Ryzen 5', 'Ryzen 7', 'M2', 'M3'])}"
    elif category == "Smart Watches":
        series = random.choice(["Watch", "Band", "Fit", "Pro", "Active", "Classic"])
        return f"{brand} {series} {random.choice(['Gen 5', 'Gen 6', 'Series 8', 'Series 9', 'Ultra'])} {random.choice(['40mm', '44mm', '45mm', '49mm'])}"
    elif category == "Headphones":
        series = random.choice(["Air", "Pro", "Max", "Buds", "Pods", "Elite", "QuietComfort", "WH"])
        return f"{brand} {series} {random.randint(100, 900)} {random.choice(['Wireless', 'ANC', 'True Wireless', 'Over-Ear'])}"
    elif category == "Tablets":
        series = random.choice(["Pad", "Tab", "Air", "Pro", "Mini"])
        return f"{brand} {series} {random.choice(['10.9-inch', '11-inch', '12.9-inch', '8.3-inch'])} {random.choice(['Wi-Fi', '5G'])} {random.choice(['64GB', '128GB', '256GB'])}"

def run():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name FROM sellers")
    sellers = cursor.fetchall()
    if not sellers:
        print("No sellers found, please run seed_data.py first.")
        return
        
    months_list = ["Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026"]
    
    categories = [
        ("Mobiles", brands_mobiles, 10000, 150000),
        ("Laptops", brands_laptops, 30000, 250000),
        ("Smart Watches", brands_watches, 2000, 50000),
        ("Headphones", brands_headphones, 1000, 35000),
        ("Tablets", brands_tablets, 15000, 120000)
    ]
    
    from update_product_images import get_matching_image

    from populate_specifications import generate_specs_for_product

    inserted = 0
    for i in range(210):
        cat_info = random.choice(categories)
        cat_name = cat_info[0]
        brand = random.choice(cat_info[1])
        name = generate_product_name(cat_name, brand)
        price = random.randint(cat_info[2]//100, cat_info[3]//100) * 100 - 1
        prev_price = price + random.randint(10, 30)*100
        rating = round(random.uniform(3.5, 4.9), 1)
        review_count = random.randint(50, 5000)
        image = get_matching_image(cat_name, brand, i)
        specs = generate_specs_for_product(cat_name, brand, name, price)
        
        cursor.execute('''
            INSERT INTO products (
                canonical_name, name, brand, model, category, price, previous_price, rating, review_count,
                description, image, processor, ram, storage, gpu, battery, display, refresh_rate,
                operating_system, warranty, camera, charging, sensors, driver, anc, connectivity, weight, water_resistance, compatibility
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (name, name, brand, "Model-"+str(random.randint(100,999)), cat_name, price, prev_price, rating, review_count,
              f"Experience the next generation with {name}. Fast, reliable, and authentic from {brand}.", image,
              specs.get("processor"), specs.get("ram"), specs.get("storage"), specs.get("gpu"), specs.get("battery"),
              specs.get("display"), specs.get("refresh_rate"), specs.get("operating_system"), specs.get("warranty"),
              specs.get("camera"), specs.get("charging"), specs.get("sensors"), specs.get("driver"), specs.get("anc"),
              specs.get("connectivity"), specs.get("weight"), specs.get("water_resistance"), specs.get("compatibility")))
        product_id = cursor.lastrowid
        
        hist_price = prev_price
        for m in months_list:
            hist_price = max(price, hist_price - random.randint(100, 500))
            cursor.execute("INSERT INTO price_history (product_id, month, price) VALUES (%s, %s, %s)", (product_id, m, hist_price))
            
        num_sellers = random.randint(2, len(sellers))
        for seller in random.sample(sellers, num_sellers):
            s_id, s_name = seller
            s_price = price + random.randint(-5, 10)*100
            s_prev_price = s_price + random.randint(10, 30)*100
            q_name = name.replace(' ', '+')
            ret = s_name.lower()
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
                p_url = f"https://www.myntra.com/{name.replace(' ', '-')}"
            else:
                p_url = f"https://www.google.com/search?q={s_name}+{q_name}"
                
            cursor.execute(
                "INSERT INTO product_sellers (product_id, seller_id, price, previous_price, product_url, availability, source_provider) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (product_id, s_id, s_price, s_prev_price, p_url, "In Stock", "Provider Feed")
            )
        inserted += 1
        if inserted % 50 == 0:
            print(f"Inserted {inserted} products...")
            conn.commit()
            
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Successfully added {inserted} new real-looking products to the database!")

if __name__ == '__main__':
    run()
