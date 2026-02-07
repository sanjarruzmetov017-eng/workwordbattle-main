from functools import lru_cache
from pathlib import Path
import re
from typing import Iterable, Tuple

_WORD_RE = re.compile(r"^[a-z]+$")
_WORDLIST_PATH = Path(__file__).resolve().parent / "data" / "english_words.txt"
_COMMON_WORDLIST_PATH = Path(__file__).resolve().parent / "data" / "english_words_common.txt"
_LEVEL_CUTOFFS = (
    ("A1", 1000),
    ("A2", 3000),
    ("B1", 7000),
    ("B2", 15000),
    ("C1", 25000),
    ("C2", 10**9),
)
# Word list source: https://github.com/dwyl/english-words (SCOWL-derived).


def normalize_word(word: str) -> str:
    if not word:
        return ""
    return re.sub(r"[^a-z]", "", word.lower())


def normalize_used_words(words: Iterable[str]) -> set[str]:
    return {w for w in (normalize_word(word) for word in words) if w}


def _rank_to_level(rank: int) -> str:
    for level, max_rank in _LEVEL_CUTOFFS:
        if rank <= max_rank:
            return level
    return "C2"


@lru_cache(maxsize=1)
def _load_common_word_freq() -> dict[str, int]:
    try:
        text = _COMMON_WORDLIST_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {}
    words: dict[str, int] = {}
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        word = parts[0].lower()
        if not word or not _WORD_RE.fullmatch(word):
            continue
        if len(word) < 2:
            continue
        freq = 0
        if len(parts) > 1 and parts[1].isdigit():
            freq = int(parts[1])
        words[word] = freq
    return words


@lru_cache(maxsize=1)
def _load_common_rank_map() -> dict[str, int]:
    common = _load_common_word_freq()
    if not common:
        return {}
    sorted_words = sorted(common.items(), key=lambda item: (-item[1], item[0]))
    return {word: idx + 1 for idx, (word, _) in enumerate(sorted_words)}


@lru_cache(maxsize=1)
def _load_common_level_map() -> dict[str, str]:
    rank_map = _load_common_rank_map()
    if not rank_map:
        return {}
    return {word: _rank_to_level(rank) for word, rank in rank_map.items()}


@lru_cache(maxsize=1)
def _load_word_set() -> set[str]:
    try:
        text = _WORDLIST_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return set()
    words: set[str] = set()
    for line in text.splitlines():
        word = line.strip().lower()
        if word and _WORD_RE.fullmatch(word):
            words.add(word)
    return words


@lru_cache(maxsize=1)
def _load_active_word_set() -> set[str]:
    common = _load_common_word_freq()
    if common:
        return set(common.keys())
    return _load_word_set()


@lru_cache(maxsize=1)
def _load_words_by_letter() -> dict[str, list[tuple[str, int]]]:
    by_letter = {chr(code): [] for code in range(ord("a"), ord("z") + 1)}
    common = _load_common_word_freq()
    if common:
        for word, freq in common.items():
            if len(word) < 2:
                continue
            by_letter[word[0]].append((word, freq))
        for letter in by_letter:
            by_letter[letter].sort(key=lambda item: (-item[1], len(item[0]), item[0]))
        return by_letter

    for word in _load_word_set():
        if len(word) < 2:
            continue
        by_letter[word[0]].append((word, 0))
    for letter in by_letter:
        by_letter[letter].sort(key=lambda item: (len(item[0]), item[0]))
    return by_letter


def is_english_word(word: str) -> bool:
    if not word or not _WORD_RE.fullmatch(word):
        return False
    return word in _load_active_word_set()


def get_word_level(word: str) -> str:
    normalized = (word or "").strip().lower()
    if not normalized or not _WORD_RE.fullmatch(normalized):
        return "A1"
    level_map = _load_common_level_map()
    if level_map:
        return level_map.get(normalized, "C2")
    length = len(normalized)
    if length <= 4:
        return "A2"
    if length <= 6:
        return "B1"
    if length <= 8:
        return "B2"
    if length <= 10:
        return "C1"
    return "C2"


def is_valid_chain_word(
    word: str,
    start_char: str | None = None,
    used_words: Iterable[str] | None = None,
    used_set: set[str] | None = None,
) -> Tuple[bool, str | None, str]:
    raw = (word or "").strip().lower()
    if not raw:
        return False, "empty", ""
    if not _WORD_RE.fullmatch(raw):
        return False, "invalid_chars", normalize_word(raw)

    normalized = raw
    if not is_english_word(normalized):
        return False, "not_english", normalized

    if start_char:
        start = normalize_word(start_char)[:1]
        if start and normalized[0] != start:
            return False, "wrong_start", normalized

    if used_set is None:
        used_set = normalize_used_words(used_words or [])

    if normalized in used_set:
        return False, "already_used", normalized

    return True, None, normalized


def find_fallback_word(start_char: str, used_set: set[str]) -> str | None:
    return find_fallback_word_by_level(start_char, used_set, None)


def find_fallback_word_by_level(
    start_char: str, used_set: set[str], levels: set[str] | None
) -> str | None:
    if not start_char or not start_char.isalpha():
        return None
    start = start_char.lower()
    level_map = _load_common_level_map() if levels else {}
    for word, _ in _load_words_by_letter().get(start, []):
        if word not in used_set:
            if levels and level_map and level_map.get(word) not in levels:
                continue
            return word
    return None
