# Google Cloud Platform Deployment Guide

This guide will help you deploy your Socket.IO server to Google Cloud Platform using multiple deployment options.

## 🚀 Deployment Options

### Option 1: Google App Engine (Recommended for Socket.IO)

- **Best for:** Real-time applications with persistent connections
- **Scaling:** Automatic scaling with warm instances
- **Cost:** Pay-per-use with free tier

### Option 2: Google Cloud Run

- **Best for:** Containerized applications
- **Scaling:** Scales to zero when not in use
- **Cost:** Pay-per-use with free tier

## 📋 Prerequisites

1. **Google Cloud Account**

   - Sign up at [cloud.google.com](https://cloud.google.com)
   - Enable billing (required for deployment)

2. **Google Cloud CLI**

   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

3. **Enable Required APIs**
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   ```

## 🎯 Option 1: Deploy to App Engine

### Step 1: Configure App Engine

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Deploy to App Engine
gcloud app deploy
```

### Step 2: Access Your App

```bash
# Get your app URL
gcloud app browse
```

Your app will be available at: `https://YOUR_PROJECT_ID.uc.r.appspot.com`

## 🐳 Option 2: Deploy to Cloud Run

### Step 1: Build and Deploy

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Build and deploy to Cloud Run
gcloud run deploy sync-player-server \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,PORT=8080,CORS_ORIGIN=*
```

### Step 2: Access Your App

Your app will be available at the URL provided after deployment.

## 🔄 Automated CI/CD with Cloud Build

### Step 1: Connect GitHub Repository

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Connect Repository"
3. Select GitHub and authorize
4. Choose your repository

### Step 2: Create Build Trigger

1. Click "Create Trigger"
2. Configure:
   - **Name:** `sync-player-deploy`
   - **Event:** Push to a branch
   - **Branch:** `main`
   - **Configuration:** Cloud Build configuration file
   - **Location:** Repository

### Step 3: Automatic Deployments

- Push to `main` branch
- Cloud Build automatically builds and deploys
- No manual intervention needed

## 🔧 Environment Variables

| Variable      | Description              | Default      |
| ------------- | ------------------------ | ------------ |
| `NODE_ENV`    | Environment mode         | `production` |
| `PORT`        | Server port              | `8080`       |
| `CORS_ORIGIN` | Allowed origins for CORS | `*`          |

## 📝 Pre-deployment Checklist

- [ ] Google Cloud account with billing enabled
- [ ] gcloud CLI installed and configured
- [ ] Required APIs enabled
- [ ] All files committed to Git
- [ ] `package.json` has correct start script
- [ ] `app.yaml` (for App Engine) or `Dockerfile` (for Cloud Run) exists
- [ ] Health check endpoint working (`/api/health`)

## 🧪 Testing Your Deployment

### Health Check

```bash
curl https://YOUR_APP_URL/api/health
```

Expected response:

```json
{
  "status": "ok",
  "connectedUsers": 0,
  "activeRooms": 0,
  "environment": "production",
  "platform": "gcp"
}
```

### Test Client

Visit: `https://YOUR_APP_URL/index.html`

### Socket.IO Connection Test

```javascript
// Update your frontend connection
const socket = io("https://YOUR_APP_URL");
```

## 🔗 Connecting Your Frontend

Update your frontend Socket.IO connection:

```javascript
// Development
const socket = io("http://localhost:3000");

// Production (Google Cloud)
const socket = io("https://YOUR_APP_URL");
```

## 🚨 Common Issues & Solutions

### App Engine Issues

**Issue:** App won't start

- **Solution:** Check `app.yaml` configuration and logs

**Issue:** WebSocket connections fail

- **Solution:** App Engine supports WebSockets, ensure proper CORS configuration

### Cloud Run Issues

**Issue:** Container build fails

- **Solution:** Check `Dockerfile` and `.dockerignore`

**Issue:** Cold start delays

- **Solution:** Use minimum instances or consider App Engine

### General Issues

**Issue:** CORS errors

- **Solution:** Set `CORS_ORIGIN` environment variable

**Issue:** Port binding errors

- **Solution:** Use `process.env.PORT` (already configured)

## 📊 Monitoring & Logs

### View Logs

```bash
# App Engine logs
gcloud app logs tail

# Cloud Run logs
gcloud logs tail --service=sync-player-server
```

### Cloud Console

- Go to [Google Cloud Console](https://console.cloud.google.com)
- Navigate to your service
- View logs, metrics, and performance

## 💰 Pricing Comparison

### App Engine

- **Free Tier:** 28 instance hours/day
- **Standard Environment:** Pay per use
- **Flexible Environment:** Pay per use

### Cloud Run

- **Free Tier:** 2 million requests/month
- **Pay per use:** After free tier

### Cost Optimization Tips

- Use appropriate instance sizes
- Set maximum instances limits
- Monitor usage with Cloud Monitoring

## 🔒 Security Best Practices

1. **Environment Variables**

   - Use Secret Manager for sensitive data
   - Don't commit secrets to Git

2. **Network Security**

   - Use HTTPS only
   - Configure proper CORS origins

3. **Authentication**
   - Consider adding authentication for production
   - Use Google Cloud IAM

## 🚀 Quick Start Commands

```bash
# 1. Install and configure gcloud
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# 2. Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 3. Deploy to App Engine
gcloud app deploy

# 4. Test deployment
curl https://YOUR_PROJECT_ID.uc.r.appspot.com/api/health
```

## 🎯 Why Google Cloud is Better for Socket.IO

- ✅ **Persistent connections** - App Engine supports long-running connections
- ✅ **Automatic scaling** - Handles traffic spikes efficiently
- ✅ **Global infrastructure** - Low latency worldwide
- ✅ **Integrated services** - Easy to add databases, caching, etc.
- ✅ **Cost effective** - Pay only for what you use
- ✅ **Enterprise features** - Security, monitoring, logging

## 📞 Support & Resources

- **Google Cloud Documentation:** [cloud.google.com/docs](https://cloud.google.com/docs)
- **App Engine Documentation:** [cloud.google.com/appengine/docs](https://cloud.google.com/appengine/docs)
- **Cloud Run Documentation:** [cloud.google.com/run/docs](https://cloud.google.com/run/docs)
- **Community:** [stackoverflow.com/questions/tagged/google-cloud-platform](https://stackoverflow.com/questions/tagged/google-cloud-platform)
