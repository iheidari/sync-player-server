#!/bin/bash

# Google Cloud Deployment Script for Sync Player Server
# This script helps deploy to either App Engine or Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function definitions
deploy_app_engine() {
    echo ""
    echo -e "${BLUE}🎯 Deploying to Google App Engine...${NC}"
    
    # Enable App Engine API
    echo "Enabling App Engine API..."
    gcloud services enable appengine.googleapis.com --quiet
    
    # Deploy to App Engine
    echo "Deploying to App Engine..."
    gcloud app deploy --quiet
    
    # Get the app URL
    APP_URL=$(gcloud app browse --no-launch-browser)
    echo -e "${GREEN}✅ App Engine deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your app is available at: $APP_URL${NC}"
    
    # Test the deployment
    echo "Testing deployment..."
    sleep 5
    if curl -s "$APP_URL/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check failed. Please check the logs.${NC}"
    fi
}

deploy_cloud_run() {
    echo ""
    echo -e "${BLUE}🐳 Deploying to Google Cloud Run...${NC}"
    
    # Enable Cloud Run API
    echo "Enabling Cloud Run API..."
    gcloud services enable run.googleapis.com --quiet
    
    # Build and deploy to Cloud Run
    echo "Building and deploying to Cloud Run..."
    gcloud run deploy sync-player-server \
        --source . \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated \
        --port 8080 \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --set-env-vars NODE_ENV=production,PORT=8080,CORS_ORIGIN=* \
        --quiet
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe sync-player-server --platform managed --region us-central1 --format="value(status.url)")
    echo -e "${GREEN}✅ Cloud Run deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your app is available at: $SERVICE_URL${NC}"
    
    # Test the deployment
    echo "Testing deployment..."
    sleep 5
    if curl -s "$SERVICE_URL/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check failed. Please check the logs.${NC}"
    fi
}

# Main script execution
echo -e "${BLUE}🚀 Google Cloud Deployment Script${NC}"
echo "=================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed.${NC}"
    echo "Please install it first:"
    echo "curl https://sdk.cloud.google.com | bash"
    echo "exec -l \$SHELL"
    echo "gcloud init"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud.${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project ID set.${NC}"
    echo "Please set your project ID:"
    echo "gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"

# Ask user which deployment option they want
echo ""
echo -e "${YELLOW}Choose deployment option:${NC}"
echo "1) Google App Engine (Recommended for Socket.IO)"
echo "2) Google Cloud Run"
echo "3) Both (App Engine + Cloud Run)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        deploy_app_engine
        ;;
    2)
        deploy_cloud_run
        ;;
    3)
        deploy_app_engine
        deploy_cloud_run
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Update your frontend to use the new URLs"
echo "2. Test the Socket.IO connections"
echo "3. Monitor the logs: gcloud app logs tail (App Engine) or gcloud logs tail --service=sync-player-server (Cloud Run)"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "See GCP_DEPLOYMENT.md for detailed instructions and troubleshooting." 