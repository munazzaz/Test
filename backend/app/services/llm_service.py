# # app/services/llm_service.py

# import os
# import httpx
# from httpx import HTTPStatusError
# from dotenv import load_dotenv

# load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


# async def call_llm(context: str, question: str) -> str:
#     """
#     Calls Groq's OpenAI-compatible Chat Completions API.

#     If GROQ_API_KEY is missing, we return a mocked response so the app
#     still works for demo purposes.
#     """

#     if not GROQ_API_KEY:
#         return (
#             "Mocked AI response (no GROQ_API_KEY configured).\n\n"
#             f"Question: {question}\n\n"
#             f"Context preview: {context[:200]}..."
#         )

#     system_prompt = (
#         "You are a helpful assistant. Answer ONLY using the information in the "
#         "provided context. If the context does not contain the answer, say that "
#         "you don't have enough information."
#     )

#     payload = {
#         "model": GROQ_MODEL,
#         "messages": [
#             {"role": "system", "content": system_prompt},
#             {
#                 "role": "user",
#                 "content": f"Context:\n{context}\n\nQuestion:\n{question}",
#             },
#         ],
#         "temperature": 0.2,
#         "max_tokens": 512,
#     }

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json",
#     }

#     async with httpx.AsyncClient() as client:
#         try:
#             resp = await client.post(GROQ_API_URL, headers=headers, json=payload)
#             resp.raise_for_status()
#         except HTTPStatusError as e:
#             # Nice fallback instead of 500 if something goes wrong
#             return (
#                 f"Groq API error ({e.response.status_code}). "
#                 "Using a mocked AI response for now.\n\n"
#                 f"Question: {question}\n\n"
#                 f"Context preview: {context[:200]}..."
#             )

#         data = resp.json()

#     try:
#         return data["choices"][0]["message"]["content"]
#     except Exception:
#         return f"Failed to parse Groq response. Raw response: {data}"



# app/services/llm_service.py

import os
import httpx
from httpx import HTTPStatusError
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


async def call_llm(context: str, question: str) -> str:
    """
    Calls Groq's OpenAI-compatible Chat Completions API.

    If GROQ_API_KEY is missing or Groq errors, return a mocked response
    instead of crashing. This keeps the app demo-friendly.
    """

    if not GROQ_API_KEY:
        return (
            "Mocked AI response (no GROQ_API_KEY configured).\n\n"
            f"Question: {question}\n\n"
            f"Context preview: {context[:200]}..."
        )

    system_prompt = (
        "You are a helpful assistant. Answer ONLY using the information in the "
        "provided context. If the context does not contain the answer, say that "
        "you don't have enough information."
    )

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion:\n{question}",
            },
        ],
        "temperature": 0.2,
        "max_tokens": 512,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(GROQ_API_URL, headers=headers, json=payload)
            resp.raise_for_status()
        except HTTPStatusError as e:
            return (
                f"Groq API error ({e.response.status_code}). "
                "Using a mocked AI response for now.\n\n"
                f"Question: {question}\n\n"
                f"Context preview: {context[:200]}..."
            )

        data = resp.json()

    try:
        return data["choices"][0]["message"]["content"]
    except Exception:
        return f"Failed to parse Groq response. Raw response: {data}"
