import React from 'react';
import './App.css';
import { Grid } from './components/Grid';
import { GridData } from './classes/griddata';
import { FocusData } from './classes/focusdata';
import { CellIndex, Cell } from './classes/cell';

const initializeArrayOfArrayOfCells = (width: number, height: number ) =>
  Array.from(Array(width).keys())
    .map(_ => 
      Array.from(Array(height).keys()).map(_ => new Cell("", "")))


const defaultGridWidth = 15;
const defaultGridHeight = 15;
const defaultGridRows: Cell[][] = initializeArrayOfArrayOfCells(defaultGridWidth, defaultGridHeight);

const initialGridData = new GridData(defaultGridRows, defaultGridWidth, defaultGridHeight);
const initialFocusData = new FocusData("across", new CellIndex(0, 0));

type AppProps = {}

type AppState = {
  currentGridData: GridData;
  currentFocusData: FocusData
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
      super(props);
      this.state = { currentGridData: initialGridData, currentFocusData: initialFocusData };
  }

  render() {
    const updateFns = {
      updateFocusFn: this.updateFocusFn,
      updateFillFn: this.updateFillFn,
      updateLabelFn: this.updateLabelFn
    }

    return (
      <div>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <Grid 
          initialGridData={this.state.currentGridData}
          focusData={this.state.currentFocusData}
          updateFns={updateFns}
        />
      </div>
    );
  }
  
  updateFillFn = (newFill: string, cellIndex: CellIndex) => {
    const { currentGridData } = this.state;
    const newGridData = currentGridData.getGridWithNewValue(newFill, cellIndex);
    this.setState({ currentGridData: newGridData });
  }

  updateLabelFn = (newLabel: string, cellIndex: CellIndex) => {
    const { currentGridData } = this.state;
    const newGridData = currentGridData.getGridWithNewLabel(newLabel, cellIndex);
    this.setState({ currentGridData: newGridData });
  }

  updateFocusFn = (cellIndex: CellIndex) => {
    const { currentGridData, currentFocusData } = this.state;
    const currentFocusCellIndex = currentFocusData.currentFocusCellIndex;

    const newCell = currentGridData.getCellAtIndex(cellIndex);
    if (!newCell.isFocused) {
      const newGridData = currentGridData.getGridWithNewFocus(currentFocusCellIndex, cellIndex);
      const newFocusData = new FocusData(currentFocusData.currentDirection, cellIndex);
      this.setState({ currentGridData: newGridData, currentFocusData: newFocusData });
    }
  }
}