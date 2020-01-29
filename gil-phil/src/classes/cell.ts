import { GridMetadata } from "./grid";
import { BLACK } from "./keyinput";

export class Cell 
{
    fill: string;
    label: string;
    isFocused: boolean;
    isInMainDirectionOfFocus: boolean;
    isInSecondDirectionOfFocus: boolean; 

    constructor(fill: string, label: string) 
    {
        this.fill = fill;
        this.label = label;
        this.isFocused = false;
        this.isInMainDirectionOfFocus = false;
        this.isInSecondDirectionOfFocus = false;
    }

    isBlack() 
    {
        return this.fill === BLACK; 
    }
}

export class CellIndex 
{
    rowIndex: number;
    columnIndex: number;
    
    constructor(rowIndex: number, columnIndex: number) 
    {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    toKey(height: number) 
    {
        return this.rowIndex * height + this.columnIndex;
    }

    getSymmetricIndex(gridMetadata: GridMetadata): CellIndex
    {
        return new CellIndex(
            gridMetadata.height - this.rowIndex - 1,
            gridMetadata.width - this.columnIndex - 1);
    }

    static fromKey(key: number, gridMetadata: GridMetadata): CellIndex
    {
        return new CellIndex(key / gridMetadata.height, key % gridMetadata.width);
    }
}