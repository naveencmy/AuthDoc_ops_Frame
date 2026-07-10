# AuthDoc Ops

AuthDoc Ops is a document-processing platform for ingesting batches of scanned documents, running OCR-based extraction, validating structured fields, and exporting results for downstream use. The system is designed as a modular backend with separate API, worker, and OCR services so it can scale and be maintained more easily.

## Overview

The platform supports the following workflow:

1. Upload one or more documents as a batch.
2. Extract and process files through an asynchronous queue.
3. Run OCR and schema-based field extraction.
4. Validate the extracted data.
5. Store results and export them when requested.

## Key Features

- Batch upload and document processing
- Asynchronous job handling with Redis and background workers
- OCR-based extraction service
- Schema-driven document validation
- Dashboard and queue monitoring endpoints
- Export generation for processed results
- Structured backend organization for API, workers, and shared services

## Architecture

The project is organized into three main components:

- API service: handles requests, routing, and business logic for batches, documents, schemas, and exports
- Worker service: processes queued jobs for extraction, validation, and export tasks
- OCR service: performs document analysis and extraction using Python and FastAPI

A simplified view of the flow:

```text
Client / API -> Queue (Redis) -> Workers -> OCR Service / Storage -> Export
```

### System Architecture Diagram

```mermaid
flowchart LR
    A[Client] --> B[API Service]
    B --> C[Redis Queue]
    C --> D[Worker Service]
    D --> E[OCR Service]
    D --> F[PostgreSQL]
    D --> G[Storage]
    D --> H[Export Service]
```

### Processing Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant API as API Service
    participant Queue as Redis Queue
    participant Worker as Worker Service
    participant OCR as OCR Service
    participant DB as PostgreSQL

    User->>API: Upload batch
    API->>Queue: Enqueue processing jobs
    Queue->>Worker: Dispatch job
    Worker->>OCR: Send document for OCR
    OCR-->>Worker: Extracted data
    Worker->>DB: Save processed result
    Worker-->>API: Job completed
    API-->>User: Batch status / export ready
```

## Technology Stack

- Node.js and Express for the backend API
- BullMQ for job queueing
- Redis for background job coordination
- PostgreSQL for persistent data storage
- Python and FastAPI for OCR-related processing
- Docker support for service isolation and local deployment

## Repository Structure

```text
authdoc_backend/
  services/
    api/            # Express API service
    workers/        # Background workers
    ocr-service/    # Python OCR service
  shared/           # Shared constants, queues, and utilities
  storage/          # Uploads, extracted content, and exports
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ installed
- Python 3.10+ installed
- Redis running locally or available remotely
- PostgreSQL available and reachable
- Optional: Docker for container-based setup

## Environment Configuration

The API expects the following environment variables:

```env
DATABASE_URL=postgresql://user:password@host:****/path
OCR_SERVICE_URL=http://localhost:****
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=****
```

Create your own environment file before starting the services if required by your deployment setup.

## Getting Started

### 1. Install backend dependencies

```bash
cd authdoc_backend
npm install
```

### 2. Install OCR service dependencies

```bash
cd services/ocr-service
pip install -r requirements.txt
```

### 3. Start Redis

If Redis is not already running, start it locally or through Docker.

```bash
docker compose up -d redis
```

### 4. Start the API service

```bash
cd authdoc_backend
npm run api
```

### 5. Start the worker service

```bash
cd authdoc_backend
npm run worker
```

### 6. Start the OCR service

```bash
cd authdoc_backend/services/ocr-service
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available on the configured port, and the OCR service will run on port 8000 by default.

## Main API Endpoints

The backend exposes the following route groups:

- POST /api/batches/upload: upload a batch archive for processing
- GET /api/batches: list batches
- GET /api/batches/:batchId: get batch details
- GET /api/documents: list documents
- GET /api/documents/batch/:batchId: list documents for a batch
- POST /api/exports: create an export job
- GET /api/exports: list export jobs
- GET /health: health check endpoint
- /admin/queues: queue dashboard routes

## Processing Flow

1. A batch is uploaded through the API.
2. Files are staged in the storage area.
3. Jobs are queued for background processing.
4. Workers process each item and call the OCR service.
5. Extracted information is validated and saved.
6. Export tasks can generate downloadable results.

## Development Notes

- The API layer is intentionally separated from the worker layer to keep processing asynchronous and resilient.
- The OCR service is separate so document analysis can evolve independently.
- Redis acts as the coordination layer between incoming requests and background jobs.

## Contribution

Contributions are welcome. If you would like to improve the system, please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with a clear summary

## License

No license has been declared for this repository yet. If you plan to share or distribute the project publicly, consider adding a license file.
