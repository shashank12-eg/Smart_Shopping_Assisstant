import re
import urllib.parse
import ipaddress
import requests
from category_normalizer import normalize_category

# Whitelist of allowed retail e-commerce domains
ALLOWED_RETAILER_DOMAINS = {
    "amazon.in": "Amazon",
    "www.amazon.in": "Amazon",
    "amzn.to": "Amazon",
    "amzn.in": "Amazon",
    "amzn.eu": "Amazon",
    "flipkart.com": "Flipkart",
    "www.flipkart.com": "Flipkart",
    "dl.flipkart.com": "Flipkart",
    "meesho.com": "Meesho",
    "www.meesho.com": "Meesho",
    "myntra.com": "Myntra",
    "www.myntra.com": "Myntra",
    "croma.com": "Croma",
    "www.croma.com": "Croma",
    "reliancedigital.in": "Reliance Digital",
    "www.reliancedigital.in": "Reliance Digital"
}

KNOWN_BRANDS = [
    "Apple", "Samsung", "Sony", "ASUS", "Acer", "Lenovo", "Dell", "HP",
    "Bose", "OnePlus", "boAt", "Noise", "Xiaomi", "Realme", "Motorola",
    "Google", "Nothing", "JBL", "Sennheiser", "LG", "Microsoft"
]

DEFAULT_CATEGORY_IMAGES = {
    "Laptops": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    "Mobiles": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    "Headphones": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "Smart Watches": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    "Tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
}

DEFAULT_CATEGORY_PRICES = {
    "Laptops": 59990.0,
    "Mobiles": 24999.0,
    "Headphones": 4999.0,
    "Smart Watches": 8999.0,
    "Tablets": 29999.0,
}

def is_safe_retailer_url(url_str: str):
    """
    Validate URL to prevent SSRF and restrict to verified retailer domains.
    Returns: (is_valid: bool, retailer_name_or_error: str, normalized_url: str)
    """
    if not url_str or not isinstance(url_str, str):
        return False, "Empty or invalid URL provided.", ""

    url_clean = url_str.strip()
    if not (url_clean.startswith("http://") or url_clean.startswith("https://")):
        url_clean = "https://" + url_clean

    try:
        parsed = urllib.parse.urlparse(url_clean)
    except Exception as e:
        return False, f"Malformed URL: {str(e)}", ""

    if parsed.scheme not in ("http", "https"):
        return False, "Unsupported URL protocol. Only HTTP and HTTPS are permitted.", ""

    hostname = (parsed.hostname or "").lower()
    if not hostname:
        return False, "Invalid host in product URL.", ""

    # Reject private IPs, localhost, internal subnets to prevent SSRF
    if hostname in ("localhost", "127.0.0.1", "0.0.0.0", "::1"):
        return False, "Access to localhost or loopback addresses is strictly prohibited.", ""

    try:
        ip = ipaddress.ip_address(hostname)
        if ip.is_private or ip.is_loopback or ip.is_link_local:
            return False, "Access to internal IP ranges is prohibited.", ""
    except ValueError:
        pass  # Hostname is a regular domain name

    # Check against domain whitelist
    matched_retailer = None
    for allowed_domain, retailer_name in ALLOWED_RETAILER_DOMAINS.items():
        if hostname == allowed_domain or hostname.endswith("." + allowed_domain):
            matched_retailer = retailer_name
            break

    if not matched_retailer:
        return False, f"Unsupported retailer domain '{hostname}'. Only Amazon India, Flipkart, Meesho, Myntra, Croma, and Reliance Digital are supported.", ""

    return True, matched_retailer, url_clean


def extract_product_identifier(url_str: str, retailer: str) -> dict:
    """
    Extract product identifier (e.g. ASIN for Amazon, PID for Flipkart) and clean title slug.
    """
    parsed = urllib.parse.urlparse(url_str)
    path = parsed.path
    query = urllib.parse.parse_qs(parsed.query)

    extracted_id = None
    slug = None

    if retailer == "Amazon":
        asin_match = re.search(r'/(?:dp|gp/product|product-reviews)/([A-Z0-9]{10})', path, re.IGNORECASE)
        if asin_match:
            extracted_id = asin_match.group(1).upper()
        parts = [p for p in path.split('/') if p and not p.startswith('dp') and len(p) > 3]
        if parts:
            slug = parts[0].replace('-', ' ')

    elif retailer == "Flipkart":
        if "pid" in query:
            extracted_id = query["pid"][0]
        else:
            p_match = re.search(r'/p/([a-zA-Z0-9]+)', path)
            if p_match:
                extracted_id = p_match.group(1)
        parts = [p for p in path.split('/') if p and p != 'p' and not p.startswith('itm')]
        if parts:
            slug = parts[0].replace('-', ' ')

    elif retailer == "Meesho":
        m_match = re.search(r'/p/([a-zA-Z0-9]+)', path)
        if m_match:
            extracted_id = m_match.group(1)
        parts = [p for p in path.split('/') if p and p != 'p']
        if parts:
            slug = parts[0].replace('-', ' ')

    elif retailer == "Myntra":
        m_match = re.search(r'/(\d+)/buy', path)
        if m_match:
            extracted_id = m_match.group(1)
        else:
            digits = re.findall(r'\d+', path)
            if digits:
                extracted_id = digits[-1]
        parts = [p for p in path.split('/') if p and not p.isdigit() and p != 'buy']
        if parts:
            slug = parts[0].replace('-', ' ')

    elif retailer == "Croma":
        parts = [p for p in path.split('/') if p and not p.startswith('p-')]
        if parts:
            slug = parts[-1].replace('-', ' ')
        c_match = re.search(r'/p/(\d+)', path)
        if c_match:
            extracted_id = c_match.group(1)

    elif retailer == "Reliance Digital":
        parts = [p for p in path.split('/') if p and p != 'p']
        if parts:
            slug = parts[-1].replace('-', ' ')
        r_match = re.search(r'/p/(\d+)', path)
        if r_match:
            extracted_id = r_match.group(1)

    return {
        "retailer": retailer,
        "product_id": extracted_id,
        "search_slug": (slug or "").strip()
    }


