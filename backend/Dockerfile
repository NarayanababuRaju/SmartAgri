# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Environment variables for default configuration
ENV PROJECT_ID=agri-sage-live-agent-2026
ENV LOCATION=us-central1
ENV PORT=8080

# Make port available to the world
EXPOSE 8080

# Run main.py when the container launches
# Using uvicorn directly for production-grade serving
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
