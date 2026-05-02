FROM python:3.10-slim
WORKDIR /app
COPY services/ocr-service/runtime.txt ./
COPY services/ocr-service/requirements.txt .
COPY services/ocr-service .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]