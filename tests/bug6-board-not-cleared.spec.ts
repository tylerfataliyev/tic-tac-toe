import { test, expect } from '@playwright/test';
import { TicTacToePage } from '../pages/TicTacToePage';

test.describe('Bug #6: New Game Does Not Clear Previous Board', () => {
  /**
   * Acceptance Criteria: Given a game is in progress or completed, when the user enters a new board size and clicks Play,
   * then the previous board and any overlays should be cleared before the new board is rendered.
   */

  test('should clear previous board when starting new game', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    
    // Start first game with 3x3 board
    await ticTacToe.startGame(3);
    
    let cellCount = await ticTacToe.getCellCount();
    expect(cellCount).toBe(9);

    // Make some moves
    await ticTacToe.clickCell(0);
    await ticTacToe.clickCell(1);

    // Start new game with 4x4 board
    await ticTacToe.startGame(4);

    // BUG: Check if board was properly cleared
    cellCount = await ticTacToe.getCellCount();
    
    // Expected: Should have exactly 16 cells (4x4)
    // Actual: May have 25 cells (9 + 16) due to appending instead of clearing
    expect(cellCount).toBe(16);
  });

  test('should clear end game overlay when starting new game', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Play to win
    await ticTacToe.clickCell(0);
    await ticTacToe.clickCell(3);
    await ticTacToe.clickCell(1);
    await ticTacToe.clickCell(4);
    await ticTacToe.clickCell(2);

    // Verify overlay is showing
    await expect(ticTacToe.endGameOverlay).toBeVisible();

    // Start new game
    await ticTacToe.startGame(3);

    // BUG: Overlay should be hidden
    const isOverlayVisible = await ticTacToe.isEndGameOverlayVisible();
    expect(isOverlayVisible).toBe(false);
  });

  test('should have empty cells when starting new game after completed game', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // Fill some cells
    await ticTacToe.clickCell(0);  // X
    await ticTacToe.clickCell(1);  // O
    await ticTacToe.clickCell(2);  // X

    // Start new game
    await ticTacToe.startGame(3);

    // All cells should be empty
    const emptyCells = await ticTacToe.getEmptyCells();
    const cellCount = await ticTacToe.getCellCount();

    // BUG: All cells should be empty in new game
    expect(emptyCells.length).toBe(cellCount);
  });

  test('should properly reset when changing board sizes multiple times', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();

    // Start 3x3, then 4x4, then 3x3 again
    await ticTacToe.startGame(3);
    expect(await ticTacToe.getCellCount()).toBe(9);

    await ticTacToe.startGame(4);
    expect(await ticTacToe.getCellCount()).toBe(16);

    await ticTacToe.startGame(3);
    expect(await ticTacToe.getCellCount()).toBe(9);

    // Table should have correct number of rows
    const rowCount = await ticTacToe.getTableRowCount();
    expect(rowCount).toBe(3);
  });

  test('should not have overlapping boards visible', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);
    await ticTacToe.startGame(4);

    // Count table rows - should only be 4 (for 4x4 board)
    const rowCount = await ticTacToe.getTableRowCount();
    
    // BUG: May have 7 rows (3 from first game + 4 from second)
    expect(rowCount).toBe(4);
  });
});
