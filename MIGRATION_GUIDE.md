# Migration Guide: Render → Google Cloud Platform

This guide will help you migrate your Sync Player Server from Render to Google Cloud Platform.

## 🔄 Migration Overview

### What's Changing

- **Platform:** Render → Google Cloud Platform
- **Deployment:** Git-based → Multiple options (App Engine, Cloud Run)
- **Scaling:** Automatic → Configurable automatic scaling
- **Cost:** Free tier → Pay-per-use with generous free tier

### What Stays the Same

- ✅ Your Socket.IO server code
- ✅ Your API endpoints
- ✅ Your frontend integration
- ✅ Your real-time functionality

## 📋 Pre-Migration Checklist

### 1. Backup Your Current Deployment

```bash
# Get your current Render app URL
# Note down: https://your-app-name.onrender.com
```

### 2. Prepare Google Cloud Account

- [ ] Create Google Cloud account at [cloud.google.com](https://cloud.google.com)
- [ ] Enable billing (required for deployment)
- [ ] Install gcloud CLI: `curl https://sdk.cloud.google.com | bash`
- [ ] Initialize gcloud: `gcloud init`

### 3. Update Your Code

- [ ] All new configuration files are already created
- [ ] Your `index.js` has been updated for GCP platform detection
- [ ] Environment variables are configured

## 🚀 Migration Steps

### Step 1: Deploy to Google Cloud

#### Option A: Use the Automated Script (Recommended)

```bash
# Make the script executable (already done)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

#### Option B: Manual Deployment

**For App Engine:**

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Deploy to App Engine
gcloud app deploy
```

**For Cloud Run:**

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Deploy to Cloud Run
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

### Step 2: Test Your New Deployment

1. **Health Check:**

   ```bash
   curl https://YOUR_NEW_APP_URL/api/health
   ```

2. **Test Client:**

   - Visit: `https://YOUR_NEW_APP_URL/index.html`
   - Test Socket.IO connections

3. **Compare with Old Deployment:**
   - Test the same functionality on both platforms
   - Ensure all features work correctly

### Step 3: Update Your Frontend

Update your frontend Socket.IO connection:

```javascript
// OLD (Render)
const socket = io("https://your-app-name.onrender.com");

// NEW (Google Cloud)
const socket = io("https://YOUR_NEW_APP_URL");
```

### Step 4: Update Documentation

- Update any documentation that references the old Render URL
- Update any environment variables or configuration files
- Update any CI/CD pipelines

## 🔧 Configuration Comparison

| Feature                | Render                  | Google Cloud                                                        |
| ---------------------- | ----------------------- | ------------------------------------------------------------------- |
| **Platform Detection** | `platform: "render"`    | `platform: "google-app-engine"` or `"google-cloud-run"`             |
| **Port**               | `10000`                 | `8080`                                                              |
| **Scaling**            | Automatic               | Configurable automatic                                              |
| **Free Tier**          | 750 hours/month         | 28 instance hours/day (App Engine) or 2M requests/month (Cloud Run) |
| **Sleep Behavior**     | Sleeps after inactivity | Configurable (App Engine stays warm)                                |

## 🧪 Testing Checklist

### Functional Tests

- [ ] Health endpoint responds correctly
- [ ] Socket.IO connections work
- [ ] Room creation and joining works
- [ ] Real-time chat works
- [ ] User disconnection handling works
- [ ] Multiple users can connect simultaneously

### Performance Tests

- [ ] Response times are acceptable
- [ ] WebSocket connections are stable
- [ ] No connection drops during normal usage
- [ ] Scaling works under load

### Platform-Specific Tests

- [ ] Platform detection shows correct value
- [ ] Environment variables are set correctly
- [ ] Logs are accessible and informative

## 🚨 Common Migration Issues

### Issue: CORS Errors

**Solution:** Ensure `CORS_ORIGIN` environment variable is set correctly

### Issue: WebSocket Connection Fails

**Solution:** Both App Engine and Cloud Run support WebSockets, check your client configuration

### Issue: Cold Start Delays

**Solution:**

- App Engine: Use automatic scaling with minimum instances
- Cloud Run: Consider minimum instances or use App Engine

### Issue: Port Binding Errors

**Solution:** Your code already uses `process.env.PORT`, which is correctly configured

## 📊 Monitoring Migration

### Before Migration

- Note down current performance metrics
- Document any known issues
- Test all functionality thoroughly

### During Migration

- Monitor logs: `gcloud app logs tail` or `gcloud logs tail --service=sync-player-server`
- Check health endpoint frequently
- Test with multiple users

### After Migration

- Compare performance with previous deployment
- Monitor for any new issues
- Update monitoring dashboards

## 🔄 Rollback Plan

If you need to rollback to Render:

1. **Keep Render deployment running** during migration
2. **Test thoroughly** before switching traffic
3. **Update frontend** to point back to Render URL
4. **Monitor** for any issues

## 💰 Cost Comparison

### Render Free Tier

- 750 hours/month
- Sleeps after inactivity
- 100GB bandwidth/month

### Google Cloud Free Tier

- **App Engine:** 28 instance hours/day
- **Cloud Run:** 2 million requests/month
- **Both:** More generous than Render

### Cost Optimization Tips

- Set appropriate maximum instances
- Monitor usage with Cloud Monitoring
- Use appropriate instance sizes

## 🎯 Post-Migration Tasks

### 1. Update DNS/URLs

- Update any hardcoded URLs in your code
- Update any documentation
- Update any external integrations

### 2. Set Up Monitoring

- Configure Cloud Monitoring alerts
- Set up log aggregation
- Monitor costs and usage

### 3. Optimize Performance

- Tune scaling parameters
- Optimize instance sizes
- Monitor and adjust based on usage patterns

### 4. Clean Up

- Remove old Render deployment (after confirming everything works)
- Archive old configuration files
- Update team documentation

## 📞 Support

### Google Cloud Support

- **Documentation:** [cloud.google.com/docs](https://cloud.google.com/docs)
- **Community:** [stackoverflow.com/questions/tagged/google-cloud-platform](https://stackoverflow.com/questions/tagged/google-cloud-platform)
- **Status:** [status.cloud.google.com](https://status.cloud.google.com)

### Migration Support

- Check the `GCP_DEPLOYMENT.md` for detailed deployment instructions
- Use the `deploy.sh` script for automated deployment
- Monitor logs for any issues during migration

## 🎉 Migration Complete!

Once you've completed all steps and tested thoroughly:

1. ✅ Your app is running on Google Cloud Platform
2. ✅ All functionality is working correctly
3. ✅ Performance is acceptable or better
4. ✅ Monitoring is set up
5. ✅ Documentation is updated

You can now safely remove your Render deployment and enjoy the benefits of Google Cloud Platform!
