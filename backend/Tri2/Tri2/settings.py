# settings.py (module-level)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INSTALLED_APPS = [
    # ... existing apps ...
    'corsheaders',
    # ... existing apps ...
]

MIDDLEWARE = [
    # ... existing middleware ...
    'corsheaders.middleware.CorsMiddleware',
    # ... existing middleware ...
]

# Relax CORS for local dev (you can tighten this later)
CORS_ALLOW_ALL_ORIGINS = True

# Replace any existing DEBUG/ALLOWED_HOSTS definitions with the following:
DEBUG = os.environ.get("DJANGO_DEBUG", "").lower() in ("1", "true", "yes")

# Set allowed hosts; adjust the default list or provide via env var DJANGO_ALLOWED_HOSTS
ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if h.strip()
]