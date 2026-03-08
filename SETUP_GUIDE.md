# 🚀 Quick Setup Guide - AI Code Mentor

This guide will help you get the AI Code Mentor up and running in **15 minutes**.

## ✅ Pre-Setup Checklist

Before starting, make sure you have:

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Google Chrome browser
- [ ] Anthropic API key (get from https://console.anthropic.com/)
- [ ] Text editor (VS Code, Sublime, etc.)

---

## 📦 Step 1: Install Dependencies (3 minutes)

### 1.1 Navigate to Server Directory

```bash
cd ai-code-mentor/server
```

### 1.2 Install Node Packages

```bash
npm install
```

**Expected output:**
```
added 87 packages in 15s
```

If you see any errors, make sure Node.js is properly installed:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## 🗄️ Step 2: Setup Database (5 minutes)

### Option A: Local MongoDB (Recommended for Development)

#### 2.1 Check if MongoDB is Running

```bash
mongosh
```

If you see a MongoDB prompt, you're good! Type `exit` to leave.

#### 2.2 If MongoDB is NOT Running

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
```

**Windows:**
```bash
# Start from Services panel
# Or run: net start MongoDB
```

#### 2.3 Verify Connection

```bash
mongosh
# You should see: "Connected to MongoDB"
exit
```

### Option B: MongoDB Atlas (Cloud Alternative)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. You'll use this in Step 3

---

## 🔑 Step 3: Configure Environment (5 minutes)

### 3.1 Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create Key"
5. **Copy the key** (it starts with `sk-ant-api03-`)
6. **Save it somewhere safe** - you can only see it once!

### 3.2 Create .env File

```bash
# Make sure you're in the server directory
cd server

# Copy the example file
cp .env.example .env
```

### 3.3 Edit the .env File

Open `.env` in your text editor and update:

```env
PORT=5000
NODE_ENV=development

# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ai-code-mentor

# OR For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-code-mentor

# PASTE YOUR API KEY HERE:
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE

AI_PROVIDER=claude
CLAUDE_MODEL=claude-sonnet-4-20250514

CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Critical**: Replace `sk-ant-api03-YOUR_ACTUAL_KEY_HERE` with your real API key!

### 3.4 Verify Configuration

```bash
# Make sure your .env file exists
ls -la .env

# Check it has content (but don't expose your API key publicly!)
cat .env | grep ANTHROPIC_API_KEY
```

---

## 🎨 Step 4: Create Extension Icons (2 minutes)

### Quick Solution: Download Free Icons

1. Go to https://www.flaticon.com/ or https://icons8.com/
2. Search for "robot" or "ai brain"
3. Download in these sizes: 16x16, 48x48, 128x128
4. Save as:
   - `extension/icons/icon16.png`
   - `extension/icons/icon48.png`
   - `extension/icons/icon128.png`

### Alternative: Create Simple Placeholder

```bash
cd ../extension/icons

# Use ImageMagick (if installed)
convert -size 16x16 xc:purple icon16.png
convert -size 48x48 xc:purple icon48.png
convert -size 128x128 xc:purple icon128.png
```

Or just download any small PNG and resize it using any image editor.

---

## 🚀 Step 5: Start the Backend (1 minute)

```bash
cd ../../server  # Navigate to server directory
npm start
```

**You should see:**
```
✅ MongoDB connected successfully
📊 Database: ai-code-mentor
🚀 ========================================
🤖 AI Code Mentor Server is running!
🚀 ========================================
📍 URL: http://localhost:5000
🌍 Environment: development
🤖 AI Provider: claude
🧠 AI Model: claude-sonnet-4-20250514
🚀 ========================================
```

### Test the Server

Open a new terminal and run:

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "AI Code Mentor API is healthy",
  "timestamp": "2024-...",
  "uptime": 5.123
}
```

✅ **If you see this, your backend is working!**

---

## 🔌 Step 6: Install Chrome Extension (2 minutes)

### 6.1 Open Chrome Extensions Page

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Or: Menu (⋮) → More Tools → Extensions

### 6.2 Enable Developer Mode

- Toggle the **"Developer mode"** switch in the top right corner

### 6.3 Load the Extension

1. Click **"Load unpacked"** button
2. Navigate to your project folder
3. Select the `extension/` folder
4. Click **"Select Folder"**

### 6.4 Verify Installation

- You should see "AI Code Mentor" card appear
- Status should be "Enabled"
- **Pin it to toolbar**: Click the puzzle icon, then pin AI Code Mentor

---

## 🎯 Step 7: Test the Extension (3 minutes)

### 7.1 Navigate to a Problem

Go to one of these sites:
- https://leetcode.com/problems/two-sum/
- https://www.hackerrank.com/challenges/solve-me-first/
- https://codeforces.com/problemset/problem/4/A

### 7.2 Open the Extension

- Click the AI Code Mentor icon in your toolbar
- You should see "Problem Detected" with the problem title

### 7.3 Request a Hint

1. Click "Level 1: Intuition"
2. Wait 2-3 seconds
3. You should see a hint appear!

### 7.4 If It Works...

🎉 **Congratulations! Everything is set up correctly!**

---

## 🐛 Troubleshooting

### Problem: "No Problem Detected"

**Solution:**
- Refresh the page
- Make sure you're on a problem page (not the problem list)
- Wait a few seconds after page loads

### Problem: "Failed to connect to server"

**Solution:**
```bash
# Check if server is running
curl http://localhost:5000/health

