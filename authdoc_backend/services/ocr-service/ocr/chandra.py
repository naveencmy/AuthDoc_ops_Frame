import os
import requests
import time
import mimetypes

PIPELINE_ID = "pl_osN1C4D4_T50"
BASE_URL = "https://www.datalab.to/api/v1"

def run_ocr(filepath: str):
    api_key = os.getenv("DATALAB_API_KEY")

    if not api_key:
        raise Exception("Missing DATALAB_API_KEY")

    headers = {"X-API-Key": api_key}
    mime_type = mimetypes.guess_type(filepath)[0] or "application/octet-stream"

    with open(filepath, "rb") as f:
        files = {"file": (os.path.basename(filepath), f, mime_type)}

        res = requests.post(
            f"{BASE_URL}/pipelines/{PIPELINE_ID}/run?version=1",
            headers=headers,
            files=files
        )

    data = res.json()
    execution_id = data.get("execution_id")

    if not execution_id:
        raise Exception(f"Pipeline failed: {data}")

    # Poll
    for _ in range(40):
        status = requests.get(
            f"{BASE_URL}/pipelines/executions/{execution_id}",
            headers=headers
        ).json()

        if status["status"] == "completed":
            break

        if status["status"] == "failed":
            raise Exception(f"Pipeline failed: {status}")

        time.sleep(1.5)

    # FINAL RESULT
    result = requests.get(
        f"{BASE_URL}/pipelines/executions/{execution_id}/steps/1/result",
        headers=headers
    ).json()
    # NORMALIZE OUTPUT
    if result.get("markdown"):
        return result["markdown"]

    if result.get("chunks"):
        return " ".join([c.get("text", "") for c in result["chunks"]])

    if result.get("json"):
        return str(result["json"])
    
    return ""