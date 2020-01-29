import { CellIndex, Cell } from "./cell";
import { Focus } from "./focus";
import { Direction } from "./direction";
import { EMPTY } from "./keyinput";

export class Grid 
{
    rows: Cell[][];
    metadata: GridMetadata;

    constructor(rows: Cell[][], width: number, height: number)
    {
        this.rows = [];
        for (var rowIndex = 0; rowIndex < height; rowIndex++) 
        {
            var row = [];
            for (var colIndex = 0; colIndex < width; colIndex++) 
            {
                row.push(rows[rowIndex][colIndex]);
            }
            this.rows.push(row);
        }
        this.metadata = new GridMetadata(width, height);
    }

    getGridWithNewValue(newFill: string, cellIndex: CellIndex): Grid 
    {
        var newGrid = new Grid(
          this.rows, 
          this.metadata.width,
          this.metadata.height);
        const oldCell = this.rows[cellIndex.rowIndex][cellIndex.columnIndex];
        var newCell = new Cell(newFill, oldCell.label);
        newCell.isFocused = oldCell.isFocused;
        newGrid.rows[cellIndex.rowIndex][cellIndex.columnIndex] = newCell;
        return newGrid;
    }
    
    getGridWithNewLabels(): Grid 
    {
        var newGrid = new Grid(
          this.rows, 
          this.metadata.width,
          this.metadata.height);

        var currentLabel = 1;
        for (var row = 0; row < this.metadata.height; row++)
        {
            for (var col = 0; col < this.metadata.width; col++)
            {
                var currentCell = newGrid.rows[row][col];
                const isStartOfAcross = 
                    !currentCell.isBlack()
                    && (col === 0 || newGrid.rows[row][col - 1].isBlack());
                const isStartOfDown =
                    !currentCell.isBlack()
                    && (row === 0 || newGrid.rows[row - 1][col].isBlack());
                
                if (isStartOfAcross || isStartOfDown) {
                    currentCell.label = currentLabel.toString();
                    newGrid.rows[row][col] = currentCell;
                    currentLabel++;
                }
                else 
                {
                    currentCell.label = EMPTY;
                }
            }
        }
        return newGrid;
    }

    getGridWithNewFocus(currentFocus: Focus, newFocus: Focus, shouldHighlight: boolean): Grid 
    {
        const currentFocusCellIndex = currentFocus.focusCellIndex;
        var newGrid = new Grid(
          this.rows, 
          this.metadata.width,
          this.metadata.height);

        // reset focus and focus directions
        var currentFocusCell = this.getCellAtIndex(currentFocusCellIndex);
        currentFocusCell.isFocused = false;
        newGrid.setCellAtIndex(currentFocusCellIndex, currentFocusCell);
        
        newGrid.resetHighlighting(currentFocusCellIndex);
        
        // set new focus and focus directions
        const newFocusCellIndex = newFocus.focusCellIndex;
        var newCell = newGrid.getCellAtIndex(newFocusCellIndex);
        newCell.isFocused = true;

        if (shouldHighlight) {
            this.setHighlightUpwards(newFocus);
            this.setHighlightDownwards(newFocus);
            this.setHighlightLeftwards(newFocus);
            this.setHighlightRightwards(newFocus);
        }

        return newGrid;
    }

    getNextCellIndexGivenDirection(
        cellIndex: CellIndex, 
        direction: Direction,
        shouldSkipBlackSquares: boolean): CellIndex 
    {
        if (direction.isAcross())
        {
            // return the next square in the row that isn't black
            for (var col = cellIndex.columnIndex + 1; col < this.metadata.width; col++)
            {
                const index = new CellIndex(cellIndex.rowIndex, col);
                const cell = this.getCellAtIndex(index);
                if (!(shouldSkipBlackSquares && cell.isBlack())) 
                {
                    return index;
                }
            }

            return cellIndex;
        }
        else 
        {
            // return the next square in the column that isn't black
            for (var row = cellIndex.rowIndex + 1; row < this.metadata.height; row++)
            {
                const index = new CellIndex(row, cellIndex.columnIndex);
                const cell = this.getCellAtIndex(index);
                if (!(shouldSkipBlackSquares && cell.isBlack())) 
                {
                    return index;
                }
            }

            return cellIndex;
        }
    }

