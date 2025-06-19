# Frontend Deployment Guide - Vercel

This guide will help you deploy your frontend to Vercel and connect it to your Render backend.

## 🚀 Deploy Frontend to Vercel

### Prerequisites

- GitHub account
- Your frontend code in a separate repository or branch
- Backend already deployed on Render

### Steps:

1. **Prepare Your Frontend Files**

   Create a new directory for your frontend with these files:

   - `index.html`
   - `script.js`
   - `styles.css`
   - `config.js`

2. **Update Backend URL**

   In `config.js`, update the `BACKEND_URL` to your Render deployment:

   ```javascript
   const config = {
     BACKEND_URL: "https://your-app-name.onrender.com",
     // ... other config
   };
   ```

3. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your repository or upload files
   - Deploy

4. **Your Frontend is Live!**
   - Your app will be available at: `https://your-app-name.vercel.app`
   - Test the connection to your Render backend

## 🔧 Configuration

### Backend URL Configuration

The frontend is configured to connect to your Render backend through the `config.js` file:

```javascript
const config = {
  BACKEND_URL: "https://sync-player-server.onrender.com",
  socketOptions: {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: true,
  },
};
```

### CORS Configuration

Your Render backend is already configured to allow all origins (`CORS_ORIGIN: "*"`), so your Vercel frontend should be able to connect without issues.

## 🧪 Testing Your Deployment

1. **Open your Vercel frontend URL**
2. **Enter a username and room ID**
3. **Click "Connect"**
4. **Verify connection to Render backend**

You should see:

- "Connected to server" message
- Room information displayed
- Ability to send/receive messages

## 🔗 Connecting Multiple Users

1. **Open multiple browser tabs/windows**
2. **Navigate to your Vercel frontend URL**
3. **Join the same room with different usernames**
4. **Test real-time chat functionality**

## 🚨 Common Issues & Solutions

### CORS Errors

- **Issue:** "CORS header 'Access-Control-Allow-Origin' missing"
- **Solution:** Ensure your Render backend has `CORS_ORIGIN: "*"` in environment variables

### Connection Timeout

- **Issue:** Frontend can't connect to backend
- **Solution:**
  - Check if Render backend is running
  - Verify the `BACKEND_URL` in `config.js`
  - Check network connectivity

### Socket.IO Connection Fails

- **Issue:** WebSocket connection errors
- **Solution:**
  - Ensure Socket.IO client version matches server version
  - Check if Render supports WebSockets (it does)
  - Verify the backend URL is correct

## 📁 File Structure for Vercel

```
your-frontend-repo/
├── index.html
├── script.js
├── styles.css
├── config.js
└── README.md
```

## 🔄 Environment Variables (Optional)

If you want to make the backend URL configurable, you can use Vercel environment variables:

1. **In Vercel dashboard, add environment variable:**

   ```
   REACT_APP_BACKEND_URL=https://your-app-name.onrender.com
   ```

2. **Update `config.js`:**
   ```javascript
   const config = {
     BACKEND_URL:
       process.env.REACT_APP_BACKEND_URL ||
       "https://sync-player-server.onrender.com",
     // ... other config
   };
   ```

## 💡 Tips

- **Development vs Production:** Use different backend URLs for development and production
- **Error Handling:** The frontend includes error handling for connection issues
- **Real-time Updates:** All room and chat updates happen in real-time
- **User Experience:** The UI shows connection status and room information

## 🔍 Debugging

### Check Browser Console

Open browser developer tools and check the console for:

- Connection errors
- Socket.IO events
- JavaScript errors

### Test Backend Health

Visit your Render backend health endpoint:

```
https://your-app-name.onrender.com/api/health
```

Should return:

```json
{
  "status": "ok",
  "connectedUsers": 0,
  "activeRooms": 0,
  "environment": "production",
  "platform": "render"
}
```

## 🎉 Success!

Once deployed, your frontend on Vercel will successfully connect to your backend on Render, enabling real-time room management and chat functionality across different domains.
