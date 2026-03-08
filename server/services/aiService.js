/**
 * AI Service
 * Handles AI API interactions with strict hint-only policies
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize AI client based on provider (lazy initialization)
let anthropicClient = null;

function getAnthropicClient() {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey || apiKey === 'REPLACE_THIS_WITH_YOUR_ACTUAL_API_KEY' || apiKey === 'your_anthropic_api_key_here') {
      throw new Error('ANTHROPIC_API_KEY is missing or not set correctly in .env file');
    }
    
    anthropicClient = new Anthropic({
      apiKey: apiKey
    });
    
    console.log('✅ Anthropic client initialized successfully');
  }
  
  return anthropicClient;
}

/**
 * System prompts for each hint level
 * These enforce the "hints only, no solutions" policy
 */
const SYSTEM_PROMPTS = {
  base: `You are an AI coding mentor designed to help students learn Data Structures and Algorithms through progressive hints. 

CRITICAL RULES - NEVER VIOLATE:
1. NEVER provide complete code solutions
2. NEVER write actual implementation code
3. NEVER give away the entire answer
4. If asked for a full solution, politely refuse and explain your purpose
5. Focus on teaching concepts and problem-solving approaches
6. Guide the student to discover the solution themselves

Your role is to provide educational hints that promote learning, not to solve problems for students.`,

  level1: `Level 1: Intuition
Provide a high-level intuitive understanding of the problem.
- What is the problem really asking?
- What's the core concept being tested?
- What similar problems exist?
- What should the student think about first?

Keep it brief (3-4 sentences). Focus on building mental models.`,

  level2: `Level 2: Approach
Suggest the right algorithmic approach without implementation details.
- What data structure(s) should be considered?
- What algorithmic technique applies (greedy, DP, two pointers, etc.)?
- What's the key insight that unlocks the solution?
- Why is this approach better than obvious alternatives?

Keep it concise (4-5 sentences). Focus on strategy, not implementation.`,

  level3: `Level 3: Steps
Break down the solution into logical steps.
- Provide a numbered step-by-step approach
- Explain what each step accomplishes
- Mention edge cases to consider
- Discuss time/space complexity implications

Format as a clear list. Do NOT include actual code.`,

  level4: `Level 4: Pseudocode
Provide algorithm structure in pseudocode format.
- Use generic pseudocode syntax (not any specific language)
- Show the logic flow and structure
- Include comments explaining key parts
- DO NOT write actual implementation code

This should be language-agnostic algorithmic thinking, not a copy-paste solution.`
};

/**
 * Generate a hint using Claude AI
 */
async function generateHintWithClaude(problemData, hintLevel) {
  const startTime = Date.now();
  
  try {
    // Build the system prompt
    const systemPrompt = `${SYSTEM_PROMPTS.base}\n\n${SYSTEM_PROMPTS[`level${hintLevel}`]}`;
    
    // Build the user prompt
    const userPrompt = buildUserPrompt(problemData, hintLevel);
    
    // Get the Anthropic client (lazy initialization)
    const client = getAnthropicClient();
    
    // Call Claude API
    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7
    });
    
    const responseTime = Date.now() - startTime;
    
    // Extract the hint text
    const hintText = response.content[0].text;
    
    // Safety check: Ensure no full code solutions
    if (containsCodeSolution(hintText)) {
      throw new Error('AI attempted to provide a full solution. This should not happen.');
    }
    
    return {
      hint: hintText,
      metadata: {
        provider: 'claude',
        model: response.model,
        tokenUsage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        },
        responseTimeMs: responseTime
      }
    };
    
  } catch (error) {
    console.error('Error generating hint with Claude:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
}

/**
 * Generate a hint using OpenAI (alternative)
 */
async function generateHintWithOpenAI(problemData, hintLevel) {
  // Note: This would require the OpenAI SDK
  // Placeholder for OpenAI implementation
  throw new Error('OpenAI integration not yet implemented. Please use Claude as AI_PROVIDER.');
}

/**
 * Build the user prompt from problem data
 */
function buildUserPrompt(problemData, hintLevel) {
  let prompt = `I'm working on this coding problem and need a Level ${hintLevel} hint:\n\n`;
  
  prompt += `**Problem Title:** ${problemData.problemTitle}\n\n`;
  
  prompt += `**Problem Description:**\n${problemData.problemDescription}\n\n`;
  
  if (problemData.constraints) {
    prompt += `**Constraints:**\n${problemData.constraints}\n\n`;
  }
  
  if (problemData.examples) {
    prompt += `**Examples:**\n${problemData.examples}\n\n`;
  }
  
  prompt += `Please provide a Level ${hintLevel} hint following your guidelines. Remember: hints only, no complete solutions!`;
  
  return prompt;
}

/**
 * Safety check: Detect if response contains actual code implementation
 */
function containsCodeSolution(text) {
  // Simple heuristics to detect actual code
  const codeIndicators = [
    /function\s+\w+\s*\([^)]*\)\s*{/i,  // Function definitions
    /class\s+\w+\s*{/i,                  // Class definitions
    /def\s+\w+\s*\([^)]*\):/i,           // Python function
    /public\s+static\s+void\s+main/i,    // Java main
    /int\s+main\s*\(/i,                  // C/C++ main
    /for\s*\([^)]+\)\s*{[\s\S]{50,}}/i,  // Long for loops with code
    /while\s*\([^)]+\)\s*{[\s\S]{50,}}/i // Long while loops with code
  ];
  
  // Check if any indicator is found
  return codeIndicators.some(pattern => pattern.test(text));
}

/**
 * Main function to generate hints
 */
async function generateHint(problemData, hintLevel) {
  // Validate hint level
  if (hintLevel < 1 || hintLevel > 4) {
    throw new Error('Invalid hint level. Must be between 1 and 4.');
  }
  
  // Validate problem data
  if (!problemData.problemTitle || !problemData.problemDescription) {
    throw new Error('Problem title and description are required.');
  }
  
  // Generate hint based on configured provider
  const provider = process.env.AI_PROVIDER || 'claude';
  
  if (provider === 'claude') {
    return await generateHintWithClaude(problemData, hintLevel);
  } else if (provider === 'openai') {
    return await generateHintWithOpenAI(problemData, hintLevel);
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

module.exports = {
  generateHint
};
