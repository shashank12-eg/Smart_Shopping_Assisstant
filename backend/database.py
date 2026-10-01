import mysql.connector
from mysql.connector import Error
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME


def get_db_connection():
    """Return a MySQL connection."""
    conn = mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    return conn


def create_database_if_not_exists():
    """Create the MySQL database if it does not exist yet."""
    conn = mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    conn.commit()
    cursor.close()
    conn.close()


def init_db():
    """Create and migrate all tables inside the smartshopping MySQL database safely."""
    create_database_if_not_exists()
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. USERS
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            name          VARCHAR(150)  NOT NULL,
            email         VARCHAR(255)  UNIQUE NOT NULL,
            password_hash VARCHAR(255)  NOT NULL,
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    # 2. PRODUCTS (Canonical Product model)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id               INT AUTO_INCREMENT PRIMARY KEY,
            canonical_name   VARCHAR(255),
            name             VARCHAR(255) NOT NULL,
            brand            VARCHAR(100) NOT NULL,
            model            VARCHAR(100),
            category         VARCHAR(100) NOT NULL,
            price            DECIMAL(12,2) NOT NULL,
            previous_price   DECIMAL(12,2) DEFAULT 0.0,
            description      TEXT,
            image            TEXT NOT NULL,
            rating           DECIMAL(3,1) DEFAULT 4.5,
            review_count     INT DEFAULT 120,
            specifications   JSON NULL,
            processor        VARCHAR(255),
            ram              VARCHAR(100),
            storage          VARCHAR(100),
            gpu              VARCHAR(255),
            battery          VARCHAR(255),
            display          VARCHAR(255),
            refresh_rate     VARCHAR(50),
            operating_system VARCHAR(150),
            warranty         VARCHAR(150),
            camera           VARCHAR(255),
            charging         VARCHAR(255),
            sensors          VARCHAR(255),
            driver           VARCHAR(255),
            anc              VARCHAR(255),
            connectivity     VARCHAR(255),
            weight           VARCHAR(100),
            water_resistance VARCHAR(150),
            compatibility    VARCHAR(255),
            created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    # Safe Schema Migrations for existing products table
    migration_columns = [
        ("canonical_name", "VARCHAR(255)"),
        ("model", "VARCHAR(100)"),
        ("review_count", "INT DEFAULT 120"),
        ("previous_price", "DECIMAL(12,2) DEFAULT 0.0"),
        ("specifications", "JSON NULL"),
    ]
    for col_name, col_def in migration_columns:
        try:
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_def}")
        except mysql.connector.Error:
            pass  # Column already exists

    # 3. SELLERS
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sellers (
            id   INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) UNIQUE NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    # Ensure major retailers exist in `sellers`
    for retailer in ["Amazon", "Flipkart", "Meesho", "Myntra", "Reliance Digital", "Croma"]:
        try:
            cursor.execute("INSERT IGNORE INTO sellers (name) VALUES (%s)", (retailer,))
        except Exception:
            pass

    # 4. PRODUCT_SELLERS (Retailer product offers / availability)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_sellers (
            id              INT AUTO_INCREMENT PRIMARY KEY,
            product_id      INT NOT NULL,
            seller_id       INT NOT NULL,
            price           DECIMAL(12,2) NOT NULL,
            previous_price  DECIMAL(12,2) DEFAULT 0.0,
            product_url     TEXT,
            availability    VARCHAR(50) DEFAULT 'In Stock',
            source_provider VARCHAR(100) DEFAULT 'API',
            fetched_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (seller_id)  REFERENCES sellers(id)  ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    seller_migrations = [
        ("previous_price", "DECIMAL(12,2) DEFAULT 0.0"),
        ("availability", "VARCHAR(50) DEFAULT 'In Stock'"),
        ("source_provider", "VARCHAR(100) DEFAULT 'API'"),
        ("fetched_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    ]
    for col_name, col_def in seller_migrations:
        try:
            cursor.execute(f"ALTER TABLE product_sellers ADD COLUMN {col_name} {col_def}")
        except mysql.connector.Error:
            pass

    # 5. PRICE_HISTORY (Timestamped observations)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS price_history (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            product_id  INT NOT NULL,
            seller_id   INT NULL,
            month       VARCHAR(20) NULL,
            price       DECIMAL(12,2) NOT NULL,
            observed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    price_history_migrations = [
        ("seller_id", "INT NULL"),
        ("observed_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
    ]
    for col_name, col_def in price_history_migrations:
        try:
            cursor.execute(f"ALTER TABLE price_history ADD COLUMN {col_name} {col_def}")
        except mysql.connector.Error:
            pass

    # 6. WISHLIST
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS wishlist (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            user_id    INT NOT NULL,
            product_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_wishlist (user_id, product_id),
            FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    # 7. SEARCH_HISTORY
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS search_history (
            id             INT AUTO_INCREMENT PRIMARY KEY,
            user_id        INT NOT NULL,
            search_keyword VARCHAR(255) NOT NULL,
            searched_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    # 8. RECENTLY_VIEWED
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recently_viewed (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            user_id    INT NOT NULL,
            product_id INT NOT NULL,
            viewed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    # 9. PRICE_ALERTS
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS price_alerts (
            id              INT AUTO_INCREMENT PRIMARY KEY,
            user_id         INT NOT NULL,
            product_id      INT NOT NULL,
            target_price    DECIMAL(12,2) NOT NULL,
            drop_percentage DECIMAL(5,2) NULL,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status          VARCHAR(20) DEFAULT 'Active',
            FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')

    try:
        cursor.execute("ALTER TABLE price_alerts ADD COLUMN drop_percentage DECIMAL(5,2) NULL")
    except mysql.connector.Error:
        pass

    conn.commit()
    cursor.close()
    conn.close()
    print("[DB] All MySQL tables and safe schema migrations verified successfully.")


if __name__ == '__main__':
    init_db()
