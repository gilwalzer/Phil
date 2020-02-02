import React from 'react';
import './App.css';
import { GridBody } from './components/grid/GridBody';
import { Header } from './components/header/Header';
import { Grid } from './classes/grid';
import { Focus } from './classes/focus';
import { CellIndex, Cell } from './classes/cell';
import { Direction, DirectionType } from './classes/direction';
import { KeyInput, BLACK, EMPTY } from './classes/keyinput';
import { Toolbar } from './components/toolbar/Toolbar';
import { ExportAction } from './components/toolbar/ExportTool';
import { PatternGenerator } from './classes/patterngenerator';
import { Clue, Clues, SuggestedAnswersPair, CluePair } from './classes/clues';
import { Sidebar } from './components/sidebar/Sidebar';
import { Footer } from './components/footer/Footer';
const defaultGridWidth = 15;
const defaultGridHeight = 15;

const getInitialFocus = () => new Focus(
    new Direction(DirectionType.ACROSS), new CellIndex(0, 0));
const initialFocus = getInitialFocus();
const defaultShouldHighlight = true;
const getInitialGrid = () => Grid
  .initialize(defaultGridWidth, defaultGridHeight)
  .getGridWithNewFocus(initialFocus, initialFocus, defaultShouldHighlight);

const initialIsSymmetricalGrid = true;
const initialPatternIsFrozen = false;

const initialClues = new Clues();

const initialAuthor = "Anonymous";
const initialTitle = "Untitled";

type AppProps = {}

type AppState = 
{
  currentGrid: Grid;
  currentFocus: Focus;
  isSymmetricalGrid: boolean;

  currentAuthor: string;
  currentTitle: string;

  shouldShowExportMenu: boolean;

  patternIsFrozen: boolean;

  currentClues: Clues;
  currentSuggestedAnswersPair: SuggestedAnswersPair;
}

export class App extends React.Component<AppProps, AppState> 
{
  private patternGenerator: PatternGenerator;

  constructor(props: AppProps) 
  {
    super(props);

    const initialFocus = getInitialFocus();
    const shouldHighlight = true;
    const initialGrid = getInitialGrid()
      .getGridWithNewLabels()
      .getGridWithNewFocus(
        initialFocus,
        initialFocus, 
        shouldHighlight);

    this.state = { 
      currentGrid: initialGrid, 
      currentFocus: initialFocus,
      isSymmetricalGrid: initialIsSymmetricalGrid,
      
      currentAuthor: initialAuthor,
      currentTitle: initialTitle,

      shouldShowExportMenu: false,
      
      patternIsFrozen: initialPatternIsFrozen,

      currentClues: initialClues,
      currentSuggestedAnswersPair: {
        acrossAnswers: [],
        downAnswers: []
      },
    };

    this.patternGenerator = new PatternGenerator(this.state.currentGrid.metadata);
  }

