import React from 'react';
import ReactDOM from 'react-dom';
import { GridBody } from './GridBody';
import { GridData } from '../classes/griddata';
import { UpdateFns } from '../classes/updatefns';
import { Focus } from '../classes/focus';

type GridProps = {
    initialGridData: GridData;
    focusData: Focus;
    updateFns: UpdateFns;
}
 
export class Grid extends React.Component<GridProps> {
    render() {
        const { initialGridData, updateFns, focusData } = this.props;
        return (
            <div tabIndex={1} id="grid">
                <table>
                    <GridBody 
                        gridData={initialGridData}
                        focusData={focusData}
                        updateFns={updateFns}
                    /> 
                </table>
            </div>
        )
    }
}