    getPreviousCellIndexGivenDirection(
        cellIndex: CellIndex, 
        direction: Direction,
        shouldSkipBlackSquares: boolean): CellIndex 
    {
        if (direction.isAcross())
        {
            // return the next square in the row that isn't black
            for (var col = cellIndex.columnIndex - 1; col >= 0; col--)
            {
                const index = new CellIndex(cellIndex.rowIndex, col);
                const cell = this.getCellAtIndex(index);
                if (!(shouldSkipBlackSquares && cell.isBlack())) 
                {
                    return index;
                }
            }

            return cellIndex;
        }
        else 
        {
            // return the next square in the column that isn't black
            for (var row = cellIndex.rowIndex - 1; row >= 0; row--)
            {
                const index = new CellIndex(row, cellIndex.columnIndex);
                const cell = this.getCellAtIndex(index);
                if (!(shouldSkipBlackSquares && cell.isBlack())) 
                {
                    return index;
                }
            }

            return cellIndex;
        }
    }

    getCellAtIndex(cellIndex: CellIndex): Cell 
    {
        return this.rows[cellIndex.rowIndex][cellIndex.columnIndex];
    }

    setCellAtIndex(cellIndex: CellIndex, cell: Cell): void 
    {
        this.rows[cellIndex.rowIndex][cellIndex.columnIndex] = cell;
    }

    resetHighlighting(cellIndex: CellIndex)
    {
        const { rowIndex, columnIndex } = cellIndex;
        let currentCell;
        for (var row = 0; row < this.metadata.height; row++) 
        {
            currentCell = this.getCellAtIndex(new CellIndex(row, columnIndex));
            currentCell.isFocused = false;
            currentCell.isInSecondDirectionOfFocus = false; 
            currentCell.isInMainDirectionOfFocus = false;
        }

        for (var col = 0; col < this.metadata.width; col++) 
        {
            currentCell = this.getCellAtIndex(new CellIndex(rowIndex, col));
            currentCell.isFocused = false;
            currentCell.isInSecondDirectionOfFocus = false; 
            currentCell.isInMainDirectionOfFocus = false;
        }
    }

    setHighlightUpwards(focus: Focus) 
    {
        const { focusCellIndex, direction } = focus
        const { rowIndex, columnIndex } = focusCellIndex;

        for (var row = rowIndex - 1; row >= 0; row--) 
        {
            var cellIndex = new CellIndex(row, columnIndex);
            var currentCell = this.getCellAtIndex(cellIndex);
            if (currentCell.isBlack()) 
            {
                break;
            }
            else if (direction.isAcross())
            {
                currentCell.isInSecondDirectionOfFocus = true; 
            }
            else if (direction.isDown())
            {
                currentCell.isInMainDirectionOfFocus = true;
            }

            this.setCellAtIndex(cellIndex, currentCell);
        }
    }
    
    setHighlightDownwards(focus: Focus)
    {
        const { focusCellIndex, direction } = focus
        const { rowIndex, columnIndex } = focusCellIndex;
        
        for (var row = rowIndex + 1; row < this.metadata.height; row++) 
        {
            var cellIndex = new CellIndex(row, columnIndex);
            var currentCell = this.getCellAtIndex(cellIndex);
            if (currentCell.isBlack()) 
            {
                break;
            }
            else if (direction.isAcross())
            {
                currentCell.isInSecondDirectionOfFocus = true; 
            }
            else if (direction.isDown())
            {
                currentCell.isInMainDirectionOfFocus = true;
            }
        }
    }

    setHighlightLeftwards(focus: Focus) 
    {
        const { focusCellIndex, direction } = focus
        const { rowIndex, columnIndex } = focusCellIndex;

        for (var col = columnIndex - 1; col >= 0; col--) 
        {
            var cellIndex = new CellIndex(rowIndex, col);
            var currentCell = this.getCellAtIndex(cellIndex);
            if (currentCell.isBlack()) 
            {
                break;
            }
            else if (direction.isAcross())
            {
                currentCell.isInMainDirectionOfFocus = true; 
            }
            else if (direction.isDown())
            {
                currentCell.isInSecondDirectionOfFocus = true;
            }
        }
    }

    setHighlightRightwards(focus: Focus) 
    {
        const { focusCellIndex, direction } = focus
        const { rowIndex, columnIndex } = focusCellIndex;

        for (var col = columnIndex + 1; col < this.metadata.width; col++) 
        {
            var cellIndex = new CellIndex(rowIndex, col);
            var currentCell = this.getCellAtIndex(cellIndex);
            if (currentCell.isBlack()) 
            {
                break;
            }
            else if (direction.isAcross())
            {
                currentCell.isInMainDirectionOfFocus = true; 
            }
            else if (direction.isDown())
            {
                currentCell.isInSecondDirectionOfFocus = true;
            }
            this.setCellAtIndex(cellIndex, currentCell);
        }
    }
}

export class GridMetadata {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    firstKey = () => 0;
    lastKey = () => (this.width * this.height) - 1;
}