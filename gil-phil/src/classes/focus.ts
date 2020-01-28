import { CellIndex } from "./cell";
import { Direction } from "./direction";

export class Focus {
    currentDirection: Direction; // "across" or "down"
    currentFocusCellIndex: CellIndex;

    constructor(currentDirection: Direction, currentFocusCellIndex: CellIndex) 
    {
        this.currentDirection = currentDirection;
        this.currentFocusCellIndex = currentFocusCellIndex;
    }

    getNewFocus(newDirection: Direction, newCellIndex: CellIndex): Focus 
    {
        return new Focus(newDirection, newCellIndex); 
    }
}