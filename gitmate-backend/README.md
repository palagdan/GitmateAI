
# Gitmate Backend

The Gitmate Backend module is responsible for communication with the vector database. It provides a comprehensive API for storing and retrieving data, including:
- Issues Chunks: Store and manage GitHub issues chunks.
- Code Chunks: Store and search code snippets.
- Conventions Chunks: Store and retrieve organization conventions rules and conventions.
- Semantic Search: Search for semantically similar information

## Development Setup
Run the development Docker Compose configuration to set up the required services (weaviate vector database and ollama). [docker-compose.dev.yml](./../docker-compose.dev.yml)
In a separate terminal, navigate to the backend directory and start the development server:
```
npm run start:dev
```

## API Documentation (Swagger)
The backend API is documented using Swagger. To explore the API:

1. Ensure the backend server is running.

2. Visit the Swagger UI in your browser:
```
http://localhost:3000/api
```
