# 🤖 AI Code Mentor - Chrome Extension

A Chrome extension that helps students learn Data Structures and Algorithms by providing **progressive hints** instead of complete solutions. Uses AI (Claude/OpenAI) to generate educational hints at different levels.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [How It Works](#how-it-works)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- 🎯 **4-Level Progressive Hints**
  - Level 1: Intuition (conceptual understanding)
  - Level 2: Approach (algorithmic strategy)
  - Level 3: Steps (detailed breakdown)
  - Level 4: Pseudocode (algorithm structure)

- 🔒 **Strict No-Solution Policy**
  - AI is programmed to NEVER provide complete code solutions
  - Focuses on teaching and learning
  - Politely refuses if asked for full solutions

- 🌐 **Multi-Platform Support**
  - LeetCode
  - HackerRank
  - Codeforces

- 💾 **Data Persistence**
  - Hint history stored in MongoDB
  - User statistics and analytics
  - Problem tracking and popularity metrics

- 🎨 **Beautiful UI**
  - Modern, intuitive interface
  - Responsive design
  - Loading states and error handling

## 🛠 Tech Stack

### Frontend (Chrome Extension)
- **JavaScript** (Vanilla JS)
- **HTML5 & CSS3**
- **Chrome Extensions API** (Manifest V3)

### Backend
- **Node.js** (v18+)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (ODM)

### AI Integration
- **Anthropic Claude API** (Primary)
- **OpenAI API** (Alternative, not yet implemented)

### Additional Libraries
- **Helmet** (Security)
- **CORS** (Cross-origin resource sharing)
- **Morgan** (Logging)
- **Express Rate Limit** (Rate limiting)

## 📁 Project Structure

```
ai-code-mentor/
├── extension/                 # Chrome Extension
│   ├── manifest.json         # Extension manifest (v3)
│   ├── popup.html            # Popup UI
│   ├── popup.js              # Popup logic
│   ├── content.js            # Content script (extracts problems)
│   ├── background.js         # Service worker
│   ├── styles.css            # UI styles
│   └── icons/                # Extension icons
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
│
├── server/                    # Backend Server
│   ├── server.js             # Main server file
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables (create this)
│   ├── .env.example          # Environment template
│   │
│   ├── routes/
│   │   └── hintRoutes.js     # Hint API routes
│   │
│   ├── controllers/
│   │   └── hintController.js # Hint request handlers
│   │
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Hint.js           # Hint schema
│   │   └── Problem.js        # Problem schema
│   │
│   ├── services/
│   │   └── aiService.js      # AI API integration
│   │
│   └── middleware/
│       └── errorHandler.js   # Error handling
│
└── README.md                  # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **MongoDB** (v6 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Check if running: `mongosh` or `mongo`

3. **Google Chrome** (latest version)
   - Download: https://www.google.com/chrome/

4. **Anthropic Claude API Key**
   - Sign up: https://console.anthropic.com/
   - Get API key from dashboard

5. **Git** (optional, for cloning)
   - Download: https://git-scm.com/

## 🚀 Installation

### Step 1: Clone or Download the Project

```bash
# Option 1: Clone with Git
git clone <repository-url>
cd ai-code-mentor

# Option 2: Download and extract the ZIP file
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

This will install:
- express
- mongoose
- dotenv
- cors
- helmet
- morgan
- express-rate-limit
- @anthropic-ai/sdk
- axios

### Step 3: Create Extension Icons

You need to create icon files for the extension. You can:

**Option A: Use an AI image generator or design tool**
1. Create three PNG files: 16x16, 48x48, and 128x128 pixels
2. Save them in `extension/icons/` as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Option B: Use placeholder icons (temporary)**
1. Download any simple icon and resize it to the required dimensions
2. Or use this online tool: https://www.favicon-generator.org/

**Icon Design Suggestions:**
- Use a robot/AI theme
- Colors: Purple/blue gradient
- Include a lightbulb or brain icon
- Keep it simple and recognizable

## ⚙️ Configuration

### Step 1: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On macOS/Linux:
sudo systemctl start mongod

# On Windows:
# Start MongoDB from Services or run:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# Verify it's running:
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Use it in the `.env` file

### Step 2: Configure Environment Variables

```bash
cd server

# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use any text editor
```

**Required configuration in `.env`:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ai-code-mentor

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-code-mentor

# AI Configuration
ANTHROPIC_API_KEY=sk-ant-api03-xxx  # Your actual API key
AI_PROVIDER=claude
CLAUDE_MODEL=claude-sonnet-4-20250514

# CORS Settings
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Replace `sk-ant-api03-xxx` with your actual Anthropic API key!

### Step 3: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy and paste it into your `.env` file

## 🎮 Usage

### Starting the Backend Server

```bash
cd server

# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 ========================================
🤖 AI Code Mentor Server is running!
🚀 ========================================
📍 URL: http://localhost:5000
🌍 Environment: development
🤖 AI Provider: claude
```

### Installing the Chrome Extension

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `extension/` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "AI Code Mentor" in your extensions
   - Pin it to your toolbar for easy access

### Using the Extension

1. **Navigate to a Coding Problem**
   - Go to LeetCode, HackerRank, or Codeforces
   - Open any problem page

2. **Click the Extension Icon**
   - The extension will automatically detect the problem
   - You'll see the problem title displayed

3. **Request Hints**
   - Click on a hint level button (1-4)
   - Wait for the AI to generate your hint
   - Read and understand the hint
   - Try solving the problem yourself!

4. **Progress Through Levels**
   - Start with Level 1 for intuition
   - Move to Level 2 for approach
   - Use Level 3 for detailed steps
   - Check Level 4 for pseudocode if needed

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "AI Code Mentor API is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345.67
}
```

#### 2. Test Endpoint
```http
GET /api/hints/test
```

**Response:**
```json
{
  "success": true,
  "message": "AI Code Mentor API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 3. Get Hint (Main Endpoint)
```http
POST /api/hints/get-hint
```

**Request Body:**
```json
{
  "problemTitle": "Two Sum",
  "problemDescription": "Given an array of integers...",
  "problemUrl": "https://leetcode.com/problems/two-sum/",
  "platform": "LeetCode",
  "hintLevel": 2,
  "constraints": "1 <= nums.length <= 10^4",
  "examples": "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "hint": "Consider using a hash table to store...",
  "hintLevel": 2,
  "metadata": {
    "provider": "claude",
    "model": "claude-sonnet-4-20250514",
    "responseTime": 1234
  }
}
```

#### 4. Get User History
```http
GET /api/hints/history/:userId?limit=20
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "history": [...]
}
```

#### 5. Get Statistics
```http
GET /api/hints/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalHints": 1234,
    "totalProblems": 567,
    "platformDistribution": [...],
    "hintLevelDistribution": [...]
  }
}
```

## 🔧 How It Works

### Architecture Flow

```
User Browser
    ↓
[Chrome Extension]
    ↓ (detects problem)
[Content Script] → extracts problem text
    ↓
[Popup UI] → user clicks hint button
    ↓
[Backend API] (POST /api/hints/get-hint)
    ↓
[AI Service] → generates hint with strict rules
    ↓
[Database] → saves hint, updates stats
    ↓
[Response] → hint displayed to user
```

### AI Hint Generation Process

1. **Problem Extraction**: Content script extracts problem details from webpage
2. **Request Preparation**: Popup sends problem + hint level to backend
3. **Prompt Engineering**: AI service creates level-specific system prompt
4. **AI Generation**: Claude API generates educational hint
5. **Safety Check**: Validates no code solutions were provided
6. **Database Storage**: Saves hint and updates analytics
7. **Display**: Shows formatted hint to user

### Hint Level Progression

- **Level 1 (Intuition)**: What is the problem asking? Core concepts.
- **Level 2 (Approach)**: Which algorithm/data structure? Key insights.
- **Level 3 (Steps)**: Step-by-step breakdown. Edge cases. Complexity.
- **Level 4 (Pseudocode)**: Algorithm structure in generic pseudocode.

### Safety Mechanisms

The system has multiple layers to prevent providing full solutions:

1. **System Prompts**: Strict instructions for each hint level
2. **Code Detection**: Regex patterns detect actual code implementation
3. **Response Validation**: Checks hints before sending to user
4. **AI Training**: Claude is inherently designed to follow instructions

## 🔨 Development

### Running in Development Mode

```bash
# Backend with auto-reload
cd server
npm run dev

# Extension
# Just reload the extension in chrome://extensions/ after making changes
```

### Testing the API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test hint generation
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Test Problem",
    "problemDescription": "This is a test",
    "hintLevel": 1
  }'
