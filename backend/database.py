"""
SQLite database connector and table schema initialization.
"""

import sqlite3
import os
from seed_data import INITIAL_PRODUCTS_DATA

DB_PATH = os.path.join(os.path.dirname(__file__), "ecommerce_ai.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        discount INTEGER DEFAULT 0,
        rating REAL DEFAULT 4.5,
        reviews_count INTEGER DEFAULT 1,
        image TEXT,
        stock INTEGER DEFAULT 10,
        tags TEXT
    )
    """)

    # User Interactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        product_id TEXT,
        query TEXT,
        weight REAL DEFAULT 1.0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        order_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        total REAL NOT NULL,
        items_json TEXT NOT NULL,
        status TEXT DEFAULT 'Processing',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    # Seed products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]
    if count == 0:
        for p in INITIAL_PRODUCTS_DATA:
            cursor.execute("""
            INSERT INTO products (id, name, category, brand, description, price, discount, rating, reviews_count, image, stock, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["name"], p["category"], p["brand"], p["description"],
                p["price"], p["discount"], p["rating"], p["reviews_count"],
                p["image"], p["stock"], p["tags"]
            ))
        conn.commit()

    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)

