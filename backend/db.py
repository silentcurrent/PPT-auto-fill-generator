"""
Database module for persistent storage on Render.
Uses PostgreSQL when DATABASE_URL is set; otherwise falls back to JSON file (local dev).
"""

import os


def get_db_url() -> str | None:
    """Return DATABASE_URL if set and non-empty."""
    url = os.environ.get("DATABASE_URL")
    return url if url and url.strip() else None


def init_db():
    """Create mappings table if it doesn't exist."""
    url = get_db_url()
    if not url:
        return
    try:
        import psycopg2
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS mappings (
                id SERIAL PRIMARY KEY,
                ppt_placeholder VARCHAR(512) NOT NULL,
                excel_column VARCHAR(512) NOT NULL
            )
        """)
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"[DB] Init warning: {e}")


def load_mappings_from_db() -> list[dict] | None:
    """Load mappings from PostgreSQL. Returns None if DB not configured."""
    url = get_db_url()
    if not url:
        return None
    try:
        import psycopg2
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        cur.execute(
            "SELECT ppt_placeholder, excel_column FROM mappings ORDER BY id"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [
            {"pptPlaceholder": r[0], "excelColumn": r[1]}
            for r in rows
        ]
    except Exception as e:
        print(f"[DB] Load error: {e}")
        return None


def save_mappings_to_db(mappings: list[dict]) -> bool:
    """Save mappings to PostgreSQL. Returns True on success, False otherwise."""
    url = get_db_url()
    if not url:
        return False
    try:
        import psycopg2
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        cur.execute("DELETE FROM mappings")
        for m in mappings:
            ph = m.get("pptPlaceholder", "")
            col = m.get("excelColumn", "")
            if ph and col:
                cur.execute(
                    "INSERT INTO mappings (ppt_placeholder, excel_column) VALUES (%s, %s)",
                    (ph, col)
                )
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"[DB] Save error: {e}")
        return False
