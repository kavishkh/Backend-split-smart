# SplitSmart Backend Deployment Checklist

## 🚨 CRITICAL: MongoDB Atlas Configuration

### 1. Verify Database User Credentials
- [ ] Log in to MongoDB Atlas
- [ ] Go to **Database Access** in the left sidebar
- [ ] Verify that user `kavishkhanna06_db_user` exists
- [ ] Verify the password is `kavish123`
- [ ] Ensure the user has **"Read and write to any database"** role

### 2. Update Database User (If Needed)
If the user doesn't exist or credentials are wrong:
1. Click **Add New Database User**
2. Set Username: `kavishkhanna06_db_user`
3. Set Password: `kavish123`
4. Set Privileges: **Read and write to any database**
5. Click **Add User**

### 3. Configure Network Access
- [ ] Go to **Network Access** in the left sidebar
- [ ] Click **Add IP Address**
- [ ] Select **Allow Access From Anywhere** (0.0.0.0/0)
- [ ] Click **Confirm**

⚠️ **Security Note**: For production, restrict to specific IP addresses.

## 🛠 RENDER DEPLOYMENT CONFIGURATION

### 1. Environment Variables in Render Dashboard
Go to your Render service → Settings → Environment Variables and ensure:

```
MONGODB_URI=mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0
DATABASE_NAME=splitwiseApp
NODE_ENV=production
PORT=10000
USE_REAL_EMAILS=false
FRONTEND_URL=https://frontend-split-smart.vercel.app
GOOGLE_CALLBACK_URL=https://backend-split-smart.onrender.com/auth/google/callback
```

### 2. Verify render.yaml Configuration
Your `render.yaml` should contain:

```yaml
services:
  - type: web
    name: backend-split-smart
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: USE_REAL_EMAILS
        value: "false"
      - key: MONGODB_URI
        value: mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0
      - key: DATABASE_NAME
        value: splitwiseApp
      - key: FRONTEND_URL
        value: https://frontend-split-smart.vercel.app
      - key: GOOGLE_CALLBACK_URL
        value: https://backend-split-smart.onrender.com/auth/google/callback
```

## 🔍 DEBUGGING STEPS

### 1. Test MongoDB Connection Locally
```bash
node debug-mongodb.js
```

### 2. Check Environment Variables
Verify that the correct MongoDB URI is being loaded.

### 3. Monitor Render Logs
After deployment, check the logs for:
- MongoDB URI being used
- Authentication errors
- Connection timeouts

## 🧪 TESTING ENDPOINTS

### 1. Health Check
Visit: `https://backend-split-smart.onrender.com/api/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "databaseConnected": true/false,
  "uptime": ...,
  "environment": "production"
}
```

### 2. Test CORS
Visit: `https://backend-split-smart.onrender.com/api/test`

Should return:
```json
{
  "message": "CORS is working correctly!",
  "origin": "...",
  "timestamp": "..."
}
```

## 🆘 TROUBLESHOOTING

### If MongoDB Authentication Still Fails:

1. **Double-check credentials**:
   - Username: `kavishkhanna06_db_user`
   - Password: `kavish123`

2. **Verify cluster name**:
   - Should be: `cluster0.wv2snu3.mongodb.net`

3. **Check database name in URI**:
   - Should include: `/splitwiseApp`

4. **Ensure IP whitelist**:
   - Must include: `0.0.0.0/0`

5. **Test with simple connection**:
   ```bash
   # Create test-mongodb-simple.js
   const { MongoClient } = require('mongodb');
   
   const uri = "mongodb+srv://kavishkhanna06_db_user:kavish123@cluster0.wv2snu3.mongodb.net/splitwiseApp?appName=Cluster0";
   
   async function test() {
     const client = new MongoClient(uri);
     try {
       await client.connect();
       console.log('✅ Connected successfully');
       await client.db("splitwiseApp").command({ ping: 1 });
       console.log('✅ Ping successful');
     } catch (error) {
       console.error('❌ Connection failed:', error.message);
     } finally {
       await client.close();
     }
   }
   
   test();
   ```

## ✅ DEPLOYMENT READY CHECKLIST

- [ ] MongoDB Atlas user exists with correct credentials
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Render environment variables are correctly set
- [ ] Application starts without crashing
- [ ] Health check endpoint is accessible
- [ ] CORS is properly configured for frontend
- [ ] Google OAuth callback URL is correct
- [ ] Email service uses mock mode (no SMTP connection attempts)

## 🚀 DEPLOY COMMANDS

```bash
git add .
git commit -m "Fix MongoDB authentication and make deployment-ready"
git push
```

Then trigger a new deploy on Render.