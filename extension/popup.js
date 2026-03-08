/**
 * Popup Script - Handles UI interactions and communication with backend
 */

// DOM Elements
const elements = {
  // Status elements
  loadingProblem: document.getElementById('loading-problem'),
  problemDetected: document.getElementById('problem-detected'),
  noProblem: document.getElementById('no-problem'),
  problemTitle: document.getElementById('problem-title'),
  
  // Hint buttons
  hintButtons: document.getElementById('hint-buttons'),
  hintBtn1: document.getElementById('hint-level-1'),
  hintBtn2: document.getElementById('hint-level-2'),
  hintBtn3: document.getElementById('hint-level-3'),
  hintBtn4: document.getElementById('hint-level-4'),
  
  // Hint display
  hintDisplay: document.getElementById('hint-display'),
  hintLevelTitle: document.getElementById('hint-level-title'),
  hintContent: document.getElementById('hint-content'),
  closeHint: document.getElementById('close-hint'),
  
  // Loading and error
  loading: document.getElementById('loading'),
  errorMessage: document.getElementById('error-message'),
  errorText: document.getElementById('error-text'),
  closeError: document.getElementById('close-error'),
  
  // Settings
  apiUrl: document.getElementById('api-url'),
  saveSettings: document.getElementById('save-settings')
};

// State
let currentProblem = null;
let apiBaseUrl = 'http://localhost:5000';

// Hint level configurations
const HINT_LEVELS = {
  1: { title: 'Level 1: Intuition', description: 'Understanding the problem' },
  2: { title: 'Level 2: Approach', description: 'The right strategy' },
  3: { title: 'Level 3: Steps', description: 'Breaking it down' },
  4: { title: 'Level 4: Pseudocode', description: 'Algorithm structure' }
};

/**
 * Initialize the popup
 */
async function init() {
  // Load saved settings
  const settings = await chrome.storage.local.get(['apiUrl']);
  if (settings.apiUrl) {
    apiBaseUrl = settings.apiUrl;
    elements.apiUrl.value = settings.apiUrl;
  } else {
    elements.apiUrl.placeholder = apiBaseUrl;
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Try to get problem info from current tab
  await getProblemFromCurrentTab();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Hint level buttons
  [elements.hintBtn1, elements.hintBtn2, elements.hintBtn3, elements.hintBtn4].forEach(btn => {
    btn.addEventListener('click', () => {
      const level = parseInt(btn.dataset.level);
      requestHint(level);
    });
  });
  
  // Close hint button
  elements.closeHint.addEventListener('click', () => {
    hideHintDisplay();
  });
  
  // Close error button
  elements.closeError.addEventListener('click', () => {
    hideError();
  });
  
  // Save settings button
  elements.saveSettings.addEventListener('click', saveApiSettings);
}

/**
 * Get problem information from the current tab
 */
async function getProblemFromCurrentTab() {
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showNoProblem();
      return;
    }
    
    // Check if we're on a supported site
    const url = tab.url;
    const supportedSites = ['leetcode.com', 'hackerrank.com', 'codeforces.com'];
    const isSupported = supportedSites.some(site => url.includes(site));
    
    if (!isSupported) {
      showNoProblem();
      return;
    }
    
    // Request problem info from content script
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'getProblemInfo' },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
          showNoProblem();
          return;
        }
        
        console.log('Response from content script:', response);
        
        if (response && response.success) {
          currentProblem = response.data;
          console.log('Problem data received:', currentProblem);
          console.log('Title:', currentProblem.title);
          console.log('Description length:', currentProblem.description?.length);
          showProblemDetected(response.data);
        } else {
          console.log('No problem data or unsuccessful response');
          showNoProblem();
        }
      }
    );
  } catch (error) {
    console.error('Error getting problem info:', error);
    showNoProblem();
  }
}

/**
 * Show problem detected state
 */
function showProblemDetected(problem) {
  elements.loadingProblem.classList.add('hidden');
  elements.noProblem.classList.add('hidden');
  elements.problemDetected.classList.remove('hidden');
  elements.hintButtons.classList.remove('hidden');
  
  elements.problemTitle.textContent = problem.title || 'Coding Problem Detected';
}

/**
 * Show no problem detected state
 */
