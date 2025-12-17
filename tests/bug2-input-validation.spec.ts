import { test, expect } from '@playwright/test';
import { TicTacToePage } from '../pages/TicTacToePage';

test.describe('Bug #2: No Input Validation for Board Size', () => {
  /**
   * Acceptance Criteria: Given the user enters an invalid value (empty, non-numeric, zero, negative, or decimal),
   * when they click Play, then an error message should display and no board should be generated.
   */

  test('should show error message when input is empty', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.playButton.click();

    // BUG: App should show an error message for empty input
    const errorMessage = page.locator('.error, .error-message, [role="alert"], .validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should show error message when input is non-numeric text', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame('abc');

    // BUG: App should show an error message for non-numeric input
    const errorMessage = page.locator('.error, .error-message, [role="alert"], .validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should show error message when input is zero', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(0);

    // BUG: App should show an error message for zero
    const errorMessage = page.locator('.error, .error-message, [role="alert"], .validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should show error message when input is negative number', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(-5);

    // BUG: App should show an error message for negative numbers
    const errorMessage = page.locator('.error, .error-message, [role="alert"], .validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should show error message when input is decimal number', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(2.5);

    // BUG: App should show an error message for decimal numbers
    const errorMessage = page.locator('.error, .error-message, [role="alert"], .validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should accept valid positive integer and generate correct board', async ({ page }) => {
    const ticTacToe = new TicTacToePage(page);
    
    await ticTacToe.navigate();
    await ticTacToe.startGame(3);

    // This should work - valid input
    const isBoardGenerated = await ticTacToe.isBoardGenerated();
    expect(isBoardGenerated).toBe(true);
    
    const cellCount = await ticTacToe.getCellCount();
    expect(cellCount).toBe(9); // 3x3 = 9 cells
  });
});
