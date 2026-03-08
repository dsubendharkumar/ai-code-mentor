# 🧪 API Testing Guide

This guide provides examples for testing the AI Code Mentor API endpoints.

## 🔧 Prerequisites

- Backend server running on http://localhost:5000
- MongoDB connected
- API key configured in .env

## 📍 Base URL

```
http://localhost:5000
```

---

## 1️⃣ Health Check

Check if the API is running.

### cURL
```bash
curl http://localhost:5000/health
```

### Response
```json
{
  "success": true,
  "message": "AI Code Mentor API is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

---

## 2️⃣ Test Endpoint

Verify the hints API is accessible.

### cURL
```bash
curl http://localhost:5000/api/hints/test
```

### Response
```json
{
  "success": true,
  "message": "AI Code Mentor API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 3️⃣ Get Hint (Main Feature)

Request a hint for a coding problem.

### cURL - Level 1 (Intuition)
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Two Sum",
    "problemDescription": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    "problemUrl": "https://leetcode.com/problems/two-sum/",
    "platform": "LeetCode",
    "hintLevel": 1,
    "constraints": "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9",
    "examples": "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    "userId": "test-user-123"
  }'
```

### cURL - Level 2 (Approach)
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Two Sum",
    "problemDescription": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "problemUrl": "https://leetcode.com/problems/two-sum/",
    "platform": "LeetCode",
    "hintLevel": 2,
    "userId": "test-user-123"
  }'
```

### cURL - Level 3 (Steps)
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Two Sum",
    "problemDescription": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "hintLevel": 3
  }'
```

### cURL - Level 4 (Pseudocode)
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Two Sum",
    "problemDescription": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "hintLevel": 4
  }'
```

### Expected Response
```json
{
  "success": true,
  "hint": "Think about this problem in terms of searching. For each number in the array, you need to find if there exists another number that, when added together, equals the target. The key question is: how can you efficiently check if a complement exists?",
  "hintLevel": 1,
  "metadata": {
    "provider": "claude",
    "model": "claude-sonnet-4-20250514",
    "responseTime": 1234
  }
}
```

---

## 4️⃣ Get User History

Retrieve hint history for a user.

### cURL
```bash
curl http://localhost:5000/api/hints/history/test-user-123?limit=10
```

### Response
```json
{
  "success": true,
  "count": 5,
  "history": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "userId": "test-user-123",
      "problemTitle": "Two Sum",
      "problemUrl": "https://leetcode.com/problems/two-sum/",
      "platform": "LeetCode",
      "hintLevel": 2,
      "aiProvider": "claude",
      "aiModel": "claude-sonnet-4-20250514",
      "createdAt": "2024-01-15T10:25:00.000Z"
    }
  ]
}
```

---

## 5️⃣ Get Statistics

Retrieve overall platform statistics.

### cURL
```bash
curl http://localhost:5000/api/hints/stats
```

### Response
```json
{
  "success": true,
  "stats": {
    "totalHints": 156,
    "totalProblems": 89,
    "platformDistribution": [
      {
        "_id": "LeetCode",
        "count": 98,
        "avgHintLevel": 2.3
      },
      {
        "_id": "HackerRank",
        "count": 42,
        "avgHintLevel": 2.1
      },
      {
        "_id": "Codeforces",
        "count": 16,
        "avgHintLevel": 2.8
      }
    ],
    "hintLevelDistribution": [
      { "_id": 1, "count": 45 },
      { "_id": 2, "count": 52 },
      { "_id": 3, "count": 38 },
      { "_id": 4, "count": 21 }
    ]
  }
}
```

---

## 📦 Postman Collection

### Import into Postman

Create a new collection with these requests:

**Collection Variables:**
- `base_url`: `http://localhost:5000`

### Request 1: Health Check
- **Method**: GET
- **URL**: `{{base_url}}/health`

### Request 2: Get Hint - Level 1
- **Method**: POST
- **URL**: `{{base_url}}/api/hints/get-hint`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
```json
{
  "problemTitle": "Two Sum",
  "problemDescription": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "problemUrl": "https://leetcode.com/problems/two-sum/",
  "platform": "LeetCode",
  "hintLevel": 1,
  "userId": "postman-test"
}
```

### Request 3: Get History
- **Method**: GET
- **URL**: `{{base_url}}/api/hints/history/postman-test?limit=20`

### Request 4: Get Stats
- **Method**: GET
- **URL**: `{{base_url}}/api/hints/stats`

---

## 🧪 Testing Different Problems

### Binary Search Problem
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Binary Search",
    "problemDescription": "Given a sorted array of integers and a target value, find the index of the target. If the target is not in the array, return -1.",
    "hintLevel": 2,
    "userId": "test-user"
  }'
```

### Linked List Cycle
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Linked List Cycle",
    "problemDescription": "Given a linked list, determine if it has a cycle in it.",
    "hintLevel": 1,
    "userId": "test-user"
  }'
```

### Valid Parentheses
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Valid Parentheses",
    "problemDescription": "Given a string containing just the characters (,), {, }, [ and ], determine if the input string is valid.",
    "hintLevel": 3,
    "userId": "test-user"
  }'
```

---

## 🔍 Testing Error Cases

### Invalid Hint Level
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Test",
    "problemDescription": "Test problem",
    "hintLevel": 5
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid hint level. Must be between 1 and 4."
}
```

### Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "hintLevel": 1
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Missing required fields: problemTitle, problemDescription, and hintLevel are required"
}
```

---

## 📊 Performance Testing

### Measure Response Time
```bash
time curl -X POST http://localhost:5000/api/hints/get-hint \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Test Problem",
    "problemDescription": "This is a test",
    "hintLevel": 1
  }'
```

### Concurrent Requests (Simple Load Test)
```bash
# Run 10 requests in parallel
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/hints/get-hint \
    -H "Content-Type: application/json" \
    -d '{"problemTitle":"Test","problemDescription":"Test","hintLevel":1}' &
done
wait
```

---

## 🔧 Database Verification

After making API calls, verify data was saved:

```bash
# Connect to MongoDB
mongosh

# Use database
use ai-code-mentor

# Check hints were saved
db.hints.find().count()

# View recent hints
db.hints.find().sort({createdAt: -1}).limit(5).pretty()

# Check problems
db.problems.find().pretty()

# Check users
db.users.find().pretty()
```

---

## ✅ Testing Checklist

- [ ] Health endpoint returns 200
- [ ] Test endpoint returns success
- [ ] Can get Level 1 hint
- [ ] Can get Level 2 hint
- [ ] Can get Level 3 hint
- [ ] Can get Level 4 hint
- [ ] Hints are different for each level
- [ ] No full code solutions in any hint
- [ ] History endpoint works
- [ ] Stats endpoint works
- [ ] Data saved to MongoDB
- [ ] Invalid requests return proper errors
- [ ] Response times are reasonable (< 3s)

---

## 📝 Notes

- First request may be slower as AI model initializes
- Subsequent requests should be faster (1-2 seconds)
- Rate limiting applies after 100 requests in 15 minutes
- All responses should have `success: true` for valid requests
- Check server logs for detailed error messages

---

## 🎯 Expected Behavior

✅ **Good Hints:**
- Clear and educational
- No complete code
- Progressive difficulty
- Encourage thinking

❌ **Bad Hints (Should Never Happen):**
- Full code solutions
- Direct answers
- Implementation details in early levels

If you see a full code solution in any hint, there's a bug - please report it!
