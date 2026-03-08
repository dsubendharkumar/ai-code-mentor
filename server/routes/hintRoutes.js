/**
 * Hint Routes
 * Define API endpoints for hint operations
 */

const express = require('express');
const router = express.Router();
const hintController = require('../controllers/hintController');

// Test endpoint
router.get('/test', hintController.testEndpoint);

// Main hint generation endpoint
router.post('/get-hint', hintController.getHint);

// Get user's hint history
router.get('/history/:userId', hintController.getHintHistory);

// Get overall statistics
router.get('/stats', hintController.getStats);

module.exports = router;