```

### Debugging Tips

1. **Extension Console**:
   - Right-click extension icon → Inspect popup
   - Check console for errors

2. **Content Script Console**:
   - Open problem page
   - Press F12 → Console
   - Look for "AI Code Mentor content script loaded"

3. **Backend Logs**:
   - Check terminal where server is running
   - Logs show all API requests and errors

4. **Database**:
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Use database
   use ai-code-mentor
   
   # Check collections
   show collections
   
   # View hints
   db.hints.find().limit(5)
   ```

### Adding Support for New Platforms

To add support for another coding platform:

1. Edit `extension/content.js`
2. Add platform selectors to `PLATFORM_SELECTORS`
3. Update `manifest.json` with new content script matches
4. Test on the new platform

## 🐛 Troubleshooting

### Common Issues

#### 1. "No Problem Detected"

**Cause**: Extension can't find problem on page
**Solutions**:
- Make sure you're on a problem page (not the problem list)
- Try refreshing the page
- Wait a few seconds for page to fully load
- Check if platform is supported

#### 2. "Failed to connect to server"

**Cause**: Backend server not running
**Solutions**:
- Make sure server is running: `cd server && npm start`
- Check if MongoDB is running
- Verify port 5000 is not in use
- Check firewall settings

#### 3. "AI service error"

