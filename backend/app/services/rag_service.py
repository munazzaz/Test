# # app/services/rag_service.py

# from typing import List


# def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
#     """
#     Split text into overlapping chunks.
#     This is a simple implementation to satisfy 'split uploaded text into chunks'.
#     """
#     chunks: List[str] = []
#     start = 0
#     length = len(text)

#     while start < length:
#         end = start + chunk_size
#         chunk = text[start:end]
#         chunks.append(chunk)
#         start = end - overlap  # move with overlap

#         if start >= length:
#             break

#     return chunks


# def build_context_for_query(query: str, content: str, max_chunks: int = 5) -> str:
#     """
#     Very simple retrieval:
#     - split into chunks
#     - keep chunks containing the query (case-insensitive)
#     - if none match, use first few chunks

#     This is a lightweight RAG-style retrieval (no vector DB yet).
#     """
#     query_lower = query.lower()
#     chunks = chunk_text(content)
#     matching_chunks: List[str] = []

#     for ch in chunks:
#         if query_lower in ch.lower():
#             matching_chunks.append(ch)

#     if not matching_chunks:
#         matching_chunks = chunks[:max_chunks]
#     else:
#         matching_chunks = matching_chunks[:max_chunks]

#     context = "\n\n---\n\n".join(matching_chunks)
#     return context



import json
from typing import List

from sqlalchemy.orm import Session

from app import models
from .embedding_service import embed_text, cosine_similarity


def split_into_chunks(text: str, max_chars: int = 600) -> List[str]:
    """
    Very simple character-based chunking with sentence boundaries
    where possible. Good enough for this assessment.
    """
    sentences = text.split(". ")
    chunks: list[str] = []
    current = ""

    for sent in sentences:
        # re-add the period we removed
        if current and len(current) + len(sent) + 2 > max_chars:
            chunks.append(current.strip())
            current = sent + ". "
        else:
            current += sent + ". "

    if current.strip():
        chunks.append(current.strip())

    return chunks


def index_document_chunks(db: Session, document: models.Document) -> None:
    """
    Split the document content into chunks, compute embeddings,
    and persist them into document_chunks.
    """
    # Remove old chunks if we ever re-index (not strictly needed now)
    db.query(models.DocumentChunk).filter(
        models.DocumentChunk.document_id == document.id
    ).delete()

    chunks = split_into_chunks(document.content)
    for idx, chunk_text in enumerate(chunks):
        emb = embed_text(chunk_text)
        db.add(
            models.DocumentChunk(
                document_id=document.id,
                chunk_index=idx,
                content=chunk_text,
                embedding=json.dumps(emb),
            )
        )

    db.commit()


def build_context_for_query(
    db: Session, document_id: int, query: str, top_k: int = 3
) -> str:
    """
    Retrieve top_k relevant chunks for a given query and
    concatenate them into a context string. Falls back
    to the full doc if no chunks are available.
    """
    chunks = (
        db.query(models.DocumentChunk)
        .filter(models.DocumentChunk.document_id == document_id)
        .order_by(models.DocumentChunk.chunk_index)
        .all()
    )

    if not chunks:
        doc = db.query(models.Document).filter(models.Document.id == document_id).first()
        return doc.content if doc else ""

    query_vec = embed_text(query)
    scored: list[tuple[float, models.DocumentChunk]] = []

    for ch in chunks:
        emb = json.loads(ch.embedding)
        score = cosine_similarity(query_vec, emb)
        scored.append((score, ch))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_chunks = [c.content for (score, c) in scored[:top_k]]

    return "\n\n---\n\n".join(top_chunks)


# import json
# from typing import List

# from sqlalchemy.orm import Session

# from app import models
# from .embedding_service import embed_text, cosine_similarity


# def split_into_chunks(text: str, max_chars: int = 600) -> List[str]:
#     """
#     Very simple character-based chunking with sentence boundaries where possible.
#     """
#     sentences = text.split(". ")
#     chunks: list[str] = []
#     current = ""

#     for sent in sentences:
#         piece = sent
#         # add the period back (since we split by ". ")
#         if not piece.endswith("."):
#             piece += "."
#         if current and len(current) + len(piece) + 1 > max_chars:
#             chunks.append(current.strip())
#             current = piece + " "
#         else:
#             current += piece + " "

#     if current.strip():
#         chunks.append(current.strip())

#     return chunks


# def index_document_chunks(db: Session, document: models.Document) -> None:
#     """
#     Split the document content into chunks, compute embeddings,
#     and persist them into document_chunks.
#     """
#     # remove old chunks if we re-index this document
#     db.query(models.DocumentChunk).filter(
#         models.DocumentChunk.document_id == document.id
#     ).delete()

#     chunks = split_into_chunks(document.content)
#     print(f"[RAG] Indexing document {document.id} into {len(chunks)} chunks")  # debug

#     for idx, chunk_text in enumerate(chunks):
#         emb = embed_text(chunk_text)
#         print(f"[RAG]  - chunk {idx}, len={len(chunk_text)}")  # debug

#         db.add(
#             models.DocumentChunk(
#                 document_id=document.id,
#                 chunk_index=idx,
#                 content=chunk_text,
#                 embedding=json.dumps(emb),
#             )
#         )

