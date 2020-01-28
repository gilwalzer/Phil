export class Cell {
    fill: string;
    label: string;
    isFocused: boolean;

    constructor(fill: string, label: string) {
        this.fill = fill;
        this.label = label;
        this.isFocused = false;
    }

    isBlack() {
        return this.fill == "."; 
    }
}

export class CellIndex {
    rowIndex: number;
    columnIndex: number;
    
    constructor(rowIndex: number, columnIndex: number) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    toKey(height: number) {
        return this.rowIndex * height + this.columnIndex;
    }
}