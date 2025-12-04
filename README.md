# lgtm

AI-powered code review CLI for React/TypeScript projects.

**LGTM?** Let's find out. 😏

## Features

- 🎯 **5 focused review steps** - Overview, Nomenclature, Logic & Bugs, Tests, UX & Production
- ⚛️  **React/TypeScript best practices** - Community standards enforced
- 💬 **Interactive Q&A** - Ask follow-up questions about findings
- ✨ **Beautiful terminal UI** - Syntax-highlighted markdown output
- ⚡ **Fast & affordable** - Powered by Gemini 2.0 Flash (~$0.001 per review)

## Installation

```bash
# Clone
git clone https://github.com/NelsonMaty/lgtm.git
cd lgtm

# Install globally
npm install -g .
```

## Usage

```bash
# From your feature branch
cd /path/to/your/react-project
lgtm --api-key your_gemini_key

# Or with environment variable
export GEMINI_API_KEY=your_key
lgtm
```

Get your API key: https://aistudio.google.com/app/apikey

## How It Works

Type `lgtm` and watch the AI review your PR in 5 steps:

1. **Overview** - What changed
2. **Nomenclature** - Naming conventions (PascalCase, camelCase, TypeScript standards)
3. **Logic & Bugs** - Type safety, React hooks, null checks, edge cases
4. **Tests** - React Testing Library best practices, coverage analysis
5. **UX & Production** - Accessibility, error handling, security, performance

After each step:
- Press **Enter** to continue
- Press **a** to ask questions
- Press **s** to skip next step
- Press **q** to quit

## React Best Practices

Enforces community standards:

- **Components**: PascalCase, descriptive names
- **Hooks**: camelCase starting with "use"
- **Props**: ComponentNameProps pattern
- **Types**: No `I` prefix, proper inference
- **Tests**: Behavior over implementation, React Testing Library patterns
- **Accessibility**: Semantic HTML, ARIA, keyboard navigation
- **Security**: XSS prevention, data exposure checks

## Requirements

- Node.js 18+
- Git repository with `develop` branch
- Gemini API key (free tier available)

## Future Features
- [ ] Multiple LLM support
- [ ] Azure devops integration
- [ ] `--vibe` flag to adjust feedback tone (constructive, roast, zen, etc.)


## License

MIT

## Contributing

Issues and PRs welcome!