**Cause**: AI API issues
**Solutions**:
- Verify API key in `.env` is correct
- Check API key hasn't expired
- Verify internet connection
- Check Anthropic API status

#### 4. MongoDB Connection Error

**Solutions**:
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
# macOS/Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

#### 5. Extension Not Detecting Problem

**Solutions**:
- Open browser console (F12) and check for errors
- Reload the extension in chrome://extensions/
- Clear browser cache
- Try a different problem

### Getting Help

If you encounter issues:

1. Check the console logs (both extension and server)
2. Verify all environment variables are set correctly
3. Make sure all services are running (MongoDB, Node server)
4. Check that your API key is valid and has sufficient credits

## 📝 Best Practices for Users

1. **Start with Level 1**: Always begin with the intuition hint
2. **Think Before Clicking**: Try to solve before requesting the next level
3. **Don't Skip Levels**: Progressive learning is more effective
4. **Use Hints Wisely**: They're meant to guide, not solve for you
5. **Practice**: After understanding the hint, implement it yourself

## 🤝 Contributing

Contributions are welcome! Here are some ways to contribute:

- Report bugs
- Suggest new features
- Improve documentation
- Add support for new platforms
- Optimize AI prompts

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Anthropic Claude for the AI API
- LeetCode, HackerRank, and Codeforces for problem platforms
- The coding education community

## 📞 Support

For questions or issues:
- Check the [Troubleshooting](#troubleshooting) section
- Review the [API Documentation](#api-documentation)
- Examine server logs for error details

---

**Happy Learning! 🚀**

Remember: The goal is to learn and understand, not just to solve problems!
