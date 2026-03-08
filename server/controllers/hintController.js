/**
 * Hint Controller
 * Handles hint generation requests
 */

const aiService = require('../services/aiService');
const Hint = require('../models/Hint');
const Problem = require('../models/Problem');
const User = require('../models/User');

/**
 * GET /api/hints/test
 * Test endpoint to verify API is working
 */
exports.testEndpoint = async (req, res) => {
  res.json({
    success: true,
    message: 'AI Code Mentor API is running!',
    timestamp: new Date().toISOString()
  });
};

/**
 * POST /api/hints/get-hint
 * Generate a hint for a coding problem
 */
exports.getHint = async (req, res) => {
  try {
    const {
      problemTitle,
      problemDescription,
      problemUrl,
      platform,
      hintLevel,
      constraints,
      examples,
      userId = 'anonymous' // Default user ID if not provided
    } = req.body;
    
    // Validate required fields
    if (!problemTitle || !problemDescription || !hintLevel) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: problemTitle, problemDescription, and hintLevel are required'
      });
    }
    
    // Validate hint level
    if (hintLevel < 1 || hintLevel > 4) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hint level. Must be between 1 and 4.'
      });
    }
    
    // Prepare problem data for AI service
    const problemData = {
      problemTitle,
      problemDescription,
      problemUrl,
      platform,
      constraints,
      examples
    };
    
    // Generate hint using AI service
    const result = await aiService.generateHint(problemData, hintLevel);
    
    // Save hint to database (async, don't block response)
    saveHintToDatabase({
      userId,
      problemTitle,
      problemUrl,
      platform,
      problemDescription,
      hintLevel,
      hintText: result.hint,
      aiProvider: result.metadata.provider,
      aiModel: result.metadata.model,
      tokenUsage: result.metadata.tokenUsage,
      responseTimeMs: result.metadata.responseTimeMs
    }).catch(err => {
      console.error('Error saving hint to database:', err);
    });
    
    // Update problem statistics (async)
    updateProblemStats(problemData, hintLevel).catch(err => {
      console.error('Error updating problem stats:', err);
    });
    
    // Update user statistics (async)
    updateUserStats(userId).catch(err => {
      console.error('Error updating user stats:', err);
    });
    
    // Return the hint
    res.json({
      success: true,
      hint: result.hint,
      hintLevel,
      metadata: {
        provider: result.metadata.provider,
        model: result.metadata.model,
        responseTime: result.metadata.responseTimeMs
      }
    });
    
  } catch (error) {
    console.error('Error in getHint:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate hint',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * GET /api/hints/history/:userId
 * Get hint history for a user
 */
exports.getHintHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const history = await Hint.getUserHintHistory(userId, limit);
    
    res.json({
      success: true,
      count: history.length,
      history
    });
    
  } catch (error) {
    console.error('Error getting hint history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hint history'
    });
  }
};

/**
 * GET /api/hints/stats
 * Get overall statistics
 */
exports.getStats = async (req, res) => {
  try {
    const [platformStats, hintLevelStats, totalHints, totalProblems] = await Promise.all([
      Hint.getPlatformStats(),
      Hint.getHintLevelDistribution(),
      Hint.countDocuments(),
      Problem.countDocuments()
    ]);
    
    res.json({
      success: true,
      stats: {
        totalHints,
        totalProblems,
        platformDistribution: platformStats,
        hintLevelDistribution: hintLevelStats
      }
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
};

/**
 * Helper: Save hint to database
 */
async function saveHintToDatabase(hintData) {
  try {
    const hint = new Hint(hintData);
    await hint.save();
    console.log('Hint saved to database');
  } catch (error) {
    console.error('Database save error:', error);
    throw error;
  }
}

/**
 * Helper: Update or create problem statistics
 */
async function updateProblemStats(problemData, hintLevel) {
  try {
    if (!problemData.problemUrl) {
      return;
    }
    
    let problem = await Problem.findOne({ url: problemData.problemUrl });
    
    if (!problem) {
      // Create new problem entry
      problem = new Problem({
        title: problemData.problemTitle,
        url: problemData.problemUrl,
        platform: problemData.platform || 'Other',
        description: problemData.problemDescription,
        constraints: problemData.constraints,
        examples: problemData.examples
      });
    }
    
    await problem.incrementHintCount(hintLevel);
    console.log('Problem stats updated');
    
  } catch (error) {
    console.error('Error updating problem stats:', error);
    throw error;
  }
}

/**
 * Helper: Update user statistics
 */
async function updateUserStats(userId) {
  try {
    let user = await User.findOne({ userId });
    
    if (!user) {
      // Create new user
      user = new User({ userId });
    }
    
    await user.incrementHintCount();
    console.log('User stats updated');
    
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}
