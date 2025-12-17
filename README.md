# Tic Tac Toe Automation Framework

Playwright + TypeScript automation framework for testing the Tic Tac Toe application.

## Application Under Test
https://calendly.github.io/cypress_tictactoe/

## Prerequisites
- Node.js (v18 or higher)
- npm

## Setup

```bash
# Navigate to the project directory
cd tictactoe-automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI
npm run test:ui

# Run specific test file
npx playwright test tests/bug1-wrong-winner.spec.ts

# Run tests with specific tag/grep
npx playwright test --grep "Bug #1"
```

## View Test Report

```bash
npm run report
```

## Project Structure

```
tictactoe-automation/
├── pages/
│   └── TicTacToePage.ts      # Page Object Model
├── tests/
│   ├── bug1-wrong-winner.spec.ts
│   ├── bug2-input-validation.spec.ts
│   ├── bug3-draw-detection.spec.ts
│   ├── bug4-input-after-win.spec.ts
│   ├── bug5-no-restart-button.spec.ts
│   ├── bug6-board-not-cleared.spec.ts
│   └── bug7-turn-indicator.spec.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Test Coverage

| Bug # | Test File | Scenarios Covered |
|-------|-----------|-------------------|
| 1 | bug1-wrong-winner.spec.ts | X wins, O wins - verify correct winner announced |
| 2 | bug2-input-validation.spec.ts | Empty, non-numeric, zero, negative, decimal inputs |
| 3 | bug3-draw-detection.spec.ts | Fill all cells without winner, verify draw message |
| 4 | bug4-input-after-win.spec.ts | Click cells after game over, verify no changes |
| 5 | bug5-no-restart-button.spec.ts | Check for Play Again button, verify restart capability |
| 6 | bug6-board-not-cleared.spec.ts | Start new game, verify board clears properly |
| 7 | bug7-turn-indicator.spec.ts | Check for turn indicator presence and updates |

## Notes

- Tests are written to **fail** when bugs are present (as expected)
- Once bugs are fixed, tests should pass
- Each test file includes comments referencing the Acceptance Criteria from the bug report

## Author
Tyler Fataliyev