# If not running, start it:
cd server
npm start
```

### Problem: "AI service error"

**Solution:**
1. Check your API key in `.env` file
2. Make sure there are no extra spaces
3. Verify the key is active at https://console.anthropic.com/

### Problem: MongoDB Connection Error

**Solution:**
```bash
# Check MongoDB status
mongosh

# If not running:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

### Problem: Extension Not Loading

**Solution:**
1. Make sure you selected the `extension/` folder (not the root folder)
2. Check that `manifest.json` exists in the folder you selected
3. Look for errors in chrome://extensions/
4. Try clicking "Reload" on the extension card

---

## 🎓 Next Steps

Now that everything is working:

1. **Try Different Hint Levels**: Test all 4 levels on a problem
2. **Try Different Platforms**: Visit LeetCode, HackerRank, and Codeforces
3. **Check the Database**: 
   ```bash
   mongosh
   use ai-code-mentor
   db.hints.find().pretty()
   ```
4. **View Statistics**:
   ```bash
   curl http://localhost:5000/api/hints/stats
   ```

---

## 📚 Useful Commands

### Start Server (Development with Auto-Reload)
```bash
cd server
npm run dev
```

### View Server Logs
The logs will show in the terminal where you ran `npm start`

### Check Database
```bash
mongosh
use ai-code-mentor
db.hints.find().count()      # Count total hints
db.problems.find().limit(5)   # View recent problems
db.users.find()               # View users
```

### Restart Extension
1. Go to `chrome://extensions/`
2. Click the reload icon on AI Code Mentor card

---

## 💡 Tips for Development

1. **Keep Server Running**: Leave the terminal with the server running open
2. **Reload Extension**: After changing extension files, reload in Chrome
3. **Check Logs**: Always check both browser console and server logs
4. **Test Incrementally**: Test after each change

---

## 📞 Getting Help

If you're stuck:

1. **Check Console Logs**:
   - Extension: Right-click icon → Inspect popup → Console
   - Server: Terminal where server is running

2. **Common Issues**: See Troubleshooting section above

3. **Verify Each Step**: Make sure all previous steps completed successfully

---

## ✅ Setup Complete!

You should now have:
- ✅ Backend server running on http://localhost:5000
- ✅ MongoDB connected and storing data
- ✅ Chrome extension installed and working
- ✅ AI hints generating successfully

**Happy coding and learning! 🚀**
