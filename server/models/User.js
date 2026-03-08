/**
 * User Model
 * Stores user information and usage statistics
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User identifier (could be extension ID or user ID)
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User metadata
  email: {
    type: String,
    sparse: true // Optional field
  },
  
  // Usage statistics
  totalHintsRequested: {
    type: Number,
    default: 0
  },
  
  totalProblemsViewed: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Settings
  preferences: {
    defaultHintLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 4
    },
    
    favoriteTopics: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ lastActive: -1 });
userSchema.index({ totalHintsRequested: -1 });

// Methods
userSchema.methods.incrementHintCount = function() {
  this.totalHintsRequested += 1;
  this.lastActive = new Date();
  return this.save();
};

userSchema.methods.incrementProblemCount = function() {
  this.totalProblemsViewed += 1;
  this.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
