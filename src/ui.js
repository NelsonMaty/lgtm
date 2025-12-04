import chalk from 'chalk';
import ora from 'ora';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';

// Configure marked to use terminal renderer
marked.use(markedTerminal({
  code: chalk.cyan,
  blockquote: chalk.gray.italic,
  html: chalk.gray,
  heading: chalk.bold.cyan,
  firstHeading: chalk.bold.magenta,
  hr: chalk.gray,
  listitem: chalk.white,
  table: chalk.white,
  paragraph: chalk.white,
  strong: chalk.bold.white,
  em: chalk.italic.white,
  codespan: chalk.yellow,
  del: chalk.dim.gray.strikethrough,
  link: chalk.blue.underline,
  href: chalk.blue.underline
}));

/**
 * Clear the terminal screen
 */
export function clearScreen() {
  console.clear();
}

/**
 * Print a section header
 */
export function printHeader(title, stepNumber = null, totalSteps = null) {
  console.log('\n' + chalk.cyan('═'.repeat(60)));
  if (stepNumber && totalSteps) {
    console.log(chalk.cyan.bold(` 📋 Step ${stepNumber}/${totalSteps}: ${title}`));
  } else {
    console.log(chalk.cyan.bold(` ${title}`));
  }
  console.log(chalk.cyan('═'.repeat(60)) + '\n');
}

/**
 * Print a separator
 */
export function printSeparator() {
  console.log(chalk.gray('─'.repeat(60)));
}

/**
 * Print navigation menu
 */
export function printNavigation(nextStepTitle, currentStep, totalSteps) {
  console.log('\n' + chalk.gray('─'.repeat(60)));
  console.log(chalk.yellow.bold(' 📍 Navigation'));
  console.log(chalk.gray('─'.repeat(60)));
  
  if (currentStep < totalSteps) {
    console.log(chalk.green('  ↵  ') + chalk.white(`Continue to ${nextStepTitle}`));
  } else {
    console.log(chalk.green('  ↵  ') + chalk.white('Finish review'));
  }
  
  console.log(chalk.cyan('  a  ') + chalk.white('Ask a follow-up question'));
  
  if (currentStep < totalSteps && (currentStep + 1) < totalSteps) {
    console.log(chalk.yellow('  s  ') + chalk.white(`Skip ${nextStepTitle}`));
  }
  
  console.log(chalk.red('  q  ') + chalk.white('Quit review'));
  console.log(chalk.gray('─'.repeat(60)));
}

/**
 * Create a loading spinner
 */
export function createSpinner(text) {
  return ora({
    text: chalk.cyan(text),
    color: 'cyan'
  });
}

/**
 * Print success message
 */
export function printSuccess(message) {
  console.log(chalk.green('✅ ') + chalk.white(message));
}

/**
 * Print error message
 */
export function printError(message) {
  console.log(chalk.red('❌ ') + chalk.white(message));
}

/**
 * Print warning message
 */
export function printWarning(message) {
  console.log(chalk.yellow('⚠️  ') + chalk.white(message));
}

/**
 * Print info message
 */
export function printInfo(message) {
  console.log(chalk.blue('ℹ️  ') + chalk.white(message));
}

/**
 * Print Q&A mode header
 */
export function printQAHeader() {
  console.log('\n' + chalk.magenta('═'.repeat(60)));
  console.log(chalk.magenta.bold(' 💬 Interactive Q&A Mode'));
  console.log(chalk.magenta('═'.repeat(60)));
  console.log(chalk.gray('Ask questions about this review step.'));
  console.log(chalk.gray('Type "done" or "exit" to return to navigation.\n'));
}

/**
 * Format AI response with markdown rendering and syntax highlighting
 */
export function printAIResponse(response) {
  try {
    // Render markdown to terminal with syntax highlighting
    const rendered = marked(response);
    console.log(rendered);
  } catch (error) {
    // Fallback to plain text if markdown rendering fails
    console.log(response);
  }
}
