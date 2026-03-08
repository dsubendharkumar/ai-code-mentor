# 🏗️ AI Code Mentor - Project Overview

## 📖 Project Description

**AI Code Mentor** is a Chrome extension that helps students learn Data Structures and Algorithms through progressive hints rather than complete solutions. It uses AI (Claude/OpenAI) to provide educational guidance at four different levels.

## 🎯 Core Philosophy

**"Learn by thinking, not by copying"**

The system is designed with strict guardrails to:
1. Never provide complete code solutions
2. Guide students through progressive learning
3. Encourage problem-solving skills
4. Build conceptual understanding

## 🏛️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Chrome Extension (Frontend)               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│  │  │ Content      │  │ Popup UI     │  │Background│ │    │
│  │  │ Script       │  │              │  │ Service  │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTPS)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server (Node.js)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js API Server                               │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐ │  │
│  │  │  Routes    │→ │Controllers │→ │   Services     │ │  │
│  │  │            │  │            │  │                │ │  │
│  │  │ /get-hint  │  │ Generate   │  │ AI Integration │ │  │
│  │  │ /history   │  │ Save Data  │  │ (Claude API)   │ │  │
│  │  │ /stats     │  │ Analytics  │  │                │ │  │
│  │  └────────────┘  └────────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────┬───────────────────┘
                       │                  │
                       ▼                  ▼
              ┌────────────────┐  ┌──────────────────┐
              │   MongoDB      │  │  Anthropic API   │
              │   Database     │  │  (Claude AI)     │
              │                │  │                  │
              │ • Hints        │  │ • Hint Gen       │
              │ • Users        │  │ • GPT-4 Alt      │
              │ • Problems     │  │                  │
              └────────────────┘  └──────────────────┘
```

### Component Breakdown

#### 1. Chrome Extension (Frontend)

**Content Script (`content.js`)**
- Runs on LeetCode, HackerRank, Codeforces pages
- Extracts problem information from DOM
- Detects platform-specific selectors
- Sends data to popup

**Popup UI (`popup.html`, `popup.js`, `styles.css`)**
- User interface for hint requests
- 4 hint level buttons
- Problem detection status
- Hint display area
- Settings panel
- Local storage for history

**Background Service Worker (`background.js`)**
- Manages extension lifecycle
- Handles storage cleanup
- Badge notifications
- Extension installation/update logic

#### 2. Backend Server (Node.js + Express)

**API Routes (`routes/hintRoutes.js`)**
- `GET /health` - Health check
- `GET /api/hints/test` - API test
- `POST /api/hints/get-hint` - Main hint endpoint
- `GET /api/hints/history/:userId` - User history
- `GET /api/hints/stats` - Platform statistics

**Controllers (`controllers/hintController.js`)**
- Request validation
- Business logic coordination
- Response formatting
- Error handling
- Async database operations

**Services (`services/aiService.js`)**
- AI API integration
- Prompt engineering
- Safety validation
- Token usage tracking
- Response parsing

**Models (`models/`)**
- `User.js` - User schema and methods
- `Hint.js` - Hint history schema
- `Problem.js` - Problem metadata schema

#### 3. Database (MongoDB)

**Collections:**

**users**
```javascript
{
  userId: String (unique),
  email: String (optional),
  totalHintsRequested: Number,
  totalProblemsViewed: Number,
  createdAt: Date,
  lastActive: Date,
  preferences: {
    defaultHintLevel: Number,
    favoriteTopics: [String]
  }
}
```

**hints**
```javascript
{
  userId: String,
  problemTitle: String,
  problemUrl: String,
  platform: String,
  problemDescription: String,
  hintLevel: Number (1-4),
  hintText: String,
  aiProvider: String,
  aiModel: String,
  tokenUsage: {
    inputTokens: Number,
    outputTokens: Number,
    totalTokens: Number
  },
  responseTimeMs: Number,
  createdAt: Date
}
```

**problems**
```javascript
{
  title: String,
  url: String (unique),
  platform: String,
  description: String,
  constraints: String,
  examples: String,
  difficulty: String,
  topics: [String],
  viewCount: Number,
  hintRequestCount: Number,
  popularHintLevel: Number,
  firstSeen: Date,
  lastAccessed: Date
}
```

## 🔐 Security & Safety

### AI Safety Mechanisms

**1. System Prompts (Multi-Layer)**
- Base prompt: Never provide solutions
- Level-specific prompts: Enforce hint boundaries
- Temperature: 0.7 for balanced creativity/consistency

**2. Code Detection Filter**
```javascript
// Regex patterns detect actual code
- Function definitions
- Class definitions
- Long code blocks
- Language-specific syntax
```

**3. Response Validation**
- Pre-send safety check
- Rejection of solution-like responses
- Fallback to safer hint level

### API Security

**1. Rate Limiting**
- 100 requests per 15 minutes
- Per-IP tracking
- Configurable via environment

**2. CORS Protection**
- Configurable origins
- Credential handling
- Header validation

**3. Input Validation**
- Required field checking
- Type validation
- Length limits
- Sanitization

**4. Error Handling**
- Centralized error middleware
- No sensitive data in errors (production)
- Detailed logging (development)
- Graceful degradation

## 🎓 Educational Design

### Hint Level Progression

**Level 1: Intuition (3-4 sentences)**
- Core concept identification
- Problem reframing
- Analogies and mental models
- Similar problem references

**Level 2: Approach (4-5 sentences)**
- Data structure suggestions
- Algorithm technique (DP, greedy, etc.)
- Key insight revelation
- Trade-off discussion

**Level 3: Steps (numbered list)**
- Step-by-step breakdown
- Edge case identification
- Complexity analysis
- Implementation considerations

**Level 4: Pseudocode (structured)**
- Language-agnostic algorithm
- Logic flow and structure
- Commented explanations
- Still not actual implementation

### Learning Principles Applied

1. **Scaffolding**: Progressive complexity
2. **Active Learning**: Students must think
3. **Zone of Proximal Development**: Hints calibrated to challenge
4. **Metacognition**: Students aware of their thinking process

## 🔄 Data Flow

### Hint Request Flow

```
1. User opens extension on problem page
   ↓
