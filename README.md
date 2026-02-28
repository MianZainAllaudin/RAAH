# RAAH

Lightweight TypeScript app for the HCI Semester 5 project.

## Overview
RAAH is a small TypeScript project scaffolded for Human–Computer Interaction coursework. It contains source code, builds, and includes basic scripts for build, run and test.

## Main features (functionalities)
- Interactive prototype screens: multi-view UI prototypes for user flows and tasks.
- Navigation & routing: lightweight client-side routing between prototype screens.
- State management utilities: simple state store and helpers for form and UI state.
- User input handling: form validation, keyboard navigation, and gesture support.
- Accessibility-first UI: semantic markup, ARIA attributes, keyboard focus management, high-contrast support.
- Theming & layout: light/dark themes, responsive grid system for varied screen sizes.
- Component library: reusable UI components (buttons, inputs, modals, lists).
- Data persistence: localStorage/sessionStorage helpers for saving sessions and preferences.
- Export/import: export prototype data (JSON) and import for sharing test cases.
- User testing hooks: instrumentation points for logging user actions and timings.
- Simple analytics: basic event logging and session summaries for evaluation.
- Offline-friendly dev: local dev server and caching strategies for prototype testing without backend.
- Test scaffold: unit tests for components and utilities (Jest recommended).
- CLI scripts: build, dev (watch), start and test scripts for development workflow.


## Prerequisites
- Node.js (v14+)
- npm (or yarn)
- Git (optional)

## Installation (Windows)
```powershell
# from project root
npm install
```

## Common scripts
```powershell
npm run build    # compile TypeScript to dist/
npm start        # run compiled app (node dist/app.js)
npm run dev      # start dev mode (e.g. nodemon or tsc --watch)
npm test         # run tests
```

If scripts are not defined, add them to package.json:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "tsc --watch",
    "test": "jest"
  }
}
```

## Project structure
- backend/ — Server-side code (e.g. Express) including entry (server.ts), routes/controllers, models/services, config, DB migrations, and tests.
- components/ — Reusable UI pieces (e.g. React) including component files (Button.tsx), styles, props/types, unit tests and storybook stories.
- package.json — dependencies and scripts
- tsconfig.json — TypeScript configuration

## Development notes
- Use `npm run dev` during development.
- Ensure `outDir` in tsconfig.json is set to `dist`.
- Add `.gitignore` with `node_modules/` and `dist/`.

## License

Proprietary License

Copyright (c) 2025 Zain Allaudin

All rights reserved.

This software and associated documentation files (AI Resume Optimizer) are the exclusive property of Zain Allaudin. Unauthorized copying, modification, distribution, or use of the Software, in whole or in part, is strictly prohibited without prior written permission from the copyright holder.

The Software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the copyright holder be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Software or the use or other dealings in the Software.

