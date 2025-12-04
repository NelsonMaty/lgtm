#!/usr/bin/env node

import { 
  isGitRepo, 
  developBranchExists, 
  getCurrentBranch, 
  getMergeBase, 
  getChangedFiles 
} from '../src/git.js';
import { filterFiles } from '../src/filters.js';
import { buildContext, printContextSummary } from '../src/context.js';
import { validateApiKey } from '../src/gemini.js';
import { runInteractiveReview } from '../src/reviewer.js';

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    apiKey: null,
    help: false
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--api-key' && i + 1 < args.length) {
      flags.apiKey = args[i + 1];
      i++; // Skip next arg
    } else if (args[i] === '--help' || args[i] === '-h') {
      flags.help = true;
    }
  }
  
  return flags;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
🔍 PR Review Tool

Usage:
  npx review-pr [options]

Options:
  --api-key KEY    Gemini API key (or set GEMINI_API_KEY env var)
  --help, -h       Show this help message

Examples:
  npx review-pr
  npx review-pr --api-key YOUR_API_KEY
  GEMINI_API_KEY=YOUR_KEY npx review-pr

The tool must be run from a feature branch in a git repository.
It will compare your branch against the 'develop' branch.
  `);
}

/**
 * Get API key from flags or environment
 */
function getApiKey(flags) {
  return flags.apiKey || process.env.GEMINI_API_KEY || null;
}

/**
 * Main CLI function
 */
async function main() {
  const flags = parseArgs();
  
  // Show help if requested
  if (flags.help) {
    showHelp();
    process.exit(0);
  }
  
  console.log('🔍 PR Review Tool\n');

  // Check for API key
  const apiKey = getApiKey(flags);
  if (!apiKey) {
    console.error('❌ Error: No API key provided');
    console.error('   Please provide a Gemini API key via:');
    console.error('   - --api-key flag: npx review-pr --api-key YOUR_KEY');
    console.error('   - Environment variable: export GEMINI_API_KEY=YOUR_KEY');
    console.error('\n   Get your API key at: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }
  
  if (!validateApiKey(apiKey)) {
    console.error('❌ Error: Invalid API key format');
    console.error('   Please check your Gemini API key.');
    process.exit(1);
  }

  // Check if we're in a git repository
  if (!isGitRepo()) {
    console.error('❌ Error: Not a git repository');
    console.error('   Please run this command from within a git repository.');
    process.exit(1);
  }

  // Check if develop branch exists
  if (!developBranchExists()) {
    console.error('❌ Error: develop branch does not exist');
    console.error('   This tool compares against the develop branch.');
    process.exit(1);
  }

  // Get current branch
  const currentBranch = getCurrentBranch();
  console.log(`📌 Current branch: ${currentBranch}`);

  // Check if we're on develop
  if (currentBranch === 'develop') {
    console.error('❌ Error: You are currently on the develop branch');
    console.error('   Please switch to a feature branch to review changes.');
    process.exit(1);
  }

  // Find merge-base with develop
  const mergeBase = getMergeBase();
  console.log(`🔗 Merge base: ${mergeBase.substring(0, 7)}`);

  // Get changed files
  const allChangedFiles = getChangedFiles(mergeBase);
  
  if (allChangedFiles.length === 0) {
    console.log('\n✅ No changes detected between this branch and develop.');
    process.exit(0);
  }

  // Filter out excluded files
  const changedFiles = filterFiles(allChangedFiles);
  const excludedCount = allChangedFiles.length - changedFiles.length;

  console.log(`\n📝 Changed files: ${changedFiles.length} (${excludedCount} excluded)`);
  console.log('─'.repeat(60));

  changedFiles.forEach(file => {
    console.log(`  ${file}`);
  });

  if (excludedCount > 0) {
    console.log('\n📋 Excluded files:');
    const excludedFiles = allChangedFiles.filter(f => !changedFiles.includes(f));
    excludedFiles.forEach(file => {
      console.log(`  ${file}`);
    });
  }

  // Build context - read files, find dependencies and tests
  const context = buildContext(changedFiles);
  
  // Print summary
  printContextSummary(context);
  
  // Ask for confirmation before starting
  console.log('\n' + '─'.repeat(60));
  console.log('Ready to start AI review?');
  console.log('Press Enter to continue or Ctrl+C to cancel...');
  
  await new Promise(resolve => {
    const handler = () => {
      process.stdin.removeListener('data', handler);
      resolve();
    };
    process.stdin.once('data', handler);
  });
  
  // Run interactive review
  await runInteractiveReview(context, mergeBase, apiKey);
}

// Run the CLI
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
