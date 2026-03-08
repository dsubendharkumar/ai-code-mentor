/**
 * Background Service Worker
 * Handles extension lifecycle and background tasks
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('AI Code Mentor installed!');
    
    // Set default settings
    chrome.storage.local.set({
      apiUrl: 'http://localhost:5000',
      hintHistory: []
    });
    
    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'welcome.html' });
  } else if (details.reason === 'update') {
    console.log('AI Code Mentor updated!');
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'problemDetected') {
    // Store the detected problem temporarily
    chrome.storage.local.set({
      lastDetectedProblem: request.data,
      lastDetectedTimestamp: Date.now()
    });
    
    // Update badge to show problem detected
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    
    // Clear badge after 10 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 10000);
  }
  
  return true;
});

console.log('AI Code Mentor background service worker loaded');