#     db.commit()
#     print(f"[RAG] Finished indexing document {document.id}")  # debug


# def build_context_for_query(
#     db: Session, document_id: int, query: str, top_k: int = 3
# ) -> str:
#     """
#     Retrieve top_k relevant chunks for a given query and
#     concatenate them into a context string. Falls back
#     to the full doc if no chunks are available.
#     """
#     chunks = (
#         db.query(models.DocumentChunk)
#         .filter(models.DocumentChunk.document_id == document_id)
#         .order_by(models.DocumentChunk.chunk_index)
#         .all()
#     )

#     if not chunks:
#         print(
#             f"[RAG] No chunks found for document {document_id}, "
#             "falling back to full document content"
#         )
#         doc = db.query(models.Document).filter(models.Document.id == document_id).first()
#         return doc.content if doc else ""

#     print(f"[RAG] Found {len(chunks)} chunks for document {document_id}")  # debug

#     query_vec = embed_text(query)
#     scored: list[tuple[float, models.DocumentChunk]] = []

#     for ch in chunks:
#         emb = json.loads(ch.embedding)
#         score = cosine_similarity(query_vec, emb)
#         scored.append((score, ch))

#     scored.sort(key=lambda x: x[0], reverse=True)
#     top_chunks = [c.content for (score, c) in scored[:top_k]]

#     print(
#         f"[RAG] Query='{query[:40]}...' -> top {len(top_chunks)} chunks selected "
#         f"from doc {document_id}"
#     )  # debug

#     return "\n\n---\n\n".join(top_chunks)


# # app/services/rag.py
# import json
# from typing import List, Tuple

# import numpy as np
# import faiss
# from sqlalchemy.orm import Session

# from app import models
# from app.services.embedding_service import get_embedding
# from app.services.llm_service import call_llm


# CHUNK_SIZE = 500  # characters, same as before
# CHUNK_OVERLAP = 50


# def _chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
#   chunks: List[str] = []
#   start = 0
#   n = len(text)
#   while start < n:
#     end = min(n, start + size)
#     chunk = text[start:end].strip()
#     if chunk:
#       chunks.append(chunk)
#     start += size - overlap
#   return chunks


# def index_document(db: Session, document: models.Document) -> None:
#   """
#   Split document.content into chunks, compute FAISS-friendly embeddings,
#   and store them in document_chunks table.
#   """
#   # Clear old chunks for this document
#   db.query(models.DocumentChunk).filter(
#       models.DocumentChunk.document_id == document.id
#   ).delete()
#   db.flush()

#   chunks = _chunk_text(document.content)
#   print(f"[RAG] Indexing document {document.id} into {len(chunks)} chunks")

#   for idx, chunk in enumerate(chunks):
#     print(f"[RAG]  - chunk {idx}, len={len(chunk)}")
#     emb = get_embedding(chunk)  # -> List[float]
#     emb_json = json.dumps(emb)

#     db_chunk = models.DocumentChunk(
#         document_id=document.id,
#         chunk_index=idx,
#         content=chunk,
#         embedding=emb_json,
#     )
#     db.add(db_chunk)

#   db.commit()
#   print(f"[RAG] Finished indexing document {document.id}")


# def query_document(
#     db: Session, document_id: int, question: str, top_k: int = 3
# ) -> Tuple[str, str]:
#   """
#   Use FAISS as an in-memory vector index for this document's chunks.
#   Returns (answer, context).
#   """
#   chunks: List[models.DocumentChunk] = (
#       db.query(models.DocumentChunk)
#       .filter(models.DocumentChunk.document_id == document_id)
#       .order_by(models.DocumentChunk.chunk_index.asc())
#       .all()
#   )

#   if not chunks:
#     return (
#         "I couldn't find any indexed content for this document.",
#         "",
#     )

#   # Build FAISS index from stored embeddings
#   print(f"[RAG] Building FAISS index for document {document_id} with {len(chunks)} chunks")

#   vectors: List[np.ndarray] = []
#   texts: List[str] = []

#   for ch in chunks:
#     emb = np.array(json.loads(ch.embedding), dtype="float32")
#     # normalize for cosine similarity via inner product
#     norm = np.linalg.norm(emb) + 1e-8
#     emb = emb / norm
#     vectors.append(emb)
#     texts.append(ch.content)

#   vecs_np = np.stack(vectors, axis=0)
#   dim = vecs_np.shape[1]

#   index = faiss.IndexFlatIP(dim)  # inner product (cosine after normalization)
#   index.add(vecs_np)

#   # Embed the question
#   q_emb = np.array(get_embedding(question), dtype="float32")
#   q_emb = q_emb / (np.linalg.norm(q_emb) + 1e-8)

#   k = min(top_k, len(chunks))
#   scores, idxs = index.search(q_emb.reshape(1, -1), k)

#   print(f"[RAG] FAISS scores={scores}, idxs={idxs}")

#   selected_chunks = [texts[i] for i in idxs[0] if i >= 0]
#   context = "\n\n---\n\n".join(selected_chunks)

#   # Call LLM exactly as before
#   answer = call_llm(context=context, question=question)
#   return answer, context
