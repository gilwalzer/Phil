import React from 'react';
import { Grid } from '../../classes/grid';
import { Focus } from '../../classes/focus';
import { GridRow } from './GridRow';

export type UpdateFns = 
{
    updateFillFn: Function;
    updateFocusFromMouseFn: Function;
    updateFocusFromKeyFn: Function;
}

type GridProps = 
{
    gridData: Grid;
    focusData: Focus;
    updateFns: UpdateFns;
}
 
export class GridBody extends React.Component<GridProps> 
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
            <div id="main">
                <table id="grid">
                    <tbody>
                        {renderedRows}
                    </tbody>
                </table>
            </div>
        )
    }
}