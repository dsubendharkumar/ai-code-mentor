/**
 * Content Script - Extracts coding problem information from various platforms
 * Runs on LeetCode, HackerRank, and Codeforces
 */

// Configuration for different platforms
const PLATFORM_SELECTORS = {
  leetcode: {
    name: 'LeetCode',
    problemTitle: [
      '[data-cy="question-title"]',
      'div[class*="text-title"]',
      'div[class*="text-lg"]',
      'a[class*="text-title"]',
      '.css-v3d350',
      'div[class*="question-title"]',
      'h1', // Fallback to any h1
      'div[class*="title"]' // Last resort
    ],
    problemDescription: [
      'div[class*="elfjS"]',
      'div[class*="_16yfq"]',
      'div[data-track-load="description_content"]',
      'div[class*="question-content"]',
      '.question-content__JfgR',
      'div[class*="content"]' // Fallback
    ],
    constraints: [
      '.mt-4.mb-6',
      'div[class*="constraints"]'
    ],
    examples: [
      'pre',
      '.example',
      'div[class*="example"]'
    ]
  },
  hackerrank: {
    name: 'HackerRank',
    problemTitle: [
      '.page-title h1',
      '.challenge-page-title',
      'h1'
    ],
    problemDescription: [
      '.challenge-body-html',
      '.problem-statement'
    ],
    constraints: [
      '.constraints'
    ]
  },
  codeforces: {
    name: 'Codeforces',
    problemTitle: [
      '.problem-statement .title',
      '.title'
    ],
    problemDescription: [
      '.problem-statement',
      '.problem-statement > div'
    ]
  }
};

/**
 * Detect which platform we're on
 */
function detectPlatform() {
  const hostname = window.location.hostname;
  
  if (hostname.includes('leetcode.com')) {
    return 'leetcode';
  } else if (hostname.includes('hackerrank.com')) {
    return 'hackerrank';
  } else if (hostname.includes('codeforces.com')) {
    return 'codeforces';
  }
  
  return null;
}

/**
 * Try multiple selectors until one works
 */
function getElementBySelectors(selectors) {
  for (const selector of selectors) {
    try {
      // Skip invalid selectors
      if (!selector || typeof selector !== 'string') {
        continue;
      }
      
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    } catch (e) {
      // Skip selectors that cause errors (like :contains which isn't valid in querySelector)
      console.log('Invalid selector skipped:', selector);
      continue;
    }
  }
  return null;
}

/**
 * Clean text by removing extra whitespace
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * Extract problem information based on platform
 */
function extractProblemInfo() {
  console.log('Extracting problem info...');
  const platform = detectPlatform();
  
  console.log('Detected platform:', platform);
  
  if (!platform) {
    console.log('No platform detected');
    return null;
  }
  
  const selectors = PLATFORM_SELECTORS[platform];
  let problemData = {
    platform: selectors.name,
    url: window.location.href,
    title: '',
    description: '',
    constraints: '',
    examples: ''
  };
  
  // Extract title with multiple attempts
  const titleElement = getElementBySelectors(selectors.problemTitle);
  console.log('Title element found:', titleElement);
  
  if (titleElement) {
    problemData.title = cleanText(titleElement.textContent);
    console.log('Extracted title:', problemData.title);
  }
  
  // Fallback: Try to get title from page title or h1
  if (!problemData.title || problemData.title.length === 0) {
    console.log('Trying fallback title extraction...');
    
    // Try document title (format: "1. Two Sum - LeetCode")
    const docTitle = document.title;
    if (docTitle && docTitle.includes('-')) {
      const titlePart = docTitle.split('-')[0].trim();
      // Remove the number prefix if present (e.g., "1. Two Sum" -> "Two Sum")
      problemData.title = titlePart.replace(/^\d+\.\s*/, '').trim();
      console.log('Extracted title from document.title:', problemData.title);
    }
    
    // Still no title? Try any h1 on the page
    if (!problemData.title || problemData.title.length === 0) {
      const h1 = document.querySelector('h1');
      if (h1) {
        problemData.title = cleanText(h1.textContent);
        console.log('Extracted title from h1:', problemData.title);
      }
    }
  }
  
  // Extract description
  const descElement = getElementBySelectors(selectors.problemDescription);
  console.log('Description element found:', descElement);
  if (descElement) {
    // Clone the element to avoid modifying the page
    const clone = descElement.cloneNode(true);
    
    // Remove code editor elements if present
    const codeEditors = clone.querySelectorAll('.monaco-editor, .CodeMirror');
    codeEditors.forEach(editor => editor.remove());
    
    problemData.description = cleanText(clone.textContent);
    console.log('Extracted description (first 100 chars):', problemData.description.substring(0, 100));
  }
  
  // Fallback for description
  if (!problemData.description || problemData.description.length < 10) {
    console.log('Trying fallback description extraction...');
    // Try to get any visible text content
    const contentDiv = document.querySelector('div[class*="content"]');
    if (contentDiv) {
      problemData.description = cleanText(contentDiv.textContent);
      console.log('Extracted description from fallback');
    }
  }
  
  // Extract constraints if available
  if (selectors.constraints) {
    const constraintsElement = getElementBySelectors(selectors.constraints);
    if (constraintsElement) {
      problemData.constraints = cleanText(constraintsElement.textContent);
    }
  }
  
  // Extract examples if available
  if (selectors.examples) {
    const exampleElements = document.querySelectorAll(selectors.examples[0]);
    const examples = Array.from(exampleElements)
      .slice(0, 3) // Take first 3 examples
      .map(el => cleanText(el.textContent))
      .filter(text => text.length > 0 && text.length < 500);
    
    if (examples.length > 0) {
      problemData.examples = examples.join('\n\n');
    }
  }
  
  console.log('Final problem data:', {
    title: problemData.title,
    descriptionLength: problemData.description?.length,
    hasConstraints: !!problemData.constraints,
    hasExamples: !!problemData.examples
  });
  
  // Validate that we got meaningful data
  if (!problemData.title && !problemData.description) {
    console.log('No meaningful data extracted');
    return null;
  }
  
  return problemData;
}

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProblemInfo') {
    try {
      const problemInfo = extractProblemInfo();
      
      if (problemInfo) {
        sendResponse({
          success: true,
          data: problemInfo
        });
      } else {
        sendResponse({
          success: false,
          error: 'Could not detect a coding problem on this page'
        });
      }
    } catch (error) {
      console.error('Error extracting problem info:', error);
      sendResponse({
        success: false,
        error: 'Failed to extract problem information'
      });
    }
    
    return true; // Keep message channel open for async response
  }
});

/**
 * Auto-detect problem on page load and notify background script
 */
function notifyProblemDetected() {
  const problemInfo = extractProblemInfo();
  
  if (problemInfo) {
    chrome.runtime.sendMessage({
      action: 'problemDetected',
      data: problemInfo
    });
  }
}

// Wait for page to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(notifyProblemDetected, 1000);
  });
} else {
  setTimeout(notifyProblemDetected, 1000);
}

// Also detect when navigating within single-page applications
let lastUrl = window.location.href;
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    setTimeout(notifyProblemDetected, 1500);
  }
}).observe(document, { subtree: true, childList: true });

console.log('AI Code Mentor content script loaded');
