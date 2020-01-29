import React from 'react';
import { GridBody } from './GridBody';
import { Grid } from '../../classes/grid';
import { UpdateFns } from '../../classes/updatefns';
import { Focus } from '../../classes/focus';

type GridProps = 
{
    gridData: Grid;
    focusData: Focus;
    updateFns: UpdateFns;
}
 
export class GridComponent extends React.Component<GridProps> 
{
    render() 
    {
        const { gridData, updateFns, focusData } = this.props;
        return (
            <table id="grid">
                <GridBody 
                    gridData={gridData}
                    focusData={focusData}
                    updateFns={updateFns}
                /> 
            </table>
        )
    }
}