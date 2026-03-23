from paddleocr import PaddleOCR
from config.settings import settings
class OCRService:
    def __init__(self):
        self.ocr = PaddleOCR(
            use_angle_cls=True,
            lang=settings.OCR_LANG,
            use_gpu=settings.OCR_USE_GPU
        )
    def extract_text(self, image):
        result = self.ocr.ocr(image)
        texts = []
        confidences = []
        for line in result:
            text = line[1][0]
            conf = line[1][1]
            texts.append(text)
            confidences.append(conf)
        raw_text = " ".join(texts)
        avg_conf = sum(confidences) / len(confidences) if confidences else 0
        return {
            "raw_text": raw_text,
            "avg_confidence": avg_conf
        }
ocr_service = OCRService()