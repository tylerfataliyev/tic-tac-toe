import { test, expect } from '@playwright/test';
import { TicTacToePage } from '../pages/TicTacToePage';

test.describe('Bug #7: No Current Turn Indicator', () => {
  /**
   * Acceptance Criteria: Given the game is in progress, when a player completes their turn,
   * then the interface should display whose turn it is next (e.g., "Player X's Turn" or "Player O's Turn").
   */

  test('should display turn indicator at game start', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // BUG: Look for any turn indicator on the page
    const turnIndicator = page.locator('text=/player [xo].*turn|[xo].*turn|turn.*[xo]|current.*player/i');
    const anyTurnText = page.locator('text=/whose turn|next turn|your turn/i');

    // Expected: Some indication of whose turn it is (X should start)
    // Actual: No turn indicator exists
    const hasTurnIndicator = await turnIndicator.count() > 0 || await anyTurnText.count() > 0;
    
    expect(hasTurnIndicator).toBe(true);
  });

  test('should show X turn indicator at start of game', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // X always starts first, so turn indicator should show X
    const pageText = await page.locator('body').innerText();
    
    // BUG: There's no turn indicator, so this will fail
    // Expected: Page should contain text indicating it's X's turn
    expect(pageText.toLowerCase()).toMatch(/x.*turn|turn.*x|player x/i);
  });

  test('should update turn indicator after each move', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Before any moves - should be X's turn
    let pageText = await page.locator('body').innerText();
    
    // BUG: No indicator exists to update
    // If indicator existed, we would verify it shows X
    
    // Make first move (X)
    await ticTacToe.clickCell(0);
    
    // After X moves, should show O's turn
    pageText = await page.locator('body').innerText();
    // Expected: Should now indicate O's turn
    
    // Make second move (O)
    await ticTacToe.clickCell(1);
    
    // After O moves, should show X's turn again
    pageText = await page.locator('body').innerText();
    // Expected: Should now indicate X's turn
    
    // Since there's no turn indicator, we document this as a failed expectation
    const turnIndicator = page.locator('[class*="turn"], [id*="turn"], [data-testid*="turn"]');
    expect(await turnIndicator.count()).toBeGreaterThan(0);
  });

  test('user cannot determine current player without turn indicator', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Make several moves
    await ticTacToe.clickCell(0);  // X
    await ticTacToe.clickCell(4);  // O
    await ticTacToe.clickCell(2);  // X

    // At this point it should be O's turn
    // BUG: User has no way to know this from the UI
    
    // Check if there's ANY visual indication of current player
    const hasVisualIndicator = await page.evaluate(() => {
      const body = document.body.innerText.toLowerCase();
      return body.includes('turn') || 
             body.includes('player x') || 
             body.includes('player o') ||
             body.includes("x's") ||
             body.includes("o's");
    });

    // Expected: true - there should be some indication
    // Actual: false - no turn indicator exists
    expect(hasVisualIndicator).toBe(true);
  });
});
