# AuthDoc_Ops
## SYstem_Design Of the Architecture && Analysis of the System Level 
### 1️ High-Level Architecture
```bash
API Layer (Node.js)
    ↓
Batch Manager
    ↓
Zip Extractor
    ↓
Queue (Redis)
    ↓
Worker Pool
        ├── OCR Service (Python)
        ├── Language Detector
        ├── Schema Loader
        ├── Field Extractor
        ├── Confidence Engine
        ├── Validator
    ↓
Storage Layer (Postgres)
    ↓
Excel Export Service
```
### And the Backend Service  API Point
```bash
/authdoc-backend
   /api
   /workers
   /services
   /schemas
   /export
   /ocr-client
   /db
   /utils
```
### 2️ Backend Folder Structure ( Base-Level Clean)
Node.js Core Backend
```bash
authdoc-enterprise/
│
├── src/
│   ├── api/
│   │   ├── batch.routes.js
│   │   ├── document.routes.js
│   │
│   ├── controllers/
│   │   ├── batch.controller.js
│   │   ├── document.controller.js
│   │
│   ├── services/
│   │   ├── zip.service.js
│   │   ├── queue.service.js
│   │   ├── schema.service.js
│   │   ├── validation.service.js
│   │   ├── confidence.service.js
│   │   ├── export.service.js
│   │
│   ├── workers/
│   │   ├── document.worker.js
│   │
│   ├── integrations/
│   │   ├── ocr.client.js
│   │
│   ├── config/
│   │   ├── schema/
│   │   │   ├── marriage.schema.json
│   │   │   ├── birth.schema.json
│   │   │   ├── death.schema.json
│   │   │
│   │   ├── language/
│   │   │   ├── marriage.fr.json
│   │   │   ├── marriage.nl.json
│   │
│   ├── models/
│   │   ├── batch.model.js
│   │   ├── document.model.js
│   │   ├── field.model.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── languageDetector.js
│   │
│   ├── app.js
│   ├── server.js
│
├── python-ocr-service/
│   ├── main.py
│   ├── ocr_engine.py
│   ├── requirements.txt
│
└── docker-compose.yml
```
This is production-aligned.
### 3️ End-to-End Processing Logic

Now the important part.
STEP 1 — Batch Upload API
```bash
POST /batch/upload

```
Flow:
```javascript
1. Receive ZIP
2. Create batch_id
3. Store ZIP temporarily
4. Call zip.service.extract()
5. For each image:
     queue.add({
         batch_id,
         image_path
     })
6. Return batch_id immediately
```
No blocking.
STEP 2 — Zip Service
zip.service.js
```javascript
extract(zipPath):
    unzip to /uploads/{batch_id}/
    filter image files only
    return imagePaths[]
```
Only images.
STEP 3 — Queue Service

Use BullMQ.
```javascript
queue.service.js
add(job):
    documentQueue.add("process-document", job)
```
STEP 4 — Worker (Core Intelligence)

document.worker.js

This is where real logic happens.

Pseudo flow:
```javascript
process(job):

    const { batch_id, image_path } = job.data

    // 1. First we Call the  OCR microservice as do the ligth ocr to find the the what type of file is this (index/blank/title / birth/death/marriage)
    const ocrResult = await ocrClient.extract(image_path)

    // 2. Detect language from the before ocr process by compara with the our schema data's
    const language = detectLanguage(ocrResult.raw_text)

    // 3. After detect that it is what language and which type of file is this then we Load schema
    const schema = schemaService.load("marriage")

    // 4. from the schema it get the data that which field that ocr need to extract in the which in which by Load language keywords
    const keywordMap = schemaService.loadLanguage("marriage", language)

    // 5.  finally Extract fields and passed to the compute departments
    const extractedFields = extractFields(
        ocrResult.raw_text,
        schema,
        keywordMap
    )

    // 6. Compute confidence  check the data is ok or not , error by the calculate it's extracted quality 
    const scoredFields = confidenceService.score(
        extractedFields,
        ocrResult.confidence_map
    )

    // 7. Validate
    const validatedFields = validationService.validate(
        scoredFields,
        schema
    )

    // 8. Store in DB
    saveDocumentRecord(batch_id, validatedFields)
```
Everything modular.
### 4️ OCR Microservice Structure (Python)

Keep it clean.

main.py
```python
@app.post("/extract")
async def extract(file: UploadFile):

    image = load_image(file)

    result = paddle_ocr(image)

    return {
        "raw_text": result.text,
        "confidence_map": result.confidence
    }
```
No validation logic here.
### 5️ Field Extraction Logic (Core Design)

You DO NOT hardcode.

Use:
```py
extractFields(rawText, schema, keywordMap)
```
Algorithm:

For each field in schema:

    Find keyword in rawText

    Extract text near keyword

    Normalize (date format, name format)

    Return value

If not found:

    value = null

### 6️ Confidence Engine
```javascript 
score(fields, confidence_map):

    for each field:
        if field.value exists:
            compute average OCR confidence
        else:
            confidence = 0

        if confidence > 0.85:
            status = VERIFIED
        else if confidence > 0.6:
            status = FLAGGED
        else:
            status = MISSING
```
This is realistic.
### 7️ Validation Engine

Based on schema:
```javascript
validate(fields, schema):

    for each required field:
        if value is null:
            status = FLAGGED
```
Optional fields:
Leave empty.
### 8️ Excel Export Engine

export.service.js
```javascript
generateExcel(batch_id):

    load template
    for each document:
        map fields → template columns
        write row
    save file
    return download link
```
Template mapping loaded from JSON.

Never hardcode column names.
### 9️ Horizontal Scaling Strategy

You scale by:

    Increasing worker count

    Running multiple worker instances

    Using Redis queue

    Dockerizing services

No architecture changes required.
### 10 Failure Handling Strategy
```powershell
You must handle:

    Corrupted image

    OCR failure

    Language detection failure
```
If OCR fails:

Store document with status = ERROR
Continue processing batch

Never crash entire batch.