function showNoProblem() {
  elements.loadingProblem.classList.add('hidden');
  elements.problemDetected.classList.add('hidden');
  elements.noProblem.classList.remove('hidden');
  elements.hintButtons.classList.add('hidden');
}

/**
 * Request a hint from the backend
 */
async function requestHint(level) {
  if (!currentProblem) {
    showError('No problem detected. Please navigate to a coding problem first.');
    return;
  }
  
  // Debug logging
  console.log('Current problem data:', currentProblem);
  console.log('Title:', currentProblem.title);
  console.log('Description:', currentProblem.description);
  
  // Show loading
  showLoading();
  
  try {
    // Prepare the request payload
    const payload = {
      problemTitle: currentProblem.title || 'Unknown Problem',
      problemDescription: currentProblem.description || 'No description available',
      problemUrl: currentProblem.url,
      platform: currentProblem.platform,
      hintLevel: level,
      constraints: currentProblem.constraints || '',
      examples: currentProblem.examples || ''
    };
    
    console.log('Sending payload:', payload);
    
    // Make API request
    const response = await fetch(`${apiBaseUrl}/api/hints/get-hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get hint');
    }
    
    const data = await response.json();
    
    // Hide loading
    hideLoading();
    
    // Display the hint
    displayHint(level, data.hint);
    
    // Save to history
    saveToHistory(currentProblem, level, data.hint);
    
  } catch (error) {
    console.error('Error requesting hint:', error);
    hideLoading();
    showError(error.message || 'Failed to connect to the server. Make sure the backend is running.');
  }
}

/**
 * Display hint in the UI
 */
function displayHint(level, hintText) {
  const levelConfig = HINT_LEVELS[level];
  
  elements.hintLevelTitle.textContent = levelConfig.title;
  
  // Format hint with markdown-like syntax
  const formattedHint = formatHintText(hintText);
  elements.hintContent.innerHTML = formattedHint;
  
  elements.hintDisplay.classList.remove('hidden');
}

/**
 * Format hint text with basic HTML
 */
function formatHintText(text) {
  // Escape HTML
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };
  
  let formatted = escapeHtml(text);
  
  // Convert markdown-style formatting
  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Line breaks
  formatted = formatted.replace(/\n\n/g, '</p><p>');
  formatted = '<p>' + formatted + '</p>';
  
  // Lists (simple detection)
  formatted = formatted.replace(/<p>(\d+\.\s.*?)<\/p>/g, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
  
  formatted = formatted.replace(/<p>[-•]\s(.*?)<\/p>/g, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return formatted;
}

/**
 * Hide hint display
 */
function hideHintDisplay() {
  elements.hintDisplay.classList.add('hidden');
}

/**
 * Show loading overlay
 */
function showLoading() {
  elements.loading.classList.remove('hidden');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  elements.loading.classList.add('hidden');
}

/**
 * Show error message
 */
function showError(message) {
  elements.errorText.textContent = message;
  elements.errorMessage.classList.remove('hidden');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
  elements.errorMessage.classList.add('hidden');
}

/**
 * Save hint to local history
 */
async function saveToHistory(problem, level, hint) {
  try {
    const historyItem = {
      problemTitle: problem.title,
      problemUrl: problem.url,
      platform: problem.platform,
      hintLevel: level,
      hint: hint,
      timestamp: new Date().toISOString()
    };
    
    // Get existing history
    const { hintHistory = [] } = await chrome.storage.local.get(['hintHistory']);
    
    // Add new item (keep last 50)
    hintHistory.unshift(historyItem);
    if (hintHistory.length > 50) {
      hintHistory.pop();
    }
    
    // Save back
    await chrome.storage.local.set({ hintHistory });
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

/**
 * Save API settings
 */
async function saveApiSettings() {
  const url = elements.apiUrl.value.trim() || 'http://localhost:5000';
  
  try {
    await chrome.storage.local.set({ apiUrl: url });
    apiBaseUrl = url;
    
    // Show success feedback
    elements.saveSettings.textContent = 'Saved!';
    elements.saveSettings.style.background = '#4CAF50';
    
    setTimeout(() => {
      elements.saveSettings.textContent = 'Save';
      elements.saveSettings.style.background = '';
    }, 2000);
  } catch (error) {
    console.error('Error saving settings:', error);
    showError('Failed to save settings');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
