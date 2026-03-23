import os
class Settings:
    OCR_LANG = os.getenv("OCR_LANG", "fr")
    OCR_USE_GPU = os.getenv("OCR_USE_GPU", "false").lower() == "true"
    OCR_DET_LIMIT_SIDE_LEN = int(
        os.getenv("OCR_DET_LIMIT_SIDE_LEN", 960)
    )
settings = Settings()