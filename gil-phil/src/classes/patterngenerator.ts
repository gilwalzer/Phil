import { Cell, CellIndex } from "./cell";
import { Grid, GridMetadata } from "./grid";
import { EMPTY, BLACK } from "./keyinput";

const inheritedPatterns = [
    [
      [0,4], [1,4], [2,4], [12,4], [13,4], [14,4],
      [4,0], [4,1], [4,2], [4,12], [4,13], [4,14],
      [8,3], [7,4], [6,5], [5,6], [4,7], [3,8]
    ],
    [
      [0,4], [1,4], [2,4], [12,4], [13,4], [14,4],
      [6,0], [10,0], [6,1], [10,1], [10,2], [8,4],
      [5,3], [9,3], [4,5], [11,5], [6,6], [7,7]
    ],
    [
      [0,5], [1,5], [2,5], [12,4], [13,4], [14,4],
      [5,0], [5,1], [5,2], [4,3], [3,13], [3,14],
      [5,6], [4,7], [4,8], [6,9], [7,10], [5,11]
    ]
];

export class PatternGenerator
{
    private gridMetadata: GridMetadata;

    constructor(gridMetadata: GridMetadata)
    {
        this.gridMetadata = gridMetadata;
    }

    generatePatternFromPrepopulatedList(): Grid | null  
    {
        const { height, width } = this.gridMetadata;
        if (height !== 15 && width !== 15)
        {
            alert("prepopulated list only applicable to standard (15x15) grids")
            return null;
        }

        const chosenPatternIndex = getRandomInt(0, 3);
        const blackIndices = inheritedPatterns[chosenPatternIndex];
        
        const grid = Grid.initialize(width, height);
        for (var coordinates of blackIndices)
        {
            const row = coordinates[0];
            const col = coordinates[1];

            const cell = new Cell(BLACK, EMPTY);
            grid.setCellAtIndex(new CellIndex(row, col), cell);
            grid.setCellAtIndex(new CellIndex(height - row - 1, width - col - 1), cell);
        }

        return grid.getGridWithNewLabels();
    }
}

const getRandomInt = (min: number, maxExclusive: number) => 
{
    return Math.floor(Math.random() * (maxExclusive - min) + min);
}