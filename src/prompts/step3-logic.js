import { buildContextSection, buildConversationHistory } from './base.js';

export const STEP_TITLE = 'Logic & Potential Bugs';
export const number = 3;

export function buildPrompt(context, mergeBase, previousSteps = []) {
  const sections = [];
  
  sections.push('You are an expert code reviewer specializing in React and TypeScript projects.\n');
  
  sections.push(buildContextSection(context, mergeBase));
  sections.push(buildConversationHistory(previousSteps));
  
  sections.push('\n---\n');
  sections.push('# TASK: LOGIC & POTENTIAL BUGS\n');
  sections.push('Deep dive into correctness and code quality following React/TypeScript best practices:\n');
  sections.push('**IMPORTANT**: Review the changed lines of code from the "Git Diff" (lines prefixed with `+` or `-`). Analyze them in the context of the surrounding code, but only flag issues *in the changes*.\n');
  
  sections.push('## TypeScript Type Safety');
  sections.push('- Are there `any` types that should be specific?');
  sections.push('- Missing type annotations on function parameters/returns?');
  sections.push('- Unsafe type assertions (`as`) without validation?');
  sections.push('- Non-null assertions (`!`) that could fail?\n');
  
  sections.push('## Null/Undefined Safety');
  sections.push('- Potential null/undefined access errors?');
  sections.push('- Missing optional chaining (`?.`) or nullish coalescing (`??`)?');
  sections.push('- Empty array/object checks before accessing?');
  sections.push('- Proper handling of optional props?\n');
  
  sections.push('## React-Specific Issues');
  sections.push('- **Dependencies**: Missing or incorrect dependency arrays in useEffect/useMemo/useCallback?');
  sections.push('- **State updates**: Using stale state in callbacks? Need functional updates?');
  sections.push('- **Keys**: Missing or non-unique keys in lists?');
  sections.push('- **Hook rules**: Hooks called conditionally or in loops?');
  sections.push('- **Closures**: Stale closures in event handlers or effects?');
  sections.push('- **Refs**: Using refs when state would be better (or vice versa)?\n');
  
  sections.push('## Performance Concerns');
  sections.push('- Missing memoization causing unnecessary re-renders?');
  sections.push('- Inline function/object creation in render (should use useCallback/useMemo)?');
  sections.push('- Heavy computations that should be memoized?');
  sections.push('- Note: Only flag if actually problematic, not premature optimization\n');
  
  sections.push('## Edge Cases & Boundary Conditions');
  sections.push('- Empty arrays/strings/objects handled?');
  sections.push('- Zero/negative numbers handled?');
  sections.push('- Array index boundaries checked?');
  sections.push('- Loading/error states properly managed?\n');
  
  sections.push('## Logic Errors');
  sections.push('- Incorrect operators or comparisons (=== vs ==, && vs ||)?');
  sections.push('- Off-by-one errors in loops or array access?');
  sections.push('- Wrong assumptions about data structure?');
  sections.push('- Race conditions in async operations?\n');
  
  sections.push('## Code Smells');
  sections.push('- Components doing too much (>300 lines, multiple responsibilities)?');
  sections.push('- Excessive prop drilling (>2-3 levels)?');
  sections.push('- Code duplication that should be extracted?');
  sections.push('- Complex nested ternaries or conditionals?\n');
  
  sections.push('## Readability');
  sections.push('- Complex logic needing comments?');
  sections.push('- Magic numbers that should be named constants?');
  sections.push('- Unclear variable names in complex logic?\n');
  
  sections.push('---');
  sections.push('**CRITICAL INSTRUCTION:**');
  sections.push('- Focus ONLY on problems and improvements');
  sections.push('- If no issues found, state: "No logic or bug issues found" (one sentence only)');
  sections.push('- Do NOT mention things that are working correctly');
  sections.push('- Follow React and TypeScript community best practices');
  sections.push('- Be thorough and specific. Reference line numbers from the diff.');
  sections.push('- Provide code examples for suggested fixes.');
  sections.push('- Use markdown formatting.');
  
  return sections.join('\n');
}
