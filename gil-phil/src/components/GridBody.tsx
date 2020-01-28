import React from 'react';
import ReactDOM from 'react-dom';
import { GridRow } from './GridRow';
import { GridData } from '../classes/griddata';
import { Cell } from '../classes/cell';
import { UpdateFns } from '../classes/updatefns';
import { Focus } from '../classes/focus';

type GridBodyProps = {
    gridData: GridData;
    focusData: Focus;
    updateFns: UpdateFns;
}

export class GridBody extends React.Component<GridBodyProps> {
    render() {
        const { gridData, updateFns, focusData } = this.props;

        const renderedRows = [];
        for (var rowIndex: number = 0; rowIndex < gridData.metadata.height; rowIndex++) {
            renderedRows.push(
                <GridRow 
                    row={gridData.rows[rowIndex]} 
                    rowIndex={rowIndex} 
                    gridData={gridData}
                    focusData={focusData}
                    updateFns={updateFns}
                />
            )
        }
        return (
            <tbody>
                {renderedRows}
            </tbody>
        )
    }
}