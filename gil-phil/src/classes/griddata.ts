import { CellIndex, Cell } from "./cell";

export class GridData {
    rows: Cell[][];
    metadata: GridMetadata;

    constructor(rows: Cell[][], width: number, height: number) {
        this.rows = [];
        for (var rowIndex = 0; rowIndex < height; rowIndex++) {
            var row = [];
            for (var colIndex = 0; colIndex < width; colIndex++) {
                row.push(rows[rowIndex][colIndex]);
            }
            this.rows.push(row);
        }
        this.metadata = new GridMetadata(width, height);
    }

    getGridWithNewValue(newFill: string, cellIndex: CellIndex): GridData 
    {
        var newGrid = new GridData(
          this.rows, 
          this.metadata.width,
          this.metadata.height);
        var oldCell = this.rows[cellIndex.rowIndex][cellIndex.columnIndex];
        newGrid.rows[cellIndex.rowIndex][cellIndex.columnIndex] = new Cell(newFill, oldCell.label);
        return newGrid;
    }

    
    getGridWithNewLabel(newLabel: string, cellIndex: CellIndex): GridData 
    {
        var newGrid = new GridData(
          this.rows, 
          this.metadata.width,
          this.metadata.height);
        var oldCell = this.rows[cellIndex.rowIndex][cellIndex.columnIndex];
        newGrid.rows[cellIndex.rowIndex][cellIndex.columnIndex] = new Cell(oldCell.fill, newLabel);
        return newGrid;
    }

    getGridWithNewFocus(currentFocusCellIndex: CellIndex, newFocusCellIndex: CellIndex): GridData 
    {
        var newGrid = new GridData(
          this.rows, 
          this.metadata.width,
          this.metadata.height);

        var currentFocusCell = this.getCellAtIndex(currentFocusCellIndex);
        currentFocusCell.isFocused = false;
        newGrid.rows[currentFocusCellIndex.rowIndex][currentFocusCellIndex.columnIndex] = currentFocusCell;
        
        var newCell = this.rows[newFocusCellIndex.rowIndex][newFocusCellIndex.columnIndex];
        newCell.isFocused = true;
        newGrid.rows[newFocusCellIndex.rowIndex][newFocusCellIndex.columnIndex] = newCell;

        return newGrid;
    }

    getCellAtIndex(cellIndex: CellIndex): Cell 
    {
        return this.rows[cellIndex.rowIndex][cellIndex.columnIndex];
    }
}

export class GridMetadata {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}