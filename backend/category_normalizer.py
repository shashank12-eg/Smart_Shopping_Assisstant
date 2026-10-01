def normalize_category(cat_str: str) -> str:
    """
    Normalize category inputs or product titles to standard category names:
    - Mobiles
    - Laptops
    - Tablets
    - Smart Watches
    - Headphones
    """
    if not cat_str:
        return 'All'
    
    val = cat_str.strip().lower()

    # Exact matches first
    if val in ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones']:
        return 'Mobiles'
    elif val in ['laptop', 'laptops', 'notebook', 'notebooks', 'macbook']:
        return 'Laptops'
    elif val in ['tablet', 'tablets', 'ipad', 'ipads', 'tab']:
        return 'Tablets'
    elif val in ['smart watch', 'smart watches', 'watch', 'watches', 'smartwatch', 'smartwatches']:
        return 'Smart Watches'
    elif val in ['headphone', 'headphones', 'earphone', 'earphones', 'earbud', 'earbuds', 'tws', 'audio', 'earpods']:
        return 'Headphones'

    # Keyword search in longer strings/titles
    if any(k in val for k in ['laptop', 'notebook', 'macbook', 'thinkpad', 'ideapad', 'vivobook', 'zenbook', 'rog', 'tuf']):
        return 'Laptops'
    elif any(k in val for k in ['smartwatch', 'smart watch', 'watch']):
        return 'Smart Watches'
    elif any(k in val for k in ['headphone', 'earphone', 'earbud', 'tws', 'earpod', 'airpod', 'headset']):
        return 'Headphones'
    elif any(k in val for k in ['tablet', 'ipad', 'galaxy tab']):
        return 'Tablets'
    elif any(k in val for k in ['mobile', 'smartphone', 'phone', 'iphone', 'galaxy s', 'oneplus']):
        return 'Mobiles'
    
    # Capitalize title case if standard string
    return cat_str.strip().title()
