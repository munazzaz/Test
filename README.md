AI-Powered Text Query Web Application

Deadline: 3 AM, 17th November 2025

This project is a small AI-powered web application that allows users to upload or input text and query it using an integrated LLM. The system supports authentication, data storage, and provides a clean, user-friendly frontend for interaction.

Features
Backend

Built with Python (FastAPI) / Node.js (Express/NestJS)

JWT-based authentication (/auth/signup, /auth/login)

Upload endpoint for text or documents (/upload)

Query endpoint for AI-generated responses (/query)

PostgreSQL database for storing documents and metadata

Clean code architecture, modularization, and error handling

Frontend

Built with Next.js

User authentication

Upload interface for text/documents

Chat-style UI to query uploaded data

Display of chat history

Focus on usability and clean UI design

AI/LLM Integration

Integrated with OpenAI / Anthropic / Local LLM

Retrieval-Augmented Generation (RAG) pipeline:

Split uploaded text into chunks

Generate embeddings

Retrieve relevant content

Pass context to LLM for response generation

DevOps & Infrastructure

Docker setup for backend and frontend

Vector database support (FAISS / Pinecone / Weaviate)

Caching layer (Redis)

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | Next.js, React, Tailwind CSS       |
| Backend          | FastAPI / Node.js (Express/NestJS) |
| Database         | PostgreSQL                         |
| AI/LLM           | OpenAI / Anthropic / Ollama        |
| Vector DB        | FAISS / Pinecone / Weaviate        |
| Caching          | Redis                              |
| Containerization | Docker, Docker Compose             |


project-root/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yaml
└── README.md

Setup Instructions
1. Clone the repository
git clone <your-repo-url>
cd <project-root>

2. Backend Setup (Python/FastAPI)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

3. Frontend Setup (Next.js)
cd frontend
npm install

4. Environment Variables

Create .env files for backend and frontend with your API keys, database URLs, and JWT secrets.

Running the Application
Using Development Mode

Frontend:

npm run dev


Backend:

uvicorn app.main:app --reload

Using Docker
docker-compose up --build


This will spin up the backend, frontend, PostgreSQL, Redis, and vector database containers.

Optional

Live demo link (if deployed)

Loom video demonstrating app usage

Notes

Implements RAG with chunking and embeddings for improved AI responses

Clean and modular architecture for easy maintenance

Secure JWT authentication and role-based access
