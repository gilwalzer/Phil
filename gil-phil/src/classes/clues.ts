import { DirectionType, Direction } from './direction'; 
import { CellIndex, Cell } from './cell';
import { Grid } from './grid';

export class ClueReference
{
    firstCellIndex: CellIndex;
    clueDirection: DirectionType;
    isEmptyRef: boolean;
    
    constructor(firstCellIndex: CellIndex, clueDirection: DirectionType)
    {
        this.firstCellIndex = firstCellIndex;
        this.clueDirection = clueDirection;
        this.isEmptyRef = false;
    }

    static getEmptyRef()
    {
        const clueRef = new ClueReference(new CellIndex(-1, -1), DirectionType.ACROSS)
        clueRef.isEmptyRef = true;
        return clueRef;
    }

    asUniqueKey()
    {
        const { rowIndex, columnIndex } = this.firstCellIndex;
        const cellIndexString = "row:" + rowIndex + ",col:" + columnIndex;
        const directionString = "dir:" + Direction.getTypeAsLetter(this.clueDirection);
        return cellIndexString + "," + directionString;
    }
}

export class Clue
{
    static defaultClueText = "(blank clue)";

    clueReference: ClueReference;
    label: string;
    clueText: string;
    
    constructor(
        clueReference: ClueReference, 
        label: string, 
        clueText: string)
    {
        this.clueReference = clueReference;
        this.label = label;
        this.clueText = clueText;
    }

    static initialize(clueReference: ClueReference, label: string): Clue
    {
        return new Clue(clueReference, label, Clue.defaultClueText);
    }

    static getEmptyClue()
    {
        const fakeRef = ClueReference.getEmptyRef(); 
        return new Clue(fakeRef, "", "")
    }

    isEmptyClue(): boolean
    {
        return this.clueReference.isEmptyRef;        
    }

    setLabel(label: string): void
    {
        this.label = label;
    }

    setClueText(clueText: string)
    {
        this.clueText = clueText;
    }
}

export type CluePair =
{
    acrossClue: Clue;
    downClue: Clue;
}

export class Clues
{
    private cluesByReferenceKey: Map<string, Clue>;

    constructor()
    {
        this.cluesByReferenceKey = new Map<string, Clue>();
    }

    reassignLabelsToClues = (grid: Grid) => 
    {
        for (var key of this.cluesByReferenceKey.keys())
        {
            const row = parseInt(key.split(",")[0].split(":")[1])
            const col = parseInt(key.split(",")[1].split(":")[1])
            const cellIndex = new CellIndex(row, col);
            const newCell = grid.getCellAtIndex(cellIndex);
            if (newCell.isBlack())
            {
                this.cluesByReferenceKey.delete(key);
            }
            else
            {
                const clue = this.cluesByReferenceKey.get(key);
                if (clue !== undefined)
                {
                    clue.setLabel(buildLabel(newCell.label, clue.clueReference.clueDirection));
                }
                console.log(clue, this.cluesByReferenceKey.get(key))
            }
        }
        return this;
    }

    setClue = (clue: Clue, newText: string) => 
    {
        clue.clueText = newText; 
        this.cluesByReferenceKey.set(clue.clueReference.asUniqueKey(), clue)
    }

    getOrInitializeClue = (
        firstCellIndex: CellIndex,
        firstCell: Cell,
        direction: DirectionType): Clue => 
    {
        const clueReference = new ClueReference(firstCellIndex, direction);
        
        const cluesByReferenceKey = this.cluesByReferenceKey;
        const clueKey = clueReference.asUniqueKey();
        if (cluesByReferenceKey.has(clueKey))
        {
            const clue = cluesByReferenceKey.get(clueKey);
            if (clue !== undefined)
            { 
                return clue;
            }
        }
        const clueLabel = buildLabel(firstCell.label, direction);
        const newClue = Clue.initialize(clueReference, clueLabel);

        cluesByReferenceKey.set(clueKey, newClue);
        return newClue;
    }
}

function buildLabel(label: string, direction: DirectionType)
{
    return label + "" + Direction.getTypeAsLetter(direction) + ".";
}

export type SuggestedAnswersPair = 
{
    acrossAnswers: string[];
    downAnswers: string[];
}