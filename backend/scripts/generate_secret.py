"""Generate a cryptographically secure SECRET_KEY for the .env file.

Usage:
    python scripts/generate_secret.py
"""

import secrets

if __name__ == "__main__":
    key = secrets.token_hex(32)
    print(f"SECRET_KEY={key}")
