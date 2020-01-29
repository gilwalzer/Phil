import { CellIndex } from "./cell";
import { Direction } from "./direction";
import { KeyInput } from "./keyinput";
import { GridMetadata, Grid } from "./grid";

export class Focus
{
    direction: Direction; // "across" or "down"
    focusCellIndex: CellIndex;

    constructor(currentDirection: Direction, currentFocusCellIndex: CellIndex) 
    {
        this.direction = currentDirection;
        this.focusCellIndex = currentFocusCellIndex;
    }

    getFocusGivenFocusKeyInput(key: KeyInput, gridMetadata: GridMetadata): Focus
    {
        const isDirectionChange =
            key.isEnter()
            || ((key.isDown() || key.isUp()) && this.direction.isAcross())
            || ((key.isRight() || key.isLeft()) && this.direction.isDown());

        if (isDirectionChange)
        {
            return new Focus(this.direction.getOppositeDirection(), this.focusCellIndex);
        }
        else
        {
            const { rowIndex, columnIndex } = this.focusCellIndex; 
            var newRowIndex = rowIndex; 
            var newColumnIndex = columnIndex;

            if (key.isDown())
            {
                newRowIndex = Math.min(rowIndex + 1, gridMetadata.height - 1);
            }
            else if (key.isUp())
            {
                newRowIndex = Math.max(rowIndex - 1, 0);
            }
            else if (key.isRight())
            {
                newColumnIndex = Math.min(columnIndex + 1, gridMetadata.width - 1);
            }
            else if (key.isLeft())
            {
                newColumnIndex = Math.max(columnIndex - 1, 0);
            }

            const newCellIndex = new CellIndex(newRowIndex, newColumnIndex);
            return new Focus(this.direction, newCellIndex);
        }
    }

    getFocusGivenFillKeyInput(
        key: KeyInput, 
        cellIndex: CellIndex, 
        grid: Grid,
        shouldSkipBlackSquares: boolean)
    {
        let newCellIndex;
        if (key.isDelete() || key.isBlack())
        {
            newCellIndex = cellIndex;
        }
        else if (key.isBackspace()) 
        {
            newCellIndex = grid.getPreviousCellIndexGivenDirection(
                cellIndex, 
                this.direction, 
                shouldSkipBlackSquares)
        }
        else
        {
            newCellIndex = grid.getNextCellIndexGivenDirection(
                cellIndex, 
                this.direction, 
                shouldSkipBlackSquares);
        }
        return new Focus(this.direction, newCellIndex);
    }
}