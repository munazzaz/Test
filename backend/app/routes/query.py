# # app/routes/query.py

# from fastapi import APIRouter
# from app.services.llm_service import call_llm

# router = APIRouter(prefix="/query", tags=["query"])


# @router.get("/test")
# async def test_llm():
#     """
#     Small test endpoint to verify Groq API is working.
#     """
#     context = "FastAPI is a modern, high-performance web framework for building APIs with Python."
#     question = "What is FastAPI used for?"

#     answer = await call_llm(context=context, question=question)
#     return {"answer": answer}


# # app/routes/query.py

# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app import models, schemas
# from app.database import get_db
# from app.auth.security import get_current_user
# from app.services.rag_service import build_context_for_query
# from app.services.llm_service import call_llm

# router = APIRouter(prefix="/query", tags=["query"])


# @router.get("/test")
# async def test_llm():
#     """
#     Simple test endpoint to verify LLM (Groq) is working.
#     """
#     context = "FastAPI is a modern, high-performance web framework for building APIs with Python."
#     question = "What is FastAPI used for?"

#     answer = await call_llm(context=context, question=question)
#     return {"answer": answer}


# @router.post("/", response_model=schemas.QueryResponse)
# async def query_document(
#     payload: schemas.QueryRequest,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     """
#     Accept a user query and return an AI-generated response based on the user's uploaded document.

#     Flow:
#     - Ensure the document belongs to the current user
#     - Build RAG context from the document content
#     - Send context + question to Groq via call_llm()
#     """

#     # 1) Make sure the document exists and belongs to this user
#     doc = (
#         db.query(models.Document)
#         .filter(
#             models.Document.id == payload.document_id,
#             models.Document.user_id == current_user.id,
#         )
#         .first()
#     )

#     if not doc:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Document not found for this user.",
#         )

#     # 2) Build context using simple RAG
#     context = build_context_for_query(payload.query, doc.content)

#     # 3) Ask Groq (third-party LLM)
#     answer = await call_llm(context=context, question=payload.query)

#     return schemas.QueryResponse(answer=answer, context=context)


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth.security import get_current_user
from app.services.llm_service import call_llm
from app.services.rag_service import build_context_for_query  # 🔹 NEW

router = APIRouter(prefix="/query", tags=["query"])


@router.post("/", response_model=schemas.QueryResponse)
async def query_document(
    payload: schemas.QueryRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    doc = (
        db.query(models.Document)
        .filter(
            models.Document.id == payload.document_id,
            models.Document.user_id == current_user.id,
        )
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # 🔹 RAG: retrieve only the most relevant chunks as context
    context = build_context_for_query(db, document_id=doc.id, query=payload.query)

    answer = await call_llm(context=context, question=payload.query)
    return {"answer": answer, "context": context}
