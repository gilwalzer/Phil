import React from 'react';
import { GridCell } from './GridCell';
import { GridData } from '../classes/griddata';
import { Cell, CellIndex } from '../classes/cell';
import { UpdateFns } from '../classes/updatefns';
import { FocusData } from '../classes/focusdata';

type GridRowProps = {
    row: Cell[];
    rowIndex: number;
    gridData: GridData;
    focusData: FocusData;
    updateFns: UpdateFns;
}

export class GridRow extends React.Component<GridRowProps> {
    render() {
        const { row, rowIndex, gridData, updateFns, focusData } = this.props;
        const renderedCells = []
        for (var columnIndex: number = 0; columnIndex < row.length; columnIndex++ ) {
            var cellIndex = new CellIndex(rowIndex, columnIndex);
            renderedCells.push(
                <GridCell 
                    cell={row[columnIndex]}
                    cellIndex={cellIndex}
                    gridData={gridData}
                    focusData={focusData}
                    updateParentStateFns={updateFns}
                    key={cellIndex.toKey(gridData.metadata.height)}
                />
            )
        }
        return <tr data-row={rowIndex}>{renderedCells}</tr>
    }
}