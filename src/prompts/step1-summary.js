import { buildContextSection } from './base.js';

export const STEP_TITLE = 'Overview';
export const number = 1;

export function buildPrompt(context, mergeBase) {
  const sections = [];
  
  sections.push('You are an expert code reviewer specializing in React and TypeScript projects.\n');
  
  sections.push(buildContextSection(context, mergeBase));
  
  sections.push('\n---\n');
  sections.push('# TASK: CODE OVERVIEW (NO REVIEW YET)\n');
  sections.push('Provide a purely descriptive overview of what changed. NO judgments or reviews yet.\n');
  sections.push('Base your summary **only** on the changes shown in the "Git Diff" section (lines starting with `+` or `-`).\n');
  
  sections.push('## What Changed');
  sections.push('Describe in 2-3 paragraphs:');
  sections.push('- What files were modified, added, or removed');
  sections.push('- What functionality is being added, changed, or removed');
  sections.push('- The technical approach taken (new components, refactoring, bug fixes, API changes, etc.)');
  sections.push('- Any architectural or structural changes to the codebase\n');
  
  sections.push('---');
  sections.push('**CRITICAL INSTRUCTIONS:**');
  sections.push('- This is OVERVIEW ONLY - do not review or judge the code yet');
  sections.push('- Do NOT mention bugs, issues, problems, or improvements');
  sections.push('- Do NOT say things like "good", "bad", "should", "could be better"');
  sections.push('- Just describe what changed factually and neutrally');
  sections.push('- Think of this as reading a git commit message - just state what happened');
  sections.push('- Detailed review will happen in the next 4 steps');
  sections.push('- Use markdown formatting. Be clear and concise.');
  
  return sections.join('\n');
}
