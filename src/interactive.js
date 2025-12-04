import { createInterface } from 'readline';
import { emitKeypressEvents } from 'readline';
import { printNavigation, printQAHeader, clearScreen, createSpinner, printAIResponse } from './ui.js';

/**
 * Create readline interface for user input
 */
function createReadline() {
  return createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Ask a question and get user input
 */
function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

/**
 * Show step navigation options with arrow key support
 */
export async function promptStepNavigation(currentStepNumber, totalSteps, nextStepTitle) {
  printNavigation(nextStepTitle, currentStepNumber, totalSteps);
  
  return new Promise((resolve) => {
    const stdin = process.stdin;
    
    // Enable raw mode for arrow key detection
    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }
    
    emitKeypressEvents(stdin);
    
    let selectedOption = 0;
    const options = ['continue', 'ask', 'skip', 'quit'];
    
    // Filter out skip if not available
    const availableOptions = currentStepNumber < totalSteps && (currentStepNumber + 1) < totalSteps
      ? options
      : options.filter(opt => opt !== 'skip');
    
    const handleKeypress = (str, key) => {
      if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        resolve({ action: 'continue' });
      } else if (key.name === 'a') {
        cleanup();
        resolve({ action: 'ask' });
      } else if (key.name === 's' && availableOptions.includes('skip')) {
        cleanup();
        resolve({ action: 'skip' });
      } else if (key.name === 'q') {
        cleanup();
        resolve({ action: 'quit' });
      } else if (key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(0);
      }
    };
    
    const cleanup = () => {
      stdin.removeListener('keypress', handleKeypress);
      if (stdin.isTTY) {
        stdin.setRawMode(false);
      }
      stdin.pause();
    };
    
    stdin.on('keypress', handleKeypress);
    stdin.resume();
  });
}

/**
 * Interactive Q&A mode - allows multiple questions about the current step
 */
export async function interactiveQA(context, stepTitle, stepResponse, callGemini, apiKey) {
  clearScreen();
  printQAHeader();
  
  const conversationHistory = [
    {
      role: 'assistant',
      content: `Here was my ${stepTitle} review:\n\n${stepResponse}`
    }
  ];
  
  while (true) {
    const rl = createReadline();
    const userQuestion = await question(rl, '💭 You: ');
    rl.close();
    
    const trimmedQuestion = userQuestion.trim();
    
    if (trimmedQuestion.toLowerCase() === 'done' || 
        trimmedQuestion.toLowerCase() === 'exit' ||
        trimmedQuestion === '') {
      console.log('\n✅ Exiting Q&A mode\n');
      break;
    }
    
    // Build prompt with conversation history
    const prompt = buildQAPrompt(context, stepTitle, conversationHistory, trimmedQuestion);
    
    const spinner = createSpinner('Thinking...');
    spinner.start();
    
    try {
      const response = await callGemini(apiKey, prompt);
      spinner.stop();
      
      console.log('\n🤖 Assistant:\n');
      printAIResponse(response);
      console.log();
      
      // Add to conversation history
      conversationHistory.push({
        role: 'user',
        content: trimmedQuestion
      });
      conversationHistory.push({
        role: 'assistant',
        content: response
      });
      
    } catch (error) {
      spinner.stop();
      console.error('❌ Error:', error.message);
      console.log('Continuing Q&A mode...\n');
    }
  }
}

/**
 * Build a prompt for Q&A mode with conversation context
 */
function buildQAPrompt(context, stepTitle, conversationHistory, userQuestion) {
  const sections = [];
  
  sections.push(`You are in an interactive Q&A session about a code review step: "${stepTitle}"`);
  sections.push('Answer the user\'s question based on the code and previous conversation.\n');
  
  sections.push('# CONVERSATION HISTORY\n');
  for (const msg of conversationHistory) {
    if (msg.role === 'user') {
      sections.push(`**User:** ${msg.content}\n`);
    } else {
      sections.push(`**You:** ${msg.content}\n`);
    }
  }
  
  sections.push(`\n# USER'S QUESTION\n`);
  sections.push(userQuestion + '\n');
  
  sections.push('\n# INSTRUCTIONS\n');
  sections.push('- Answer concisely but thoroughly');
  sections.push('- Reference specific code when relevant');
  sections.push('- If the question is about something not in the code, say so');
  sections.push('- Maintain the context of the review step');
  sections.push('- Be helpful and constructive');
  
  return sections.join('\n');
}

/**
 * Simple yes/no prompt
 */
export async function promptYesNo(message) {
  const rl = createReadline();
  const answer = await question(rl, message);
  rl.close();
  return answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes';
}
