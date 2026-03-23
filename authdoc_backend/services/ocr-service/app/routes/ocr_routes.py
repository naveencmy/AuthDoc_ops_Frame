from fastapi import APIRouter, HTTPException
from models.request_models import OCRRequest
from services.paddle_ocr import ocr_service
from utils.image_loader import load_image

router = APIRouter()
@router.post("/extract")
async def extract_text(req: OCRRequest):
    try:
        image = load_image(req.image_path)
        result = ocr_service.extract_text(image)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )