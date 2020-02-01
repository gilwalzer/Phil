import React from 'react';
import { GridCell } from './GridCell';
import { Grid } from '../../classes/grid';
import { Cell, CellIndex } from '../../classes/cell';
import { UpdateFns } from './GridBody';
import { Focus } from '../../classes/focus';

type GridRowProps = 
{
    row: Cell[];
    rowIndex: number;
    grid: Grid;
    focus: Focus;
    updateFns: UpdateFns;
}

export class GridRow extends React.Component<GridRowProps> 
{
    render() 
    {
        const { row, rowIndex, grid, updateFns, focus } = this.props;
        const renderedCells = []
        for (var columnIndex: number = 0; columnIndex < row.length; columnIndex++ ) 
        {
            var cellIndex = new CellIndex(rowIndex, columnIndex);
            renderedCells.push(
                <GridCell 
                    cell={row[columnIndex]}
                    cellIndex={cellIndex}
                    grid={grid}
                    focus={focus}
                    updateParentStateFns={updateFns}
                    key={cellIndex.toKey(grid.metadata.height)}
                />
            )
        }
        return <tr data-row={rowIndex}>{renderedCells}</tr>
    }
}