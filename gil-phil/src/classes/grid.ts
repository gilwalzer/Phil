import { CellIndex, Cell } from "./cell";
import { Focus } from "./focus";
import { Direction } from "./direction";
import { EMPTY } from "./keyinput";

export class Grid 
{
    rows: Cell[][];
    metadata: GridMetadata;

    constructor(rows: Cell[][],  metadata: GridMetadata)
    {
        this.rows = [];
        this.metadata = metadata;
        for (var rowIndex = 0; rowIndex < metadata.height; rowIndex++) 
        {
            var row = [];
            for (var colIndex = 0; colIndex < metadata.width; colIndex++) 
            {
                row.push(rows[rowIndex][colIndex]);
            }
            this.rows.push(row);
        }
    }

    static initialize(width: number, height: number): Grid
    {
        const cells = initializeArrayOfArrayOfCells(width, height);
        return new Grid(cells, new GridMetadata(width, height));
    }

    clone: () => Grid = () => new Grid(this.rows, this.metadata);

    getGridWithNewValue(newFill: string, cellIndex: CellIndex): Grid 
    {
        var newGrid = this.clone();
        const oldCell = this.rows[cellIndex.rowIndex][cellIndex.columnIndex];
        var newCell = new Cell(newFill, oldCell.label);
        newCell.isFocused = oldCell.isFocused;
        newGrid.rows[cellIndex.rowIndex][cellIndex.columnIndex] = newCell;
        return newGrid;
    }
    
    getGridWithNewLabels(): Grid 
    {
        var newGrid = this.clone();

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
        var newGrid = this.clone();

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

    getFirstCellIndexInWordGivenDirection(cellIndex: CellIndex, direction: Direction): CellIndex
    {
        let nextCellIndex;

        // walk left or up until the adjacent cell is black or off the grid
        while (true)
        {
            if ((direction.isAcross() && cellIndex.columnIndex === 0)
                || (direction.isDown() && cellIndex.rowIndex === 0))
            {
                return cellIndex;
            }

            nextCellIndex = this.getPreviousCellIndexGivenDirection(
                cellIndex,
                direction,
                false);
            
            if (this.getCellAtIndex(nextCellIndex).isBlack())
            {
                return cellIndex;
            }
            cellIndex = nextCellIndex;
        }
    }

    getPreviousCellIndexGivenDirection(
        cellIndex: CellIndex, 
        direction: Direction,
        shouldSkipBlackSquares: boolean): CellIndex 
    {
        if (direction.isAcross())
        {
            // return the next-left square in the row that isn't black
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
            // return the next-up square in the column that isn't black
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

const initializeArrayOfArrayOfCells = (width: number, height: number ) =>
Array.from(Array(width).keys())
  .map(_ => 
    Array.from(Array(height).keys()).map(_ => Cell.Empty()))


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