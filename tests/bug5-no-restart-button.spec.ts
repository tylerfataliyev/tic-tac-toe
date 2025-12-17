import { test, expect } from '@playwright/test';
import { TicTacToePage } from '../pages/TicTacToePage';

test.describe('Bug #5: No Restart Option Available', () => {
  /**
   * Acceptance Criteria: Given the game has ended (win or draw), when the end-game overlay is displayed,
   * then a "Play Again" button should be available that resets the game without requiring a browser refresh.
   */

  test('should have a Play Again button after win', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Play to a win
    await ticTacToe.clickCell(0);  // X
    await ticTacToe.clickCell(3);  // O
    await ticTacToe.clickCell(1);  // X
    await ticTacToe.clickCell(4);  // O
    await ticTacToe.clickCell(2);  // X wins

    await expect(ticTacToe.endGameOverlay).toBeVisible();

    // BUG: Look for a restart/play again button - it doesn't exist
    const playAgainButton = page.locator('button', { hasText: /play again|restart|new game/i });
    const restartLink = page.locator('a', { hasText: /play again|restart|new game/i });
    
    // Expected: A way to restart the game should exist
    // Actual: Only instruction to "Refresh to play again!"
    const hasPlayAgain = await playAgainButton.count() > 0 || await restartLink.count() > 0;
    
    expect(hasPlayAgain).toBe(true);
  });

  test('end game message mentions refresh instead of providing restart option', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Play to a win
    await ticTacToe.clickCell(0);
    await ticTacToe.clickCell(3);
    await ticTacToe.clickCell(1);
    await ticTacToe.clickCell(4);
    await ticTacToe.clickCell(2);

    await expect(ticTacToe.endGameOverlay).toBeVisible();

    const message = await ticTacToe.getEndGameMessage();
    
    // BUG: Message tells user to refresh - this is poor UX
    // Documenting the current buggy behavior
    expect(message.toLowerCase()).toContain('refresh');
  });

  test('Play button should allow starting new game after win without refresh', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Play to win
    await ticTacToe.clickCell(0);
    await ticTacToe.clickCell(3);
    await ticTacToe.clickCell(1);
    await ticTacToe.clickCell(4);
    await ticTacToe.clickCell(2);

    await expect(ticTacToe.endGameOverlay).toBeVisible();

    // Try to start a new game using the Play button
    await ticTacToe.startGame(3);

    // Expected: New clean game should start
    // Note: This test relates to Bug #6 as well (board not clearing)
    const isOverlayStillVisible = await ticTacToe.isEndGameOverlayVisible();
    
    // The overlay should be hidden after starting a new game
    expect(isOverlayStillVisible).toBe(false);
  });
});
