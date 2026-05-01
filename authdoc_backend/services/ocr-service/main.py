from fastapi import FastAPI, UploadFile, File, Form
import tempfile, shutil, os, time, json
from fastapi.responses import JSONResponse

from ocr.chandra import run_ocr
from processing.extractor import extract_with_llm

app = FastAPI()


def save_temp(file: UploadFile):
    suffix = os.path.splitext(file.filename or "file.png")[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        return tmp.name


def normalize_schema(schema_list):
    result = {}

    for field in schema_list:
        name = field["field_name"]
        parts = name.split(".")

        current = result
        for i, part in enumerate(parts):
            if i == len(parts) - 1:
                current[part] = {
                    "type": field.get("data_type", "string"),
                    "required": field.get("required", False)
                }
            else:
                current[part] = current.get(part, {})
                current = current[part]

    return result


@app.post("/extract")
async def extract(
    file: UploadFile = File(...),
    schema_json: str = Form(...)
):
    path = None

    try:
        path = save_temp(file)

        start = time.time()

        raw_schema = json.loads(schema_json)
        schema = normalize_schema(raw_schema)

        print("[OCR] Schema fields:", len(raw_schema))

        text = run_ocr(path)

        if not text or len(text.strip()) < 20:
            return JSONResponse(
                status_code=422,
                content={"status": "failed", "error": "OCR_EMPTY"}
            )

        print("[OCR] Text length:", len(text))

        fields = extract_with_llm(text, schema)

        return {
            "status": "success",
            "fields": fields,
            "time": round(time.time() - start, 2)
        }

    except Exception as e:
        print("[OCR ERROR]:", str(e))

        return JSONResponse(
            status_code=500,
            content={
                "status": "failed",
                "error": str(e)
            }
        )

    finally:
        if path and os.path.exists(path):
            os.remove(path)