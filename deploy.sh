#!/bin/bash

# Configuration
PROJECT_ID="agri-sage-live-agent-2026"
REGION="us-central1"
BACKEND_SERVICE="navratna-backend"
FRONTEND_SERVICE="navratna-frontend"

echo "🚀 Starting Deployment to Google Cloud Run..."

# 1. Build & Push Backend
echo "📦 Building Backend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$BACKEND_SERVICE ./backend

# 2. Deploy Backend
echo "🌐 Deploying Backend to Cloud Run..."
gcloud run deploy $BACKEND_SERVICE \
  --image gcr.io/$PROJECT_ID/$BACKEND_SERVICE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars PROJECT_ID=$PROJECT_ID,LOCATION=$REGION

# Get Backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --platform managed --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 3. Build & Push Frontend
echo "📦 Building Frontend..."
# Use cloudbuild.yaml with substitutions to pass build args correctly
gcloud builds submit --config ./frontend/cloudbuild.yaml ./frontend \
  --substitutions=_NEXT_PUBLIC_API_URL=$BACKEND_URL

# 4. Deploy Frontend
echo "🌐 Deploying Frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE \
  --image gcr.io/$PROJECT_ID/$FRONTEND_SERVICE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=$BACKEND_URL

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --platform managed --region $REGION --format 'value(status.url)')
echo "🎉 Deployment Complete!"
echo "📍 Access your application at: $FRONTEND_URL"