  render() 
  {
    const updateFns = 
    {
      updateFocusFromMouseFn: this.updateGivenMouseInput,
      updateFocusFromKeyFn: this.updateGivenFocusKeyInput,
      updateFillFn: this.updateGivenFillKeyInput,
    }

    const toolbarHandlers =
    {
      newToolHandlers: { handleClick: this.createNewPuzzle },
      openToolHandlers: { updateGridFromUploadedFile: this.updateGridFromUploadedFile },
      exportToolHandlers: { handleExport: this.handleExport, toggleExportMenu: this.toggleExportMenu },
      generatePatternToolHandlers: { handleClick: this.generateRandomGrid, },
      freezePatternToolHandlers: { handleClick: this.toggleFreezePattern, },
      clearFillToolHandlers: { handleClick: this.clearFill, },
      toggleSymmetryToolHandlers: { handleClick: this.toggleIsSymmetricalGrid, },
      importDictionaryToolHandlers: { updateDictionaryFromUploadedFile: this.updateDictionaryFromUploadedFile, },
      autoFillToolHandlers: { handleClick: this.autoFill },
    }

    const toolbarDisplays = 
    {
      shouldShowExportMenu: this.state.shouldShowExportMenu, 
      patternIsFrozen: this.state.patternIsFrozen,
      isSymmetricalGrid: this.state.isSymmetricalGrid,
    }

    const cluePair = this.getCluesFromCurrentCellIndex(this.state.currentFocus.focusCellIndex);
    return (
        <div>
          <link rel="stylesheet" type="text/css" href="style.css" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
          <Header 
            author={this.state.currentAuthor}
            updateAuthor={this.updateAuthor} 
            title={this.state.currentTitle}
            updateTitle={this.updateTitle}
          />
          <Toolbar
            toolbarHandlers={toolbarHandlers}
            toolbarDisplays={toolbarDisplays}
          />
          <GridBody 
            gridData={this.state.currentGrid}
            focusData={this.state.currentFocus}
            updateFns={updateFns}
          />
          <Sidebar
            cluePair={cluePair}
            setClue={this.setClue}
            getWordAtClue={this.getWordAtClue}
            suggestedAnswersPair={this.state.currentSuggestedAnswersPair}
            fillGridFromSelectedAnswer={this.fillGridFromSelectedAnswer}
          />
          <Footer />
        </div>
    );
  }
  
  // -------GRID OPERATIONS-----------------------
  updateGivenFillKeyInput = (cellIndex: CellIndex, keyInput: KeyInput): void => 
  {
    const { 
      currentGrid, 
      currentFocus, 
      isSymmetricalGrid, 
      currentClues } = this.state;
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
      const newClues = currentClues.reassignLabelsToClues(newGrid);
      this.setState({ currentClues: newClues })
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

    this.finalizeGrid(newGrid, newFocus);
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
    
    this.finalizeGrid(currentGrid, newFocus);
  }

  updateGivenFocusKeyInput = (cellIndex: CellIndex, key: KeyInput): void => 
  {
    const { currentGrid, currentFocus } = this.state;
    const newFocus = currentFocus.getFocusGivenFocusKeyInput(key, currentGrid.metadata);
    
    this.finalizeGrid(currentGrid, newFocus);
  }

  finalizeGrid = (grid: Grid, newFocus: Focus): void => 
  {
    const { currentFocus } = this.state;
    const shouldHighlight = !grid
      .getCellAtIndex(newFocus.focusCellIndex)
      .isBlack();    
    const finalGrid = grid.getGridWithNewFocus(currentFocus, newFocus, shouldHighlight);
    this.setState({ currentGrid: finalGrid, currentFocus: newFocus });
  }

  // -------HEADER OPERATIONS-----------------------
  updateAuthor = (author: string) => 
  {
    if (author !== this.state.currentAuthor)
    {
      this.setState({ currentAuthor: author });
    }
  }
  
  updateTitle = (title: string) => 
  {
    if (title !== this.state.currentTitle)
    {
      this.setState({ currentTitle: title });
    }
  }

  // -------TOOLBAR OPERATIONS-----------------------
  createNewPuzzle = () =>
  {
    const initialFocus = getInitialFocus();
    const initialGrid = getInitialGrid();

    this.setState({ 
      currentAuthor: initialAuthor,
      currentTitle: initialTitle,
      currentFocus: initialFocus,
      currentGrid: initialGrid,
    })
  }

  updateGridFromUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    event.stopPropagation();
    event.preventDefault();
    const files = event.target.files;
    if (files != null && files.length > 0)
    {
      const file = files[0]
      console.log("file:", file);
    }

