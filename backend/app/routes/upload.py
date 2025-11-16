# # from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi import (
#     APIRouter,
#     Depends,
#     HTTPException,
#     status,
#     UploadFile,
#     File,
#     Form,
# )
# from sqlalchemy.orm import Session

# from app import models, schemas
# from app.database import get_db
# from app.auth.security import get_current_user

# router = APIRouter(prefix="/upload", tags=["documents"])

# MAX_CONTENT_LENGTH = 5000  # 👈 your limit
# MAX_CONTENT_LEN = 5000


# @router.post("/", response_model=schemas.DocumentOut, status_code=status.HTTP_201_CREATED)
# def upload_document(
#     payload: schemas.DocumentCreate,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     """
#     Accepts text from the logged-in user and saves it as a document.
#     """

#     # 👇 Custom, friendly validation
#     if len(payload.content) > MAX_CONTENT_LENGTH:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Content is too long. Max allowed is {MAX_CONTENT_LENGTH} characters.",
#         )

#     doc = models.Document(
#         user_id=current_user.id,
#         title=payload.title,
#         content=payload.content,
#     )
#     db.add(doc)
#     db.commit()
#     db.refresh(doc)
#     return doc


# @router.post("/file", response_model=schemas.DocumentOut, status_code=status.HTTP_201_CREATED)
# async def upload_document_file(
#     file: UploadFile = File(...),
#     title: str | None = Form(None),
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     """
#     Accept a text document (.txt) upload and store its content as a document.
#     """
#     # For this assessment we keep it simple: support plain text files.
#     if file.content_type not in ["text/plain"]:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Only plain text (.txt) files are supported for now.",
#         )

#     raw_bytes = await file.read()

#     try:
#         content = raw_bytes.decode("utf-8")
#     except UnicodeDecodeError:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Could not decode file as UTF-8 text.",
#         )

#     # Enforce same length limit as manual content
#     if len(content) > MAX_CONTENT_LEN:
#         content = content[:MAX_CONTENT_LEN]

#     if not title:
#         title = file.filename or "Uploaded document"

#     doc = models.Document(
#         user_id=current_user.id,
#         title=title,
#         content=content,
#     )
#     db.add(doc)
#     db.commit()
#     db.refresh(doc)
#     return doc


# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app import models, schemas
# from app.database import get_db
# from app.auth.security import get_current_user
# from app.services.rag_service import index_document_chunks  # 🔹 NEW import

# router = APIRouter(prefix="/upload", tags=["documents"])


# @router.post("/", response_model=schemas.DocumentOut, status_code=status.HTTP_201_CREATED)
# def upload_document(
#     payload: schemas.DocumentCreate,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     """
#     Accepts text from the logged-in user and saves it as a document.
#     Also creates RAG chunks + embeddings.
#     """
#     doc = models.Document(
#         user_id=current_user.id,
#         title=payload.title,
#         content=payload.content,
#     )
#     db.add(doc)
#     db.commit()
#     db.refresh(doc)

#     # 🔹 RAG indexing step
#     index_document_chunks(db, doc)

#     return doc


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth.security import get_current_user
from app.services.rag_service import index_document_chunks

router = APIRouter(prefix="/upload", tags=["documents"])

# we keep a hard limit consistent with your Pydantic schema (5000 chars)
MAX_CONTENT_LEN = 5000


@router.post(
    "/",
    response_model=schemas.DocumentOut,
    status_code=status.HTTP_201_CREATED,
)
def upload_document(
    payload: schemas.DocumentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Accepts raw text JSON from the logged-in user and saves it as a document.
    Also indexes the document into chunks + embeddings for RAG.
    """
    # extra safety check (Pydantic already enforces max_length=5000)
    if len(payload.content) > MAX_CONTENT_LEN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Content must be at most {MAX_CONTENT_LEN} characters.",
        )

    doc = models.Document(
        user_id=current_user.id,
        title=payload.title,
        content=payload.content,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # build chunks + embeddings for this document
    index_document_chunks(db, doc)

    return doc


@router.post(
    "/file",
    response_model=schemas.DocumentOut,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document_file(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Accepts a text *file* (e.g. .txt) plus a title via multipart/form-data.
    Reads the file content as text, saves it as a document,
    and indexes it into chunks + embeddings for RAG.

    Endpoint path: POST /upload/file
    """
    # allow only plain-text files for this assignment to keep dependencies light
    if file.content_type not in ("text/plain",):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only plain text (.txt) files are supported for now.",
        )

    raw_bytes = await file.read()
    try:
        content = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not decode file as UTF-8 text.",
        )

    if not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    if len(content) > MAX_CONTENT_LEN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File content must be at most {MAX_CONTENT_LEN} characters.",
        )

    doc = models.Document(
        user_id=current_user.id,
        title=title,
        content=content,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # index into chunks + embeddings for RAG
    index_document_chunks(db, doc)

    return doc
