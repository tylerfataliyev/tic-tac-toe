import { test, expect } from '@playwright/test';
import { TicTacToePage } from '../pages/TicTacToePage';

test.describe('Bug #1: Wrong Winner Gets Announced', () => {
  /**
   * Acceptance Criteria: Given a player completes a winning line, when the game ends,
   * then the congratulations message should display the correct winning player's symbol (X or O).
   */

  test('should announce X as winner when X completes a winning line', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // X wins with top row: cells 0, 1, 2
    await ticTacToe.clickCell(0);  // X - top-left
    await ticTacToe.clickCell(3);  // O - middle-left
    await ticTacToe.clickCell(1);  // X - top-middle
    await ticTacToe.clickCell(4);  // O - middle-middle
    await ticTacToe.clickCell(2);  // X - top-right (X wins)

    // Wait for end game overlay to appear
    await expect(ticTacToe.endGameOverlay).toBeVisible();
    
    const message = await ticTacToe.getEndGameMessage();
    
    // BUG: Currently shows "Congratulations player O!" instead of X
    expect(message).toContain('player X');
  });

  test('should announce O as winner when O completes a winning line', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // O wins with left column: cells 0, 3, 6
    await ticTacToe.clickCell(1);  // X - top-middle
    await ticTacToe.clickCell(0);  // O - top-left
    await ticTacToe.clickCell(2);  // X - top-right
    await ticTacToe.clickCell(3);  // O - middle-left
    await ticTacToe.clickCell(4);  // X - middle-middle
    await ticTacToe.clickCell(6);  // O - bottom-left (O wins)

    await expect(ticTacToe.endGameOverlay).toBeVisible();
    
    const message = await ticTacToe.getEndGameMessage();
    
    // BUG: Currently shows "Congratulations player X!" instead of O
    expect(message).toContain('player O');
  });
});
