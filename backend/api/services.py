import json
import re
from typing import List, Tuple

import requests
from django.conf import settings

from .wordlist import (
    find_fallback_word_by_level,
    get_word_level,
    is_valid_chain_word,
    normalize_used_words,
    normalize_word,
)


def _gemini_generate(prompt: str, response_mime: str | None = None, temperature: float = 0.6) -> str:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    model = settings.GEMINI_MODEL
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
        },
    }
    if response_mime:
        payload["generationConfig"]["responseMimeType"] = response_mime

    response = requests.post(url, json=payload, timeout=20)
    response.raise_for_status()
    data = response.json()

    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError("Empty response from Gemini")

    parts = candidates[0].get("content", {}).get("parts", [])
    if not parts:
        raise RuntimeError("No content parts in Gemini response")

    return parts[0].get("text", "")


def generate_ai_word(last_word: str, used_words: List[str]) -> Tuple[str | None, str]:
    safe_last_word = normalize_word(last_word)
    last_char = safe_last_word[-1] if safe_last_word else "a"
    used_set = normalize_used_words(used_words)
    if safe_last_word:
        used_set.add(safe_last_word)
    target_level = get_word_level(safe_last_word) if safe_last_word else "A1"
    allowed_levels = {target_level}
    level_hint = target_level
    used_list = ", ".join(used_words)
    prompt = (
        "Word Chain Game: Previous word was \""
        f"{last_word}\". Give me ONE valid English word starting with \"{last_char.upper()}\". "
        f"CEFR level must be {level_hint}. Do not use these words: {used_list}. "
        "Return JSON: {\"word\": string, \"level\": \"A1-C2\"}."
    )
    try:
        text = _gemini_generate(prompt, response_mime="application/json")
        clean = re.sub(r"```json|```", "", text, flags=re.IGNORECASE).strip()
        data = json.loads(clean)
        raw_word = str(data.get("word", "")).strip().lower()
        valid, _, normalized = is_valid_chain_word(raw_word, start_char=last_char, used_set=used_set)
        if valid:
            level = get_word_level(normalized)
            if level in allowed_levels:
                return normalized, level
    except Exception:
        pass

    fallback = find_fallback_word_by_level(last_char, used_set, allowed_levels)
    if fallback:
        return fallback, get_word_level(fallback)
    fallback_any = find_fallback_word_by_level(last_char, set(), allowed_levels)
    if fallback_any:
        return fallback_any, get_word_level(fallback_any)
    return None, target_level


def generate_hint(start_char: str, used_words: List[str]) -> str:
    safe_start_char = normalize_word(start_char)[:1] or "a"
    used_set = normalize_used_words(used_words)
    used_list = ", ".join(used_words)
    prompt = (
        "Act as a word chain game assistant. Give me ONLY ONE common English word that starts with the letter "
        f"\"{start_char.upper()}\". The word must NOT be in this list: [{used_list}]. "
        "Response should be just the word itself, lowercase, no punctuation."
    )
    try:
        text = _gemini_generate(prompt, response_mime=None)
        hint = normalize_word(text)
        valid, _, _ = is_valid_chain_word(hint, start_char=safe_start_char, used_set=used_set)
        if valid:
            return hint
    except Exception:
        pass

    fallback = find_fallback_word_by_level(safe_start_char, used_set, None)
    if fallback:
        return fallback
    fallback_any = find_fallback_word_by_level(safe_start_char, set(), None)
    if fallback_any:
        return fallback_any
    return ""


def calculate_elo_change(player_elo: int, opponent_elo: int, result: float) -> int:
    k_factor = 32
    expected_score = 1 / (1 + 10 ** ((opponent_elo - player_elo) / 400))
    return int(round(k_factor * (result - expected_score)))
