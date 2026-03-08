/**
 * Hint Model
 * Stores hint history and analytics
 */

const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Problem information
  problemTitle: {
    type: String,
    required: true
  },
  
  problemUrl: {
    type: String,
    required: true
  },
  
  platform: {
    type: String,
    required: true,
    enum: ['LeetCode', 'HackerRank', 'Codeforces', 'Other']
  },
  
  problemDescription: {
    type: String,
    required: true
  },
  
  // Hint details
  hintLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  
  hintText: {
    type: String,
    required: true
  },
  
  // AI metadata
  aiProvider: {
    type: String,
    enum: ['claude', 'openai'],
    required: true
  },
  
  aiModel: {
    type: String,
    required: true
  },
  
  tokenUsage: {
    inputTokens: Number,
    outputTokens: Number,
    totalTokens: Number
  },
  
  // Response time
  responseTimeMs: {
    type: Number
  },
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
hintSchema.index({ userId: 1, createdAt: -1 });
hintSchema.index({ platform: 1, createdAt: -1 });
hintSchema.index({ problemUrl: 1, hintLevel: 1 });

// Static methods for analytics
hintSchema.statics.getUserHintHistory = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-problemDescription -hintText');
};

hintSchema.statics.getPlatformStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$platform',
        count: { $sum: 1 },
        avgHintLevel: { $avg: '$hintLevel' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

hintSchema.statics.getHintLevelDistribution = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$hintLevel',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('Hint', hintSchema);
