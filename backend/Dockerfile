FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install azure-storage-blob
COPY download_models.py .
RUN python download_models.py
COPY . .
CMD ["python", "main.py"]