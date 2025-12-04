import { buildContextSection, buildConversationHistory } from './base.js';

export const STEP_TITLE = 'UX & Production Readiness';
export const number = 5;

export function buildPrompt(context, mergeBase, previousSteps = []) {
  const sections = [];
  
  sections.push('You are an expert code reviewer specializing in React and TypeScript projects.\n');
  
  sections.push(buildContextSection(context, mergeBase));
  sections.push(buildConversationHistory(previousSteps));
  
  sections.push('\n---\n');
  sections.push('# TASK: UX & PRODUCTION READINESS\n');
  sections.push('Focus on user experience, accessibility, error handling, security, and production concerns:\n');
  sections.push('**IMPORTANT**: Review the changed lines of code from the "Git Diff" (lines prefixed with `+` or `-`). Evaluate the impact of these specific changes on UX, security, and production readiness.\n');
  
  sections.push('## Accessibility (A11y)');
  sections.push('Critical for all users, including those with disabilities:');
  sections.push('- **Semantic HTML**: Using correct elements (button, nav, main, article)?');
  sections.push('- **ARIA**: Missing labels, roles, or descriptions for interactive elements?');
  sections.push('- **Keyboard navigation**: Can users navigate without a mouse?');
  sections.push('- **Focus management**: Visible focus indicators? Focus traps in modals?');
  sections.push('- **Screen readers**: Alt text on images? Meaningful link text?');
  sections.push('- **Color contrast**: Text readable? Not relying solely on color?');
  sections.push('- **Forms**: Proper labels, error messages, field associations?\n');
  
  sections.push('## Error Handling & Resilience');
  sections.push('How does the app handle problems?');
  sections.push('- **Error boundaries**: React error boundaries in place for component errors?');
  sections.push('- **API failures**: Network errors handled gracefully? Retry logic?');
  sections.push('- **User feedback**: Clear error messages (not just "Error occurred")?');
  sections.push('- **Fallbacks**: Graceful degradation when features fail?');
  sections.push('- **Input validation**: Client-side validation with helpful messages?');
  sections.push('- **Loading states**: Proper loading indicators during async operations?');
  sections.push('- **Empty states**: Helpful messages when no data available?\n');
  
  sections.push('## Security Concerns');
  sections.push('Protecting user data and preventing vulnerabilities:');
  sections.push('- **XSS prevention**: User input properly sanitized? Using dangerouslySetInnerHTML safely?');
  sections.push('- **Data exposure**: Sensitive data in logs, errors, or URL params?');
  sections.push('- **Authentication**: Tokens/credentials handled securely?');
  sections.push('- **Authorization**: Proper permission checks before showing/enabling features?');
  sections.push('- **CSRF protection**: Forms protected against cross-site request forgery?');
  sections.push('- **Dependencies**: Known security vulnerabilities in packages?\n');
  
  sections.push('## Performance (User-Facing)');
  sections.push('Only flag if it impacts user experience:');
  sections.push('- **Perceived performance**: Loading indicators? Skeleton screens? Optimistic updates?');
  sections.push('- **Large bundles**: Code splitting for routes or heavy features?');
  sections.push('- **Images**: Optimized? Lazy loaded? Proper formats (WebP)?');
  sections.push('- **Virtualization**: Long lists (>100 items) that should be virtualized?');
  sections.push('- **Network waterfalls**: Multiple sequential requests that could be parallel?\n');
  
  sections.push('## User Experience (UX)');
  sections.push('Does this feel good to use?');
  sections.push('- **Feedback**: User actions acknowledged (button states, toasts, confirmations)?');
  sections.push('- **Discoverability**: Features obvious? Clear calls-to-action?');
  sections.push('- **Copy/messaging**: Clear, helpful text? Avoid jargon?');
  sections.push('- **Responsive**: Works on mobile/tablet? Touch-friendly?');
  sections.push('- **Consistency**: Follows established patterns in the app?');
  sections.push('- **Destructive actions**: Confirmations before delete/irreversible operations?\n');
  
  sections.push('## Production Considerations');
  sections.push('Ready for real users?');
  sections.push('- **Environment config**: API URLs, feature flags configurable?');
  sections.push('- **Logging**: Appropriate logging for debugging production issues?');
  sections.push('- **Monitoring**: Can we track errors/performance in production?');
  sections.push('- **Backwards compatibility**: Breaking changes handled gracefully?');
  sections.push('- **Rollback safety**: Can this be safely rolled back if issues arise?\n');
  
  sections.push('---');
  sections.push('**CRITICAL INSTRUCTION:**');
  sections.push('- Focus ONLY on user-facing concerns and production readiness');
  sections.push('- If no concerns, state: "No UX or production concerns" (one sentence only)');
  sections.push('- Do NOT repeat issues from previous steps (logic, tests, architecture)');
  sections.push('- Think from end-user perspective: accessibility, security, error handling');
  sections.push('- Flag only issues that affect real users or production stability');
  sections.push('- Use markdown formatting.');
  
  return sections.join('\n');
}
