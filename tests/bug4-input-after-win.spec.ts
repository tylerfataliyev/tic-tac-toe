import { test, expect } from '@playwright/test';
import { TicTacToePage } from '../pages/TicTacToePage';

test.describe('Bug #4: Game Accepts Input After Win Condition', () => {
  /**
   * Acceptance Criteria: Given a player has won the game and the overlay is displayed,
   * when the user clicks on any cell, then no additional moves should be registered on the board.
   */

  test('should not allow moves after X wins', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // X wins with top row
    await ticTacToe.clickCell(0);  // X
    await ticTacToe.clickCell(3);  // O
    await ticTacToe.clickCell(1);  // X
    await ticTacToe.clickCell(4);  // O
    await ticTacToe.clickCell(2);  // X wins

    // Verify game ended
    await expect(ticTacToe.endGameOverlay).toBeVisible();

    // Get state of remaining empty cells before attempting clicks
    const cell5TextBefore = await ticTacToe.getCellText(5);
    const cell6TextBefore = await ticTacToe.getCellText(6);

    // BUG: Try clicking on empty cells after game ended using JavaScript (bypassing overlay)
    await page.evaluate(() => {
      document.getElementById('5')?.click();
      document.getElementById('6')?.click();
    });

    // Get state after clicks
    const cell5TextAfter = await ticTacToe.getCellText(5);
    const cell6TextAfter = await ticTacToe.getCellText(6);

    // Expected: Cells should remain unchanged (game should be locked)
    // Actual: BUG - cells accept new X/O values even after win
    expect(cell5TextAfter).toBe(cell5TextBefore);
    expect(cell6TextAfter).toBe(cell6TextBefore);
  });

  test('should not allow moves after O wins', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // O wins with left column
    await ticTacToe.clickCell(1);  // X
    await ticTacToe.clickCell(0);  // O
    await ticTacToe.clickCell(2);  // X
    await ticTacToe.clickCell(3);  // O
    await ticTacToe.clickCell(4);  // X
    await ticTacToe.clickCell(6);  // O wins

    await expect(ticTacToe.endGameOverlay).toBeVisible();

    // Record state of empty cells
    const cell5TextBefore = await ticTacToe.getCellText(5);
    const cell7TextBefore = await ticTacToe.getCellText(7);

    // BUG: Try clicking via JavaScript (simulating clicks that bypass overlay)
    await page.evaluate(() => {
      document.getElementById('5')?.click();
      document.getElementById('7')?.click();
    });

    // Verify cells haven't changed
    const cell5TextAfter = await ticTacToe.getCellText(5);
    const cell7TextAfter = await ticTacToe.getCellText(7);
    
    expect(cell5TextAfter).toBe(cell5TextBefore);
    expect(cell7TextAfter).toBe(cell7TextBefore);
  });

  test('should not register any additional moves count after win', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Play to X win
    await ticTacToe.clickCell(0);  // X
    await ticTacToe.clickCell(3);  // O
    await ticTacToe.clickCell(1);  // X
    await ticTacToe.clickCell(4);  // O
    await ticTacToe.clickCell(2);  // X wins

    await expect(ticTacToe.endGameOverlay).toBeVisible();

    // Count filled cells before additional clicks
    const emptyCellsBefore = await ticTacToe.getEmptyCells();
    const filledCountBefore = 9 - emptyCellsBefore.length;

    // BUG: Attempt to make more moves via JavaScript
    await page.evaluate(() => {
      [5, 6, 7, 8].forEach(id => document.getElementById(String(id))?.click());
    });

    // Count filled cells after
    const emptyCellsAfter = await ticTacToe.getEmptyCells();
    const filledCountAfter = 9 - emptyCellsAfter.length;

    // Expected: Filled count should remain the same (game locked)
    // Actual: BUG - more moves are registered
    expect(filledCountAfter).toBe(filledCountBefore);
  });
});
