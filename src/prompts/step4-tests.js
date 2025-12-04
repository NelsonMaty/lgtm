import { buildContextSection, buildConversationHistory} from './base.js';

export const STEP_TITLE = 'Test Analysis';
export const number = 4;

export function buildPrompt(context, mergeBase, previousSteps = []) {
  const sections = [];
  
  sections.push('You are an expert code reviewer specializing in React and TypeScript projects.\n');
  
  sections.push(buildContextSection(context, mergeBase));
  sections.push(buildConversationHistory(previousSteps));
  
  sections.push('\n---\n');
  sections.push('# TASK: TEST ANALYSIS\n');
  sections.push('Evaluate test coverage and quality following React Testing Library best practices:\n');
  sections.push('**IMPORTANT**: Analyze how the tests cover the specific changes introduced in the "Git Diff". Flag any gaps in testing related **directly** to the modified code.\n');
  
  sections.push('## React Testing Library Philosophy');
  sections.push('Tests should follow these principles:');
  sections.push('- **Test behavior, not implementation**: Query by text/role/label users see, not by component internals');
  sections.push('- **Avoid testing internal state**: Test what renders, not component state values');
  sections.push('- **No shallow rendering**: Always use full rendering with `render()`');
  sections.push('- **User interactions**: Use `userEvent` over `fireEvent` for realistic interactions');
  sections.push('- **Async properly**: Use `waitFor`, `findBy*` queries for async operations\n');
  
  sections.push('## Scenario Coverage');
  sections.push('Looking at the changed code and related tests:');
  sections.push('- Are all user-visible behaviors tested?');
  sections.push('- Are edge cases covered (empty states, loading, errors)?');
  sections.push('- Are different user interactions tested (click, type, submit)?');
  sections.push('- Are accessibility features tested (keyboard nav, ARIA)?');
  sections.push('- If no test file found, what scenarios SHOULD be tested?\n');
  
  sections.push('## Test Quality - React Testing Library Patterns');
  sections.push('**Good patterns to look for:**');
  sections.push('- Using `screen.getByRole`, `getByLabelText`, `getByText` (not `getByTestId` unless necessary)');
  sections.push('- Using `userEvent` for interactions (not `fireEvent`)');
  sections.push('- Using `waitFor` or `findBy*` for async (not manual `act()`)');
  sections.push('- Testing accessibility with roles and ARIA queries');
  sections.push('- Clear arrange-act-assert structure');
  sections.push('- Descriptive test names ("should show error when..." not "test 1")\n');
  
  sections.push('**Anti-patterns to flag:**');
  sections.push('- Testing implementation details (component state, props directly)');
  sections.push('- Using `getByTestId` excessively (should use semantic queries)');
  sections.push('- Shallow rendering or enzyme patterns');
  sections.push('- Testing internal methods or private functions');
  sections.push('- Mocking too much (over-mocking makes tests brittle)');
  sections.push('- Snapshots testing (often anti-pattern in React, tests implementation)\n');
  
  sections.push('## Mocking Strategy');
  sections.push('- Are external dependencies (API calls, routing) properly mocked?');
  sections.push('- Is mocking minimal and focused (not mocking React itself)?');
  sections.push('- Mock data realistic and representative?\n');
  
  sections.push('## Missing Tests');
  sections.push('List specific test cases that should be added, with React Testing Library examples:');
  sections.push('```typescript');
  sections.push('it("should show error message when submission fails", async () => {');
  sections.push('  const user = userEvent.setup();');
  sections.push('  render(<MyComponent />);');
  sections.push('  ');
  sections.push('  await user.click(screen.getByRole("button", { name: /submit/i }));');
  sections.push('  ');
  sections.push('  expect(await screen.findByText(/error occurred/i)).toBeInTheDocument();');
  sections.push('});');
  sections.push('```\n');
  
  sections.push('---');
  sections.push('**CRITICAL INSTRUCTION:**');
  sections.push('- Focus ONLY on gaps, issues, and anti-patterns');
  sections.push('- If coverage is comprehensive and follows RTL best practices, state: "Test coverage is comprehensive" (one sentence only)');
  sections.push('- Do NOT list existing tests that are fine');
  sections.push('- Flag React Testing Library anti-patterns (testing implementation, over-mocking, shallow rendering)');
  sections.push('- Be specific about what\'s missing and why it matters');
  sections.push('- Provide React Testing Library example test cases for gaps');
  sections.push('- Use markdown formatting.');
  
  return sections.join('\n');
}
