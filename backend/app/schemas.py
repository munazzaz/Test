# app/schemas.py
# from pydantic import BaseModel, EmailStr
from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# # 🔽 add these for documents
# class DocumentCreate(BaseModel):
#     title: str
#     content: str

# class DocumentCreate(BaseModel):
#     title: constr(min_length=1, max_length=200)
#     content: constr(min_length=1, max_length=5000)  # adjust 5000 as you like

class DocumentCreate(BaseModel):
    title: constr(min_length=1, max_length=200)
    content: str  # we'll enforce length manually


class DocumentOut(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        orm_mode = True

class QueryRequest(BaseModel):
    query: str
    document_id: int


class QueryResponse(BaseModel):
    answer: str
    context: str | None = None        