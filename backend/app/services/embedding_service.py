# import hashlib
# import json
# import math
# import re
# from typing import List

# from .cache import cache

# EMBED_DIM = 128
# WORD_RE = re.compile(r"\w+", re.UNICODE)


# def _tokenize(text: str) -> list[str]:
#     return WORD_RE.findall(text.lower())


# def _hash_embedding(tokens: list[str], dim: int = EMBED_DIM) -> list[float]:
#     # Very small hashed bag-of-words embedding
#     vec = [0.0] * dim
#     for tok in tokens:
#         h = hash(tok) % dim
#         vec[h] += 1.0
#     # L2-normalise
#     norm = math.sqrt(sum(v * v for v in vec)) or 1.0
#     return [v / norm for v in vec]


# def _cache_key(text: str) -> str:
#     digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
#     return f"embed:{EMBED_DIM}:{digest}"


# def embed_text(text: str) -> List[float]:
#     """
#     Compute or retrieve from cache a small numeric embedding for the text.
#     """
#     key = _cache_key(text)
#     cached = cache.get(key)
#     if cached:
#         return json.loads(cached)

#     tokens = _tokenize(text)
#     vec = _hash_embedding(tokens)
#     cache.set(key, json.dumps(vec), ttl_seconds=60 * 60)  # 1 hour
#     return vec


# def cosine_similarity(a: List[float], b: List[float]) -> float:
#     return sum(x * y for x, y in zip(a, b))  # both are L2-normalised


import hashlib
import json
import math
import re
from typing import List

from .cache import cache

EMBED_DIM = 128
WORD_RE = re.compile(r"\w+", re.UNICODE)


def _tokenize(text: str) -> list[str]:
    return WORD_RE.findall(text.lower())


def _hash_embedding(tokens: list[str], dim: int = EMBED_DIM) -> list[float]:
    """
    Very small hashed bag-of-words style embedding.
    Each token is mapped into one of `dim` buckets and we L2-normalise the vector.
    """
    vec = [0.0] * dim
    for tok in tokens:
        h = hash(tok) % dim
        vec[h] += 1.0

    # L2-normalise so cosine similarity is just dot product
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def _cache_key(text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return f"embed:{EMBED_DIM}:{digest}"


def embed_text(text: str) -> List[float]:
    """
    Compute or retrieve from cache a small numeric embedding for the text.
    """
    key = _cache_key(text)
    cached = cache.get(key)
    if cached:
        print(f"[EMBED] cache hit for key={key[:16]}...")  # debug
        return json.loads(cached)

    print(f"[EMBED] cache miss for key={key[:16]}... computing embedding")  # debug
    tokens = _tokenize(text)
    vec = _hash_embedding(tokens)
    cache.set(key, json.dumps(vec), ttl_seconds=60 * 60)  # 1 hour
    return vec


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """
    Cosine similarity assuming both vectors are already L2-normalised.
    """
    return sum(x * y for x, y in zip(a, b))

# 🔹 Backwards-compatible alias so existing imports keep working
def get_embedding(text: str) -> List[float]:
    """
    Backwards-compatible wrapper used by rag_service.
    """
    return embed_text(text)