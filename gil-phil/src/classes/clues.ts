import { DirectionType, Direction } from './direction'; 
import { CellIndex, Cell } from './cell';
import { Grid } from './grid';

export class ClueReference
{
    firstCellIndex: CellIndex;
    clueDirection: DirectionType;

    constructor(firstCellIndex: CellIndex, clueDirection: DirectionType)
    {
        this.firstCellIndex = firstCellIndex;
        this.clueDirection = clueDirection;
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

    setLabel(label: string): void
    {
        this.label = label;
    }

    setClueText(clueText: string)
    {
        this.clueText = clueText;
    }

    isLabeled = () => this.label !== null
    isClued = () => this.clueText !== null
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
        // TODO
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
        const clueLabel = firstCell.label + "" + Direction.getTypeAsLetter(direction) + ".";
        const newClue = Clue.initialize(clueReference, clueLabel);

        cluesByReferenceKey.set(clueKey, newClue);
        return newClue;
    }
}

export type SuggestedAnswersPair = 
{
    acrossAnswers: string[];
    downAnswers: string[];
}