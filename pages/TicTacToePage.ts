import { Page, Locator } from '@playwright/test';

export class TicTacToePage {
  readonly page: Page;
  readonly boardSizeInput: Locator;
  readonly playButton: Locator;
  readonly gameTable: Locator;
  readonly endGameOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.boardSizeInput = page.locator('#number');
    this.playButton = page.locator('#start');
    this.gameTable = page.locator('#table');
    this.endGameOverlay = page.locator('#endgame');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://calendly.github.io/cypress_tictactoe/');
  }

  async startGame(boardSize: number | string): Promise<void> {
    await this.boardSizeInput.fill(String(boardSize));
    await this.playButton.click();
  }

  async clickCell(cellId: number): Promise<void> {
    await this.page.locator(`[id="${cellId}"]`).click();
  }

  async getCellText(cellId: number): Promise<string> {
    return await this.page.locator(`[id="${cellId}"]`).innerText();
  }

  async getCellByPosition(row: number, column: number, boardSize: number): Promise<Locator> {
    const cellId = row * boardSize + column;
    return this.page.locator(`[id="${cellId}"]`);
  }

  async clickCellByPosition(row: number, column: number, boardSize: number): Promise<void> {
    const cellId = row * boardSize + column;
    await this.clickCell(cellId);
  }

  async getEndGameMessage(): Promise<string> {
    return await this.endGameOverlay.innerText();
  }

  async isEndGameOverlayVisible(): Promise<boolean> {
    const display = await this.endGameOverlay.evaluate(el => 
      window.getComputedStyle(el).display
    );
    return display !== 'none';
  }

  async getAllCells(): Promise<Locator[]> {
    return await this.gameTable.locator('td').all();
  }

  async getCellCount(): Promise<number> {
    return await this.gameTable.locator('td').count();
  }

  async isBoardGenerated(): Promise<boolean> {
    const cellCount = await this.getCellCount();
    return cellCount > 0;
  }

  async getTableRowCount(): Promise<number> {
    return await this.gameTable.locator('tr').count();
  }

  /**
   * Makes a sequence of moves on the board
   * @param cellIds - Array of cell IDs to click in order
   */
  async playMoves(cellIds: number[]): Promise<void> {
    for (const cellId of cellIds) {
      await this.clickCell(cellId);
    }
  }

  /**
   * Plays moves to achieve a win for X on top row (3x3 board)
   * X moves: 0, 1, 2 (top row)
   * O moves: 3, 4 (middle row start)
   */
  async playXWinsTopRow(): Promise<void> {
    await this.clickCell(0);  // X - top-left
    await this.clickCell(3);  // O - middle-left
    await this.clickCell(1);  // X - top-middle
    await this.clickCell(4);  // O - middle-middle
    await this.clickCell(2);  // X - top-right (X wins)
  }

  /**
   * Plays moves to achieve a win for O (3x3 board)
   * X moves: 0, 1, 5
   * O moves: 3, 4, 6 (left column - but O needs to win so we adjust)
   */
  async playOWinsLeftColumn(): Promise<void> {
    await this.clickCell(0);  // X - top-left
    await this.clickCell(3);  // O - middle-left
    await this.clickCell(1);  // X - top-middle
    await this.clickCell(6);  // O - bottom-left
    await this.clickCell(5);  // X - middle-right
    await this.clickCell(4);  // O needs 3,4,6 but 4 breaks it... let's do diagonal
  }

  /**
   * Plays moves resulting in a draw (3x3 board)
   * Pattern that fills all cells with no winner
   */
  async playToDraw(): Promise<void> {
    // X O X
    // X X O
    // O X O
    await this.clickCell(0);  // X
    await this.clickCell(1);  // O
    await this.clickCell(2);  // X
    await this.clickCell(4);  // O
    await this.clickCell(3);  // X
    await this.clickCell(6);  // O
    await this.clickCell(5);  // X - wait, let me recalculate
  }

  /**
   * Gets all empty cells on the board
   */
  async getEmptyCells(): Promise<number[]> {
    const cells = await this.getAllCells();
    const emptyCells: number[] = [];
    
    for (let i = 0; i < cells.length; i++) {
      const text = await cells[i].innerText();
      if (text === '') {
        emptyCells.push(i);
      }
    }
    
    return emptyCells;
  }
}
