/**
 * Problem Model
 * Stores unique problems and their metadata
 */

const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  // Problem identification
  title: {
    type: String,
    required: true
  },
  
  url: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  platform: {
    type: String,
    required: true,
    enum: ['LeetCode', 'HackerRank', 'Codeforces', 'Other']
  },
  
  // Problem content
  description: {
    type: String,
    required: true
  },
  
  constraints: {
    type: String
  },
  
  examples: {
    type: String
  },
  
  // Problem metadata
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Unknown'],
    default: 'Unknown'
  },
  
  topics: [{
    type: String
  }],
  
  // Usage statistics
  viewCount: {
    type: Number,
    default: 0
  },
  
  hintRequestCount: {
    type: Number,
    default: 0
  },
  
  // Most requested hint level
  popularHintLevel: {
    type: Number,
    min: 1,
    max: 4
  },
  
  // Timestamps
  firstSeen: {
    type: Date,
    default: Date.now
  },
  
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
problemSchema.index({ platform: 1, viewCount: -1 });
problemSchema.index({ lastAccessed: -1 });
problemSchema.index({ difficulty: 1 });

// Methods
problemSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

problemSchema.methods.incrementHintCount = function(hintLevel) {
  this.hintRequestCount += 1;
  this.lastAccessed = new Date();
  
  // Update popular hint level (simple approach)
  if (!this.popularHintLevel) {
    this.popularHintLevel = hintLevel;
  }
  
  return this.save();
};

// Static methods
problemSchema.statics.getMostPopular = function(limit = 10) {
  return this.find()
    .sort({ viewCount: -1 })
    .limit(limit)
    .select('title platform difficulty viewCount hintRequestCount');
};

problemSchema.statics.getRecentlyAccessed = function(limit = 10) {
  return this.find()
    .sort({ lastAccessed: -1 })
    .limit(limit)
    .select('title platform difficulty lastAccessed');
};

module.exports = mongoose.model('Problem', problemSchema);
