import React, { Component, createRef, RefObject } from 'react';
import { Grid } from '../../classes/grid';
import { CellIndex, Cell } from '../../classes/cell';
import { UpdateFns } from './GridBody';
import { Focus } from '../../classes/focus';
import { KeyInput } from '../../classes/keyinput';

type GridCellProps = 
{
    cell: Cell;
    cellIndex: CellIndex;
    focus: Focus;
    grid: Grid;
    updateParentStateFns: UpdateFns;
}

type GridCellState = 
{
    fill: string;
    label: string;
    isFocused: boolean;
}

export class GridCell extends Component<GridCellProps, GridCellState> 
{
    private cellRef: RefObject<HTMLTableDataCellElement>;

    constructor(props: GridCellProps) 
    {
        super(props);
        this.state = { isFocused: props.cell.isFocused, fill: props.cell.fill, label: props.cell.label }
        this.cellRef = createRef<HTMLTableDataCellElement>()
    }

    componentDidUpdate()
    {
        const currentNode = this.cellRef.current;
        
        if (currentNode && this.props.cell.isFocused)
        {
            currentNode.focus();
        }
    }

    render()
    {
        const { cellIndex, cell } = this.props;
        const classList = buildClassesForCell(cell);
        const tabIndex = cell.isFocused ? 0 : undefined;
        return (
            <td 
                tabIndex={tabIndex}
                ref={this.cellRef} 
                className={classList.join(" ")} 
                data-col={cellIndex.columnIndex} 
                onClick={this.processOnClick} 
                onKeyDown={this.processOnKeyDown}
            >
                <div className="label">{cell.label}</div>
                <div className="fill">{cell.fill}</div>
            </td>
        )
    }

    processOnClick = (event: React.MouseEvent) => 
    {
        const { updateFocusFromMouseFn } = this.props.updateParentStateFns;
        updateFocusFromMouseFn(this.props.cellIndex);
    }

    processOnKeyDown = (event: React.KeyboardEvent) => {
        const { updateFillFn, updateFocusFromKeyFn } = this.props.updateParentStateFns
        const { keyCode } = event;
        
        var key = new KeyInput(keyCode); 
        if (key.isArrowKey() 
            || key.isEnter()) 
        {
            updateFocusFromKeyFn(this.props.cellIndex, key)
        }
        else if (key.isLowercaseLetter()
                 || key.isUppercaseLetter()
                 || key.isBlack()
                 || key.isSpace()
                 || key.isDelete()
                 || key.isBackspace())
        {
            updateFillFn(this.props.cellIndex, key);
        }
    }
}

function buildClassesForCell(cell: Cell): string[] 
{
    const classList = ["cell"];
    if (cell.isBlack())
    {
        classList.push("black");
    }
    else if (cell.isFocused) 
    {
        classList.push("active");
    }
    else if (cell.isInMainDirectionOfFocus)
    {
        classList.push("highlight");
    }
    else if (cell.isInSecondDirectionOfFocus)
    {
        classList.push("lowlight");
    }

    return classList;
}