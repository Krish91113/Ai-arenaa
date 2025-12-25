"""Configuration for the LLM Council."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from this backend package root or its parent so the key is found
_here = Path(__file__).resolve().parent  # .../backend
candidate_envs = [
    _here / ".env",
    _here.parent / ".env",        # .../Tri2/.env (repo-level backend)
    _here.parent.parent / ".env", # .../ai-arena/.env (workspace root)
]
for _env in candidate_envs:
    if _env.exists():
        load_dotenv(_env)
        break
else:
    load_dotenv()  # fallback to default lookup

# OpenRouter API key
# Try environment variable first, then no fallback (must be set by user)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Council members - list of OpenRouter model identifiers
# Switched to free-tier models so the app works without paid credits
COUNCIL_MODELS = [
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "gryphe/mythomax-l2-13b:free",
]

# Referee model - synthesizes final response
# Also free-tier to avoid credit errors
CHAIRMAN_MODEL = "meta-llama/llama-3.1-8b-instruct:free"

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"