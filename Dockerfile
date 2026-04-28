# Use Python 3.10 slim image
FROM python:3.10-slim

# Create a non-root user (Hugging Face Spaces requirement)
RUN useradd -m -u 1000 user

# Set the working directory to the user's home directory
WORKDIR /home/user/app

# Change ownership of the app directory to the user
RUN chown -R user:user /home/user/app

# Switch to the non-root user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Copy requirements and install
COPY --chown=user backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY --chown=user backend /home/user/app

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Start FastAPI server on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
