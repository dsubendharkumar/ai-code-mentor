# 🤖 AI Code Mentor

Progressive AI-powered hints for coding problems without revealing solutions.

## 🎯 Features

- **4-Level Progressive Hints**
  - Level 1: Intuition & Conceptual Understanding
  - Level 2: Algorithm Approach & Data Structures
  - Level 3: Step-by-Step Breakdown
  - Level 4: Pseudocode Structure

- **Multi-Platform Support**
  - LeetCode
  - HackerRank
  - Codeforces

- **Analytics & Tracking**
  - Hint history
  - Usage statistics
  - Popular problems tracking

## 🛠️ Tech Stack

**Frontend:**
- Chrome Extension (Manifest V3)
- Vanilla JavaScript

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose

**AI Integration:**
- Anthropic Claude API

## 📦 Installation

### Prerequisites
- Node.js v18+
- MongoDB
- Chrome Browser
- Anthropic API Key

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-code-mentor.git
cd ai-code-mentor/server
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-code-mentor
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-sonnet-4-20250514
```

4. Start the server
```bash
npm start
```

### Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Pin the extension to your toolbar

## 🚀 Usage

1. Navigate to any LeetCode, HackerRank, or Codeforces problem
2. Click the AI Code Mentor extension icon
3. Wait for problem detection
4. Click any hint level button
5. Receive AI-generated educational hint!

## 📊 Project Structure
```
ai-code-mentor/
├── extension/          # Chrome extension files
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js
│   └── background.js
└── server/            # Backend API
    ├── server.js
    ├── routes/
    ├── controllers/
    ├── models/
    └── services/
```

## 💡 How It Works

1. **Content Script** extracts problem from coding platform
2. **Extension Popup** displays detected problem
3. **Backend API** receives hint request
4. **AI Service** calls Anthropic Claude API with custom prompts
5. **MongoDB** stores hints and analytics
6. **User** receives progressive hint without solution

## 🔒 API Cost Optimization

- MongoDB caching reduces redundant API calls
- Request validation prevents unnecessary calls
- Rate limiting prevents abuse
- Cost per hint: ~$0.01-0.05

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Anthropic for Claude AI API
- LeetCode, HackerRank, Codeforces for problem platforms
```

---

## 🎯 **What to Do After Creating**

1. **Click "Create repository"**
2. **Add README content** (use the template above)
3. **Add .gitignore** for Node.js (prevents uploading node_modules, .env)
4. **Create folders**:
```
   extension/
   server/
