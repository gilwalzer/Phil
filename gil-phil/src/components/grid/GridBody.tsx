import React from 'react';
import { GridRow } from './GridRow';
import { Grid } from '../../classes/grid';
import { UpdateFns } from '../../classes/updatefns';
import { Focus } from '../../classes/focus';

type GridBodyProps = 
{
    gridData: Grid;
    focusData: Focus;
    updateFns: UpdateFns;
}

export class GridBody extends React.Component<GridBodyProps> 
{
    render() 
    {
        const { gridData, updateFns, focusData } = this.props;

        const renderedRows = [];
        for (var rowIndex: number = 0; rowIndex < gridData.metadata.height; rowIndex++)
        {
            renderedRows.push(
                <GridRow 
                    row={gridData.rows[rowIndex]} 
                    rowIndex={rowIndex} 
                    grid={gridData}
                    focus={focusData}
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