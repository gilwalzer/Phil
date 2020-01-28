import React from 'react';
import ReactDOM from 'react-dom';
import { GridData } from '../classes/griddata';
import { CellIndex, Cell } from '../classes/cell';
import { UpdateFns } from '../classes/updatefns';
import { FocusData } from '../classes/focusdata';

type GridCellProps = {
    cell: Cell;
    cellIndex: CellIndex;
    focusData: FocusData;
    gridData: GridData;
    updateParentStateFns: UpdateFns;
}

type GridCellState = {
    fill: string;
    label: string;
    isFocused: boolean;
}

export class GridCell extends React.Component<GridCellProps, GridCellState> {
    constructor(props: GridCellProps) {
        super(props);
        this.state = { isFocused: props.cell.isFocused, fill: props.cell.fill, label: props.cell.label }
    }

    render() {
        const { cellIndex, focusData } = this.props;
        const cell = this.props.cell;
        var classList = "cell";
        if (cell.isFocused) {
            classList = classList + " active"; 
        }

        return (
            <td className={classList} data-col={cellIndex.columnIndex} onClick={this.processOnClick} onKeyDown={this.processOnKeyDown}>
                <div className="label">{cell.label}</div>
                <div className="fill">{cell.fill}</div>
            </td>
        )
    }

    setFocus() {
        const { updateFocusFn } = this.props.updateParentStateFns;
        updateFocusFn(this.props.cellIndex);            
    }

    processOnClick = (event: React.MouseEvent) => {
        this.setFocus();
    }

    processOnKeyDown = (event: React.KeyboardEvent) => {
        const { updateFillFn } = this.props.updateParentStateFns
        updateFillFn(event.key);
    }
}