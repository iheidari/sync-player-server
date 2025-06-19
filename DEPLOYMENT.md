# Deployment Guide - Vercel

This guide will help you deploy your Socket.IO server to Vercel.

## 🚀 Deploy to Vercel

### Prerequisites

- GitHub account
- Your code pushed to a GitHub repository

### Steps:

1. **Go to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Your Project**

   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Node.js app

3. **Configure the Project**

   - **Project Name:** `sync-player-server` (or any name you prefer)
   - **Framework Preset:** Node.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** Leave empty (not needed for this project)
   - **Output Directory:** Leave empty (not needed for this project)
   - **Install Command:** `npm install`

4. **Environment Variables** (Optional)

   - Click "Environment Variables" section
   - Add these variables:
     ```
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-domain.com
     ```

5. **Deploy**

   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Wait for the build to complete (usually 1-2 minutes)

6. **Your App is Live!**
   - Your app will be available at: `https://your-app-name.vercel.app`
   - Test the health endpoint: `https://your-app-name.vercel.app/api/health`
   - Test the client: `https://your-app-name.vercel.app/index.html`

## 🔧 Environment Variables

| Variable      | Description              | Default       |
| ------------- | ------------------------ | ------------- |
| `NODE_ENV`    | Environment mode         | `development` |
| `CORS_ORIGIN` | Allowed origins for CORS | `*`           |

## 📝 Pre-deployment Checklist

- [ ] All files committed to Git
- [ ] `package.json` has correct dependencies
- [ ] `vercel.json` configuration file exists
- [ ] Health check endpoint working (`/api/health`)
- [ ] Socket.IO server properly configured

## 🧪 Testing Your Deployment

1. **Health Check:**

   ```
   https://your-app-name.vercel.app/api/health
   ```

   Should return:

   ```json
   {
     "status": "ok",
     "connectedUsers": 0,
     "activeRooms": 0,
     "environment": "production",
     "platform": "vercel"
   }
   ```

2. **Test Client:**

   ```
   https://your-app-name.vercel.app/index.html
   ```

3. **Socket.IO Connection:**
   - Open multiple browser tabs
   - Join the same room
   - Test real-time chat functionality

## 🔗 Connecting Your Frontend

Update your frontend Socket.IO connection:

```javascript
// Development
const socket = io("http://localhost:3000");

// Production (Vercel)
const socket = io("https://your-app-name.vercel.app");
```

## 🚨 Common Issues & Solutions

### Build Fails

- **Issue:** `npm install` fails
- **Solution:** Check `package.json` has all dependencies listed

### Socket.IO Connection Issues

- **Issue:** WebSocket connection fails
- **Solution:** Vercel supports WebSockets, check your client configuration

### CORS Errors

- **Issue:** Frontend can't connect to Socket.IO
- **Solution:** Set `CORS_ORIGIN` environment variable

### Function Timeout

- **Issue:** Long-running operations timeout
- **Solution:** Vercel has a 30-second timeout limit (configured in vercel.json)

## 📊 Monitoring & Logs

### View Logs

- Go to your project dashboard on Vercel
- Click "Functions" tab
- View real-time logs for each function

### Analytics

- Built-in analytics and performance monitoring
- Real-time metrics and error tracking

## 🔄 Automatic Deployments

- Push to your `main` branch
- Vercel automatically rebuilds and deploys
- Preview deployments for pull requests
- No manual intervention needed

## 💰 Pricing

| Plan       | Price     | Features                           |
| ---------- | --------- | ---------------------------------- |
| Hobby      | $0/month  | 100GB bandwidth, 100GB storage     |
| Pro        | $20/month | 1TB bandwidth, 1TB storage         |
| Enterprise | Custom    | Unlimited bandwidth, custom limits |

## 🎯 Free Tier Features

- **100GB bandwidth** per month
- **100GB storage**
- **Unlimited serverless functions**
- **Automatic HTTPS**
- **Global CDN**
- **Custom domains**

## ⚠️ Vercel Limitations

- **Function timeout:** 30 seconds maximum
- **Memory:** 1024MB per function
- **WebSocket:** Supported but with some limitations
- **File system:** Read-only in production

## 📞 Support

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status Page:** [vercel-status.com](https://vercel-status.com)

## 🚀 Quick Start Commands

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 2. Deploy on Vercel (via web interface)
# Follow the steps above

# 3. Test your deployment
curl https://your-app-name.vercel.app/api/health
```

## 🔧 Vercel CLI (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from command line
vercel

# Deploy to production
vercel --prod
```
