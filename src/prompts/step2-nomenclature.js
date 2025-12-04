import { buildContextSection, buildConversationHistory } from './base.js';

export const STEP_TITLE = 'Nomenclature';
export const number = 2;

export function buildPrompt(context, mergeBase, previousSteps = []) {
  const sections = [];
  
  sections.push('You are an expert code reviewer specializing in React and TypeScript projects.\n');
  
  sections.push(buildContextSection(context, mergeBase));
  sections.push(buildConversationHistory(previousSteps));
  
  sections.push('\n---\n');
  sections.push('# TASK: NOMENCLATURE DEEP DIVE\n');
  sections.push('Focus exclusively on naming, conventions, and clarity following React/TypeScript best practices:\n');
  
  sections.push('## File Names');
  sections.push('- React components: PascalCase (e.g., `UserProfile.tsx`, not `user-profile.tsx`)');
  sections.push('- Hooks: camelCase starting with "use" (e.g., `useAuth.ts`)');
  sections.push('- Utilities/helpers: camelCase (e.g., `formatDate.ts`)');
  sections.push('- Test files: match source file name with `.test` or `.spec` suffix');
  sections.push('- Are files in appropriate directories (components/, hooks/, utils/, etc.)?\n');
  
  sections.push('## Components & Hooks');
  sections.push('- Component names: PascalCase, descriptive, noun-based (e.g., `UserCard` not `ShowUser`)');
  sections.push('- Custom hooks: camelCase, start with "use" (e.g., `useLocalStorage`)');
  sections.push('- Props interfaces: `ComponentNameProps` pattern (e.g., `UserCardProps`)');
  sections.push('- Avoid generic names like `Component`, `Item`, `Data`');
  sections.push('- Event handlers: `handle` prefix (e.g., `handleClick`, `handleSubmit`)\n');
  
  sections.push('## Variables & Functions');
  sections.push('- Boolean variables: use `is`, `has`, `should` prefixes (e.g., `isLoading`, `hasError`)');
  sections.push('- Functions: verb-based, camelCase (e.g., `fetchUser`, `calculateTotal`)');
  sections.push('- Constants: UPPER_SNAKE_CASE for true constants (e.g., `MAX_RETRIES`)');
  sections.push('- Avoid abbreviations unless well-known (URL, HTTP ok; usr, btn not ok)');
  sections.push('- Compare against naming patterns in the codebase context provided\n');
  
  sections.push('## TypeScript Types & Interfaces');
  sections.push('- Interfaces: PascalCase, describe what they represent (e.g., `User`, `ApiResponse`)');
  sections.push('- Type aliases: PascalCase (e.g., `UserId`, `StatusType`)');
  sections.push('- Generic type parameters: single uppercase letter or descriptive (e.g., `T`, `TData`, `TError`)');
  sections.push('- Avoid `I` prefix for interfaces (old C# convention, not TypeScript standard)');
  sections.push('- Union types: descriptive names (e.g., `Status = "idle" | "loading" | "success"` not `S`)\n');
  
  sections.push('## Typos & Language');
  sections.push('- Any typos in variable/function/file names?');
  sections.push('- Consistent terminology throughout (e.g., user vs customer, fetch vs get)?');
  sections.push('- Proper English grammar in names?\n');
  
  sections.push('---');
  sections.push('**CRITICAL INSTRUCTION:**');
  sections.push('- Report ONLY issues and improvements needed');
  sections.push('- If no issues found, state: "No nomenclature issues found" (one sentence only)');
  sections.push('- Do NOT list things that are correct');
  sections.push('- Focus on React/TypeScript community standards');
  sections.push('- Be thorough in finding problems, minimal in praising what works');
  sections.push('- Use markdown formatting with specific examples and suggestions.');
  
  return sections.join('\n');
}
