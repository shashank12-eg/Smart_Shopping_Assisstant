import urllib.parse
from database import get_db_connection

def get_clean_retailer_url(retailer_name: str, product_name: str) -> str:
    q = urllib.parse.quote_plus(product_name.strip())
    r = (retailer_name or '').lower()
    if 'amazon' in r:
        return f"https://www.amazon.in/s?k={q}"
    elif 'flipkart' in r:
        return f"https://www.flipkart.com/search?q={q}"
    elif 'croma' in r:
        return f"https://www.croma.com/searchB?q={q}%3Arelevance"
    elif 'reliance' in r:
        return f"https://www.reliancedigital.in/search?q={q}"
    elif 'meesho' in r:
        return f"https://www.meesho.com/search?q={q}"
    elif 'myntra' in r:
        slug = urllib.parse.quote(product_name.strip().replace(' ', '-'))
        return f"https://www.myntra.com/{slug}"
    return f"https://www.google.com/search?q={urllib.parse.quote_plus(retailer_name + ' ' + product_name)}"

def fix_all_seller_urls():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT ps.id, s.name as seller_name, p.name as product_name
        FROM product_sellers ps
        JOIN sellers s ON ps.seller_id = s.id
        JOIN products p ON ps.product_id = p.id
    """)
    rows = cursor.fetchall()
    
    update_cursor = conn.cursor()
    updated_count = 0
    for row in rows:
        correct_url = get_clean_retailer_url(row['seller_name'], row['product_name'])
        update_cursor.execute("UPDATE product_sellers SET product_url = %s WHERE id = %s", (correct_url, row['id']))
        updated_count += 1
        
    conn.commit()
    update_cursor.close()
    cursor.close()
    conn.close()
    print(f"Successfully updated {updated_count} product seller URLs to live working retailer endpoints.")

if __name__ == '__main__':
    fix_all_seller_urls()
