# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run all Jest tests
npm run test:coverage  # Run tests with coverage (80% threshold enforced on branches/functions/lines/statements)
```

To run a single test file:
```bash
npx jest src/tests/components/vocabulary/AddWordDialog.test.jsx
```

## Architecture

This is a React 19 SPA (Vite) for a Chinese vocabulary learning app ("Daily Dragon").

**Authentication**: AWS Cognito via `aws-amplify`. The entire app is wrapped in `<Authenticator>` in `App.jsx`. Auth tokens are fetched with `fetchAuthSession()` from `aws-amplify/auth` and sent as `Bearer` tokens on every API call.

**Backend**: AWS API Gateway at `src/config.js` (`DAILY_DRAGON_API_BASE_URL`). Two services call it:
- `src/services/vocabularyService.js` — CRUD for user vocabulary (`/vocabulary`)
- `src/services/ai/aiService.js` — OpenAI proxy for generating practice sentences and evaluating translations (`/openai`)

**Routing** (`react-router-dom` v6):
- `/` → `Home`
- `/vocabulary` → `VocabularyPage` (add/remove/list Chinese words)
- `/practice` → `Practice` (state machine: WELCOME → IN_PROGRESS → REVIEW)

**Practice flow** (`src/components/practice/`):
1. `WelcomePage` — entry point with Start button
2. `PracticePage` — fetches 5 random words, calls AI to generate Chinese sentences, user types English translations
3. `ReviewPage` — displays AI-evaluated results (score, feedback per sentence)

**UI**: Chakra UI v3 (`@chakra-ui/react`) with `defaultSystem` provider. Toast notifications use the custom wrapper at `src/components/ui/toaster.jsx`.

**Testing**: Jest + `@testing-library/react`. Tests live in `src/tests/` mirroring `src/components/`. Services are mocked with `jest.mock(...)`. Tests wrap components in `<ChakraProvider value={defaultSystem}>`. Babel (`babel.config.js`) transpiles for Jest since Vite handles the dev/build pipeline separately.