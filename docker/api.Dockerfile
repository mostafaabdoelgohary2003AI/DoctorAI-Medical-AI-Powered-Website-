FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install TensorFlow with GPU support if available
RUN pip install --no-cache-dir tensorflow

# Copy application code
COPY api/ /app/

# Copy model files
# Models will be mounted as volumes in docker-compose

# Set environment variables
ENV PYTHONPATH=/app
ENV TF_FORCE_GPU_ALLOW_GROWTH=true
ENV TF_CPP_MIN_LOG_LEVEL=2

# Expose port
EXPOSE 8000

# Create a non-root user and switch to it
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Copy startup script and make it executable
COPY api/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Run the application using the startup script
CMD ["/bin/bash", "start.sh"]