    // TODO
    // send file to backend route internal.gilwalzer/getJsonForFile
    // get back json
    // initialize grid from json
    alert("this feature is not ready!");
  }

  handleExport = (exportAction: ExportAction) =>
  {
    // TODO
    // get grid as JSON
    // send JSON to backend route internal.gilwalzer/getFileForJson?exportAction={exportAction}
    // get back file
    // download it
    alert("this feature is not ready!");
  }

  toggleExportMenu = (shouldShowExportMenu: boolean) =>
  {
      this.setState({ shouldShowExportMenu: shouldShowExportMenu })
  }

  generateRandomGrid = () =>
  {
    const grid = this.patternGenerator.generatePatternFromPrepopulatedList();
    if (grid !== null) {
      this.setState({ currentGrid: grid });
    }
  }

  toggleFreezePattern = () =>
  {
    // TODO respect patternIsFrozen in grid.ts
    this.setState({ patternIsFrozen: !this.state.patternIsFrozen });
  }

  toggleIsSymmetricalGrid = () =>
  {
    this.setState({ isSymmetricalGrid: !this.state.isSymmetricalGrid });
  }

  clearFill = () =>
  {
    //TODO clear fill
  }

  updateDictionaryFromUploadedFile = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    event.stopPropagation();
    event.preventDefault();
    const files = event.target.files;
    if (files != null && files.length > 0)
    {
      const file = files[0]
      console.log("file:", file);
    }

    // TODO
    // send file to backend route internal.gilwalzer/getJsonForFile
    // get back json
    // initialize dictionary from json
    alert("this feature is not ready!");
  }

  autoFill = () => 
  {
    alert("this feature is not ready!");
  }

  // ---------SIDEBAR OPERATIONS-----------------------
  getCluesFromCurrentCellIndex = (cellIndex: CellIndex) =>
  {
    const { currentGrid, currentClues } = this.state;
    const currentCell = currentGrid.getCellAtIndex(cellIndex);
    if (currentCell.isBlack())
    {
      return {
        acrossClue: Clue.getEmptyClue(),
        downClue: Clue.getEmptyClue()
      };
    }
    const firstCellIndexOfAcross = currentGrid.getFirstCellIndexInWordGivenDirection(
      cellIndex, 
      new Direction(DirectionType.ACROSS));
    const firstCellIndexOfDown = currentGrid.getFirstCellIndexInWordGivenDirection(
      cellIndex, 
      new Direction(DirectionType.DOWN));

    const cluePair: CluePair = {
      acrossClue: currentClues.getOrInitializeClue(
          firstCellIndexOfAcross, 
          currentGrid.getCellAtIndex(firstCellIndexOfAcross), 
          DirectionType.ACROSS),
      downClue: currentClues.getOrInitializeClue(
        firstCellIndexOfDown,
        currentGrid.getCellAtIndex(firstCellIndexOfDown),
        DirectionType.DOWN)
    }
    return cluePair;
  }

  setClue = (clue: Clue, newText: string) =>
  {
    this.state.currentClues.setClue(clue, newText);
  }

  getWordAtClue = (clue: Clue) => 
  {
    var word = "";
    
    if (clue.isEmptyClue()) 
    {
      return word;
    }
    
    const { firstCellIndex, clueDirection } = clue.clueReference;
    const direction = new Direction(clueDirection);
    var currentCellIndex = firstCellIndex;
    const { currentGrid } = this.state;
    let currentCell: Cell;

    // walk forward, construcing a word until finding a black square or the edge
    while (true)
    {
      currentCell = currentGrid.getCellAtIndex(currentCellIndex);
      if (currentCell.isBlack())
      {
        break;
      }
      word = word + (currentCell.isEmpty() ? "-" : currentCell.fill);

      if (currentGrid.metadata.isCellIndexFinalGivenDirection(currentCellIndex, direction))
      {
        break;
      }

      currentCellIndex = currentGrid.getNextCellIndexGivenDirection(
        currentCellIndex,
        direction,
        false);
    }

    return word;
  }

  fillGridFromSelectedAnswer = (answer: string) =>
  {
    alert("this feature is not ready!")
  }
}