2. Content script extracts problem info
   ↓
3. User clicks hint level button
   ↓
4. Popup sends POST /api/hints/get-hint
   ↓
5. Controller validates request
   ↓
6. AI Service generates hint
   ↓
7. Safety check validates response
   ↓
8. Save to database (async)
   ↓
9. Return hint to popup
   ↓
10. Display formatted hint to user
```

### Database Write Flow (Async)

```
After hint generation:
├── Save hint record
├── Update/create problem stats
├── Update/create user stats
└── All non-blocking
```

## 📊 Analytics & Tracking

### Metrics Collected

**User Metrics**
- Total hints requested
- Total problems viewed
- Last active time
- Favorite topics (future)

**Problem Metrics**
- View count
- Hint request count
- Most popular hint level
- First seen / last accessed

**Hint Metrics**
- Platform distribution
- Hint level distribution
- Token usage
- Response times

### Privacy Considerations

- User IDs are anonymized
- No personal data collected
- No problem solutions stored
- Opt-in analytics only

## 🛠️ Development Decisions

### Why These Technologies?

**Chrome Extension (Manifest V3)**
- Modern, secure API
- Service workers for background tasks
- Better permission model
- Future-proof

**Node.js + Express**
- Fast development
- Rich ecosystem
- Easy async handling
- JavaScript consistency

**MongoDB**
- Flexible schema
- Great for analytics
- Easy aggregation
- Scalable

**Anthropic Claude**
- Strong instruction following
- Good at educational content
- Safety-aligned
- Excellent reasoning

### Alternative Approaches Considered

1. **Frontend-Only AI**: Rejected due to API key exposure
2. **GraphQL**: Overkill for simple CRUD operations
3. **PostgreSQL**: Too rigid for evolving schema
4. **WebSockets**: Not needed without real-time features
5. **Serverless**: Adds complexity for this use case

## 🚀 Scalability Considerations

### Current Capacity

- Handles ~1000 requests/hour
- Single server deployment
- Local MongoDB

### Future Scaling Options

**Horizontal Scaling**
- Load balancer
- Multiple Node.js instances
- MongoDB replica set

**Caching Layer**
- Redis for popular hints
- CDN for static assets
- Hint result caching

**Database Optimization**
- Indexes on frequently queried fields
- Sharding by userId or platform
- Archive old data

**API Optimization**
- Batch hint requests
- Stream responses
- Compress responses

## 🔮 Future Enhancements

### Phase 2 Features

1. **User Authentication**
   - Login system
   - Profile management
   - Personal dashboard

2. **Advanced Analytics**
   - Learning progress tracking
   - Weak topic identification
   - Personalized recommendations

3. **Social Features**
   - Hint quality ratings
   - Community hints
   - Study groups

4. **Enhanced AI**
   - Context-aware hints
   - Multi-turn conversations
   - Socratic questioning

5. **More Platforms**
   - CodeChef
   - AtCoder
   - CodeSignal

6. **Mobile App**
   - iOS/Android support
   - Cross-device sync

### Technical Debt to Address

- Add comprehensive testing
- CI/CD pipeline
- Better error recovery
- Offline mode
- Hint quality monitoring

## 📈 Success Metrics

### Product Success
- User retention > 60%
- Average hint level progression
- Time to solution decrease
- User satisfaction > 4/5

### Technical Success
- API uptime > 99.5%
- Response time < 2s
- Error rate < 1%
- Zero security incidents

## 🤝 Contributing Guidelines

### Code Standards

- Use ESLint for JavaScript
- Follow Airbnb style guide
- Document all functions
- Write meaningful commits

### Testing Requirements

- Unit tests for core logic
- Integration tests for API
- E2E tests for extension
- 80% code coverage minimum

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Write tests
4. Update documentation
5. Submit PR with description

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- Anthropic for Claude API
- MongoDB team for excellent documentation
- Chrome Extensions team for Manifest V3 guides
- The coding education community

---

**Built with ❤️ for learners by learners**
