# Deployment Guide - Render

This guide will help you deploy your Socket.IO server to Render.

## 🚀 Deploy to Render

### Prerequisites

- GitHub account
- Your code pushed to a GitHub repository

### Steps:

1. **Go to Render**

   - Visit [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**

   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your Socket.IO server

3. **Configure the Service**

   - **Name:** `sync-player-server` (or any name you prefer)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or choose a paid plan)

4. **Environment Variables** (Optional)

   - Click "Environment" tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=10000
     CORS_ORIGIN=https://your-frontend-domain.com
     ```

5. **Deploy**

   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the build to complete (usually 2-3 minutes)

6. **Your App is Live!**
   - Your app will be available at: `https://your-app-name.onrender.com`
   - Test the health endpoint: `https://your-app-name.onrender.com/api/health`
   - Test the client: `https://your-app-name.onrender.com/index.html`

## 🔧 Environment Variables

| Variable      | Description              | Default                  |
| ------------- | ------------------------ | ------------------------ |
| `NODE_ENV`    | Environment mode         | `development`            |
| `PORT`        | Server port              | `10000` (Render default) |
| `CORS_ORIGIN` | Allowed origins for CORS | `*`                      |

## 📝 Pre-deployment Checklist

- [ ] All files committed to Git
- [ ] `package.json` has correct start script (`"start": "node index.js"`)
- [ ] `render.yaml` configuration file exists
- [ ] Health check endpoint working (`/api/health`)
- [ ] Socket.IO server properly configured

## 🧪 Testing Your Deployment

1. **Health Check:**

   ```
   https://your-app-name.onrender.com/api/health
   ```

   Should return:

   ```json
   {
     "status": "ok",
     "connectedUsers": 0,
     "activeRooms": 0,
     "environment": "production"
   }
   ```

2. **Test Client:**

   ```
   https://your-app-name.onrender.com/index.html
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

// Production (Render)
const socket = io("https://your-app-name.onrender.com");
```

## 🚨 Common Issues & Solutions

### Build Fails

- **Issue:** `npm install` fails
- **Solution:** Check `package.json` has all dependencies listed

### App Won't Start

- **Issue:** Port binding errors
- **Solution:** Use `process.env.PORT` in your code (already configured)

### CORS Errors

- **Issue:** Frontend can't connect to Socket.IO
- **Solution:** Set `CORS_ORIGIN` environment variable

### Socket.IO Connection Issues

- **Issue:** WebSocket connection fails
- **Solution:** Render supports WebSockets, check your client configuration

## 📊 Monitoring & Logs

### View Logs

- Go to your service dashboard on Render
- Click "Logs" tab
- View real-time logs

### Health Checks

- Render automatically checks `/api/health` endpoint
- Service restarts if health check fails

## 🔄 Automatic Deployments

- Push to your `main` branch
- Render automatically rebuilds and deploys
- No manual intervention needed

## 💰 Pricing

| Plan     | Price     | Features                                |
| -------- | --------- | --------------------------------------- |
| Free     | $0/month  | 750 hours/month, sleep after inactivity |
| Starter  | $7/month  | Always on, 512MB RAM                    |
| Standard | $25/month | Always on, 1GB RAM                      |

## 🎯 Free Tier Limitations

- **Sleep after inactivity:** App goes to sleep after 15 minutes of no traffic
- **Cold starts:** First request after sleep takes 10-30 seconds
- **Bandwidth:** 100GB/month
- **Build minutes:** 400 minutes/month

## 📞 Support

- **Render Documentation:** [render.com/docs](https://render.com/docs)
- **Community:** [render.com/community](https://render.com/community)
- **Status Page:** [status.render.com](https://status.render.com)

## 🚀 Quick Start Commands

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main

# 2. Deploy on Render (via web interface)
# Follow the steps above

# 3. Test your deployment
curl https://your-app-name.onrender.com/api/health
```
