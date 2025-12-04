import { getDiff } from '../git.js';

/**
 * Build the common context section used across all prompts
 */
export function buildContextSection(context, mergeBase) {
  const sections = [];
  
  sections.push('# CODE CONTEXT\n');
  
  // Git diff
  sections.push('## Git Diff\n');
  sections.push('```diff');
  sections.push(getDiff(mergeBase));
  sections.push('```\n');
  
  // Changed files with full content
  sections.push('## Changed Files\n');
  for (const file of context.changedFiles) {
    sections.push(`### ${file.path}\n`);
    sections.push('```');
    sections.push(file.content);
    sections.push('```\n');
  }
  
  // Dependencies (for pattern comparison)
  if (context.dependencies.length > 0) {
    sections.push('## Codebase Context (for pattern comparison)\n');
    for (const dep of context.dependencies) {
      sections.push(`### ${dep.path}\n`);
      sections.push('```');
      sections.push(dep.content);
      sections.push('```\n');
    }
  }
  
  // Test files
  if (context.testFiles.length > 0) {
    sections.push('## Related Tests\n');
    for (const test of context.testFiles) {
      sections.push(`### ${test.path}\n`);
      sections.push('```');
      sections.push(test.content);
      sections.push('```\n');
    }
  }
  
  return sections.join('\n');
}

/**
 * Build a conversation history section for context continuity
 */
export function buildConversationHistory(previousSteps) {
  if (!previousSteps || previousSteps.length === 0) {
    return '';
  }
  
  const sections = [];
  sections.push('\n# PREVIOUS REVIEW STEPS\n');
  sections.push('For context, here are the findings from previous review steps:\n');
  
  for (const step of previousSteps) {
    sections.push(`## ${step.title}\n`);
    sections.push(step.response + '\n');
  }
  
  return sections.join('\n');
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}
