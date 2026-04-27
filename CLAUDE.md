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

React 19 SPA (Vite) for a Chinese vocabulary learning app ("Daily Dragon").

**Authentication**: AWS Cognito via `aws-amplify`. The entire app is wrapped in `<Authenticator>` in `App.jsx`. `src/services/auth.js` exports `getToken()` (wraps `fetchAuthSession()`) — used by all services for Bearer tokens.

**Backend**: AWS API Gateway at `src/config.js` (`DAILY_DRAGON_API_BASE_URL`). Two services:
- `src/services/vocabularyService.js` — CRUD for user vocabulary (`/vocabulary`)
- `src/services/ai/aiService.js` — OpenAI proxy (`/practice/sentences`, `/practice/evaluate-translations`); prompt templates in `src/services/ai/prompts.js`

**Routing** (`react-router-dom` v7):
- `/` → `Home`
- `/vocabulary` → `VocabularyPage` (add/remove/list Chinese words)
- `/practice` → `Practice` (state machine: WELCOME → IN_PROGRESS → REVIEW)

**Practice flow** (`src/components/practice/`):
1. `WelcomePage` — Start button
2. `PracticePage` — fetches vocabulary, calls AI for sentences, user types English translations
3. `ReviewPage` — displays AI-evaluated results; can reset to WELCOME or retry IN_PROGRESS

**UI**: Chakra UI v3 (`@chakra-ui/react`) with `defaultSystem` provider. Toasts via `src/components/ui/toaster.jsx`.

**Testing**: Jest + `@testing-library/react`. Tests in `src/tests/` mirror `src/components/` and `src/services/`. Mock services with `jest.mock(...)`. Wrap components in `<ChakraProvider value={defaultSystem}>`.