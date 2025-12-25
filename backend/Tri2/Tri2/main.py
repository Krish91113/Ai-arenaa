import os
import requests
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()

app = FastAPI()

# Allow your React app to call the API during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment config
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_OPENAI_MODEL = os.getenv("OPENROUTER_OPENAI_MODEL", "openai/gpt-4o-mini")
OPENROUTER_REFEREE_MODEL = os.getenv("OPENROUTER_REFEREE_MODEL", "deepseek/deepseek-chat")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# Request models
class ChatMessage(BaseModel):
    role: str  # "system" | "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

def call_openrouter(model: str, messages: List[ChatMessage]) -> str:
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not set")

    # Convert to OpenAI-style messages
    payload_messages = [{"role": m.role, "content": m.content} for m in messages]

    url = f"{OPENROUTER_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        # Optional: identify your app
        "HTTP-Referer": "http://localhost",
        "X-Title": "ai-arena-backend",
    }
    payload = {
        "model": model,
        "messages": payload_messages,
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        # Standard OpenAI-style response
        return data["choices"][0]["message"]["content"]
    except requests.HTTPError as e:
        raise HTTPException(status_code=resp.status_code, detail=resp.text) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

def call_gemini(messages: List[ChatMessage]) -> str:
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY is not set")

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        # Simple prompt stitching; for more fidelity, map roles to parts
        prompt = "\n".join([f"{m.role}: {m.content}" for m in messages])
        resp = model.generate_content(prompt)
        return getattr(resp, "text", "").strip() or "No response"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@app.post("/api/chat/gemini")
def chat_gemini(req: ChatRequest):
    reply = call_gemini(req.messages)
    return {"reply": reply, "model": GEMINI_MODEL}

@app.post("/api/chat/openai")
def chat_openai(req: ChatRequest):
    reply = call_openrouter(OPENROUTER_OPENAI_MODEL, req.messages)
    return {"reply": reply, "model": OPENROUTER_OPENAI_MODEL}

@app.post("/api/chat/referee")
def chat_referee(req: ChatRequest):
    reply = call_openrouter(OPENROUTER_REFEREE_MODEL, req.messages)
    return {"reply": reply, "model": OPENROUTER_REFEREE_MODEL}


def main():
    print("Hello from llm-council!")


if __name__ == "__main__":
    main()
