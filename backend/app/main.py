# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI(
#     title="Nexal Assessment Backend",
#     version="0.1.0",
# )

# # Allow your Next.js frontend (probably running on port 3000)
# origins = [
#     "http://localhost:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/health")
# def health_check():
#     return {"status": "ok"}


# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.auth import routes as auth_routes
from app.routes import upload as upload_routes  # add this
from app.routes import query as query_routes  # 👈 add this



# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexal Assessment Backend",
    version="0.1.0",
)

origins = [
    "http://localhost:3000",  # Next.js dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# include auth routes
app.include_router(auth_routes.router)
app.include_router(upload_routes.router)  
app.include_router(query_routes.router)  