def clean_product_title(raw_title: str) -> str:
    """Strip common marketing suffixes added by retailers in HTML title tags."""
    if not raw_title:
        return ""
    t = raw_title.strip()
    # Remove retailer suffixes
    patterns = [
        r'\s*\|\s*Amazon\.in.*$',
        r'\s*:\s*Amazon\.in.*$',
        r'\s*-\s*Buy\s+.*Online\s+at\s+Best\s+Price.*Flipkart.*$',
        r'\s*at\s+Best\s+Price\s+Online\s*\|\s*Flipkart\.com.*$',
        r'\s*\|\s*Flipkart\.com.*$',
        r'\s*Buy\s+.*Online\s+at\s+Best\s+Prices\s+in\s+India\s*\|\s*Reliance\s+Digital.*$',
        r'\s*\|\s*Reliance\s+Digital.*$',
        r'\s*\|\s*Croma.*$',
        r'\s*Online\s+Shopping\s+India\s*\|\s*Myntra.*$',
        r'\s*\|\s*Meesho.*$',
    ]
    for pat in patterns:
        t = re.sub(pat, '', t, flags=re.IGNORECASE)
    return t.strip()


def detect_brand(text: str) -> str:
    """Extract brand name from product text."""
    lower_text = text.lower()
    for b in KNOWN_BRANDS:
        if b.lower() in lower_text:
            return b
    return "Generic"


def fetch_url_metadata(url_clean: str, retailer: str) -> dict:
    """
    Safely fetch OpenGraph/HTML metadata from product page.
    Falls back gracefully to URL slug extraction if network is blocked.
    """
    extracted = extract_product_identifier(url_clean, retailer)
    search_slug = extracted.get("search_slug") or ""
    product_id = extracted.get("product_id") or ""

    title = ""
    image = ""
    price = 0.0
    description = ""

    # Attempt safe HTTP request with standard browser headers
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        resp = requests.get(url_clean, headers=headers, timeout=5, allow_redirects=True)
        if resp.status_code == 200:
            html = resp.text
            # Extract og:title or <title>
            og_title = re.search(r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
            if not og_title:
                og_title = re.search(r'<meta\s+name=["\']title["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
            if not og_title:
                og_title = re.search(r'<title>([^<]+)</title>', html, re.IGNORECASE)
            if og_title:
                title = clean_product_title(og_title.group(1))

            # Extract og:image
            og_image = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
            if og_image:
                image = og_image.group(1).strip()

            # Extract og:description
            og_desc = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
            if og_desc:
                description = og_desc.group(1).strip()

            # Extract price if available in meta tags
            price_meta = re.search(r'<meta\s+property=["\']product:price:amount["\']\s+content=["\']([0-9.]+)["\']', html, re.IGNORECASE)
            if price_meta:
                try:
                    price = float(price_meta.group(1))
                except ValueError:
                    price = 0.0

            # Fallback price regex in HTML (INR ₹ / Rs.)
            if price == 0.0:
                price_match = re.search(r'(?:₹|Rs\.?)\s*([0-9,]{3,10})', html)
                if price_match:
                    try:
                        price = float(price_match.group(1).replace(',', ''))
                    except ValueError:
                        price = 0.0
    except Exception:
        pass  # Fall back to URL slug

    # If title wasn't extracted from HTML, use search_slug from URL path
    if not title or len(title) < 3:
        if search_slug:
            # Capitalize each word in slug
            title = ' '.join(w.capitalize() for w in search_slug.split())
        else:
            title = f"{retailer} Product ({product_id or 'Item'})"

    # Detect normalized category from title
    category = normalize_category(title)
    if category not in DEFAULT_CATEGORY_IMAGES:
        category = "Mobiles"  # Default fallback category

    # Set image if missing
    if not image or not image.startswith("http"):
        image = DEFAULT_CATEGORY_IMAGES.get(category, DEFAULT_CATEGORY_IMAGES["Mobiles"])

    # Set price if missing
    if price <= 0:
        price = DEFAULT_CATEGORY_PRICES.get(category, 19999.0)

    # Detect brand
    brand = detect_brand(title)

    return {
        "title": title,
        "brand": brand,
        "category": category,
        "price": price,
        "image": image,
        "description": description or f"Intelligent price analysis profile for {title}.",
        "product_id": product_id,
        "retailer": retailer,
        "url": url_clean
    }
