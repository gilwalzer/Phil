import React from 'react';
import './App.css';
import { GridComponent } from './components/grid/GridComponent';
import { Grid } from './classes/grid';
import { Focus } from './classes/focus';
import { CellIndex, Cell } from './classes/cell';
import { Direction } from './classes/direction';
import { KeyInput, BLACK, EMPTY } from './classes/keyinput';

const initializeArrayOfArrayOfCells = (width: number, height: number ) =>
  Array.from(Array(width).keys())
    .map(_ => 
      Array.from(Array(height).keys()).map(_ => new Cell("", "")))


const defaultGridWidth = 15;
const defaultGridHeight = 15;
const defaultGridRows: Cell[][] = initializeArrayOfArrayOfCells(defaultGridWidth, defaultGridHeight);

const initialGrid = new Grid(defaultGridRows, defaultGridWidth, defaultGridHeight);
const initialFocus = new Focus(new Direction("across"), new CellIndex(0, 0));
const initialIsSymmetricalGrid = true;

type AppProps = {}

type AppState = 
{
  currentGrid: Grid;
  currentFocus: Focus;
  isSymmetricalGrid: boolean;
}

export class App extends React.Component<AppProps, AppState> 
{
  constructor(props: AppProps) 
  {
      super(props);
      this.state = { 
        currentGrid: initialGrid, 
        currentFocus: initialFocus,
        isSymmetricalGrid: initialIsSymmetricalGrid
      };
  }

  render() 
  {
    const updateFns = 
    {
      updateFocusFromMouseFn: this.updateGivenMouseInput,
      updateFocusFromKeyFn: this.updateGivenFocusKeyInput,
      updateFillFn: this.updateGivenFillKeyInput,
    }

    return (
        <div id="main">
          <link rel="stylesheet" type="text/css" href="style.css" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <GridComponent 
            gridData={this.state.currentGrid}
            focusData={this.state.currentFocus}
            updateFns={updateFns}
          />
        </div>
    );
  }
  
  updateGivenFillKeyInput = (cellIndex: CellIndex, keyInput: KeyInput): void => 
  {
    const { currentGrid, currentFocus, isSymmetricalGrid } = this.state;
    const { metadata: gridMetadata } = currentGrid;
    const newFill = keyInput.getFillValue();

    const oldCell = currentGrid.getCellAtIndex(cellIndex); 
    const isBlackSquare = newFill === BLACK;
    const isReplacingBlackSquare = oldCell.isBlack();

    var newGrid = currentGrid.getGridWithNewValue(
      isReplacingBlackSquare && isBlackSquare ? EMPTY : newFill,
      cellIndex); // set the new fill

    // do extra work if a black square is involved
    if (isBlackSquare || isReplacingBlackSquare)
    {
      // if a symmetrical grid, set the symmetric square
      if (isSymmetricalGrid)
      {
        newGrid = newGrid.getGridWithNewValue(
          isReplacingBlackSquare ? EMPTY : BLACK,
          cellIndex.getSymmetricIndex(gridMetadata));
      }
      // recompute the labels
      newGrid = newGrid.getGridWithNewLabels();
    }

    /*
    this behavior is debatable- if entering a letter into a blank square, move focus ahead to the next non-black square.
    otherwise, we are modifying black squares, so we should move focus ahead to the next square regardless.
    */
    const shouldSkipBlackSquares = !isBlackSquare && !isReplacingBlackSquare; 
    const newFocus = currentFocus.getFocusGivenFillKeyInput(
      keyInput,
      cellIndex,
      newGrid, 
      shouldSkipBlackSquares)

    this.finalizeState(newGrid, newFocus);
  }
  
  updateGivenMouseInput = (cellIndex: CellIndex) => 
  {
    const { currentGrid, currentFocus } = this.state;
    const newCell = currentGrid.getCellAtIndex(cellIndex);

    const isDirectionChange = newCell.isFocused;
    const direction = currentFocus.direction;
    const newFocus = isDirectionChange 
      ? new Focus(direction.getOppositeDirection(), cellIndex)
      : new Focus(direction, cellIndex);
    
    this.finalizeState(currentGrid, newFocus);
  }

  updateGivenFocusKeyInput = (cellIndex: CellIndex, key: KeyInput): void => 
  {
    const { currentGrid, currentFocus } = this.state;
    const newFocus = currentFocus.getFocusGivenFocusKeyInput(key, currentGrid.metadata);
    
    this.finalizeState(currentGrid, newFocus);
  }

  finalizeState = (grid: Grid, newFocus: Focus): void => 
  {
    const { currentFocus } = this.state;
    const shouldHighlight = !grid
      .getCellAtIndex(newFocus.focusCellIndex)
      .isBlack();    
    const finalGrid = grid.getGridWithNewFocus(currentFocus, newFocus, shouldHighlight);
    this.setState({ currentGrid: finalGrid, currentFocus: newFocus });
  }
}