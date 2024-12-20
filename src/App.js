import React, {useState, useEffect, useCallback } from 'react';
import './App.css';
import {TETROMINOS, Tetromino, getCellClassName, getRandom, getTypeString, initialTopPosition, superRotationTests} from './TetrisInternal';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const TICK = 10;
const LONGTICK = 100;  // Represents number of ticks before a long tick
const STATUS = {
  NOT_PRESSED: 0,
  PRESSED: 1,
  DONE: 2
}
const trackedKeys = {
  a: "a",
  ArrowLeft: "a",
  s: "s",
  ArrowDown: "s",
  d: "d",
  ArrowRight: "d",
  w: "w",
  ArrowUp: "w",
  c: "c",
  z: "z",
  Escape: "esc",
  " ": "space"
}
const DEBUG = false;

function App() {
  const [upcomingList, setUpcomingList] = useState([
    TETROMINOS.NULL, TETROMINOS.NULL, TETROMINOS.NULL, TETROMINOS.NULL, TETROMINOS.NULL
  ]);
  const [held, setHeld] = useState(new Tetromino({ x: 0, y: 0}, TETROMINOS.NULL, 0));
  const [canHold, setCanHold] = useState(true);
  const [placed, setPlaced] = useState([]);
  const [dropping, setDropping] = useState(new Tetromino({ x: 0, y: 0}, TETROMINOS.NULL, 0));
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const [keyPressed, setKeyPressed] = useState({
    a: STATUS.NOT_PRESSED,
    s: STATUS.NOT_PRESSED,
    d: STATUS.NOT_PRESSED,
    w: STATUS.NOT_PRESSED,
    c: STATUS.NOT_PRESSED,
    z: STATUS.NOT_PRESSED,
    esc: STATUS.NOT_PRESSED,
    space: STATUS.NOT_PRESSED
  });
  const [debugMessage, setDebugMessage] = useState("");
  const [gameIsOver, setGameIsOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Game logic functions
  // Creating an empty grid
  const createGrid = () => {
    const grid = [];
    for (let r = 0; r < GRID_HEIGHT; r++) {
      grid.push([]);
      for (let c = 0; c < GRID_WIDTH; c++) {
        grid[r].push(0);
      }
    }
    return grid;
  }

  // What to do on initialization or restart
  const init = useCallback(() => {
    setUpcomingList([getRandom(), getRandom(), getRandom(), getRandom(), getRandom()]);
    setHeld(new Tetromino({ x: 0, y: 0}, TETROMINOS.NULL, 0));
    setCanHold(true);
    setPlaced([]);
    let dropType = getRandom();
    setDropping(new Tetromino(initialTopPosition(dropType), dropType, 0));
    setTick(0);
    setDebugMessage("Initialized");
    setScore(0);
    setGameIsOver(false);
    setIsPaused(false);
  }, []);

  // Game over
  const gameOver = useCallback(() => {
    setGameIsOver(true);
    setDebugMessage("Game Over");
  }, []);

  // Whether a tetromino is obstructed by `placed`
  const isObstructed = useCallback((tetromino, useDropping = false) => {
    if (tetromino.type === TETROMINOS.NULL) return false;
    let cells = tetromino.getCellCoordinates();
    for (let i = 0; i < 4; i++) {
      let cell = cells[i];
      if (cell.x < 0 || cell.x >= GRID_WIDTH || cell.y >= GRID_HEIGHT) {
        return true;
      }
      if (placed.find((placedCell) => placedCell.x === cell.x && placedCell.y === cell.y)) {
        return true;
      }
      if (useDropping &&
        dropping.getCellCoordinates().find(droppingCell => 
          droppingCell.x === cell.x && droppingCell.y === cell.y
        )) return true;
    }
    return false;
  }, [placed, dropping]);

  // Save tetromino to `placed` and clear full rows, return number of rows cleared
  const saveToPlaced = useCallback((tetromino) => {
    let newPlaced = [...placed];
    let cells = tetromino.getCellCoordinates().map((cell) => {
      return {x: cell.x, y: cell.y, type: tetromino.type};
    });
    newPlaced = newPlaced.concat(cells);

    let rows = new Array(GRID_HEIGHT).fill(0);
    newPlaced.forEach((cell) => {
      rows[cell.y]++;
    });
    let rowsToClear = [];
    for (let i = 0; i < GRID_HEIGHT; i++) {
      if (rows[i] === GRID_WIDTH) {
        rowsToClear.push(i);
      }
    }
    newPlaced = newPlaced.filter((cell) => rows[cell.y] < GRID_WIDTH).map(
      (cell) => {
        let newY = cell.y;
        rowsToClear.forEach((row) => {
          if (cell.y < row) {
            newY++;
          }
        })
        return {x: cell.x, y: newY, type: cell.type};
      }
    );

    setPlaced(newPlaced);
    return rowsToClear.length;
  }, [placed]);

  // Try to place a new tetromino at the top
  const placeDropping = useCallback((dropType) => {
    let newDropping = new Tetromino(initialTopPosition(dropType), dropType, 0);
    // `dropping` is not yet placed in `placed`, so set `useDropping` to true
    // Try to find a new position for `newDropping` favorable to the player
    for (let d = 0; d < 4; d++) {
      newDropping.direction = d;
      if (!isObstructed(newDropping, true)) {
        setDropping(newDropping);
        return;
      }
    }
    // Allow a position that is above the grid 1 cell
    newDropping.origin.y--;
    for (let d = 0; d < 4; d++) {
      newDropping.direction = d;
      if (!isObstructed(newDropping, true)) {
        setDropping(newDropping);
        return;
      }
    }
    // Game over at failure
    gameOver();
  }, [isObstructed, gameOver]);

  // Update `upcomingList` and pop the first element
  const updateUpcomingList = useCallback(() => {
    let newUpcomingList = [...upcomingList];
    let popOut = newUpcomingList.shift();
    newUpcomingList.push(getRandom());
    setUpcomingList(newUpcomingList);
    return popOut;
  }, [upcomingList]);

  // Super rotation system
  const superRotate = useCallback((tetromino, cw) => {
    let newTetromino = tetromino.rotate(cw);
    if (!isObstructed(newTetromino)) return newTetromino;
    let tests = superRotationTests(tetromino.type, tetromino.direction, newTetromino.direction);
    setDebugMessage(`${tests.length} tests`);
    for (let i = 0; i < tests.length; ++i) {
      let test = tests[i];
      let candidate = new Tetromino(
        {x: newTetromino.origin.x + test.x, y: newTetromino.origin.y + test.y},
        newTetromino.type,
        newTetromino.direction
      );
      if (!isObstructed(candidate)) return candidate;
    }
    return tetromino;
  }, [isObstructed]);
  
  // Key mapper
  const keyMapper = useCallback(() => {
    for (let key in keyPressed){
      if (keyPressed[key] === STATUS.PRESSED) {
        let newDropping = dropping.clone();
        switch (key) {
          case 'a':
            newDropping = dropping.moveLeft();
            if (!isObstructed(newDropping)) {
              setDropping(newDropping);
            }
            break;
          case 's':
            newDropping = dropping.moveDown();
            if (!isObstructed(newDropping)) {
              setDropping(newDropping);
              setTick(0);
            } else {
              setTick(LONGTICK);
            }
            break;
          case 'd':
            newDropping = dropping.moveRight();
            if (!isObstructed(newDropping)) {
              setDropping(newDropping);
            }
            break;
          case 'w':
            setDropping(superRotate(dropping, true));
            break;
          case 'c':
            if (!canHold) break;
            if (held.type === TETROMINOS.NULL){
              setHeld(dropping);
              placeDropping(updateUpcomingList());
              setTick(0);
            } else {
              let dropType = held.type;
              setHeld(dropping);
              placeDropping(dropType);
              setTick(0);
            }
            setCanHold(false);
            break;
          case 'z':
            setDropping(superRotate(dropping, false));
            break;
          case 'esc':
            setIsPaused(true);
            break;
          case 'space':
            while (!isObstructed(newDropping.moveDown())) {
              newDropping = newDropping.moveDown();
            }
            setDropping(newDropping);
            setTick(LONGTICK);
            break;
          default:
            break;
        }
        setKeyPressed(prev => ({...prev, [key]: STATUS.DONE}));
      }
    }
  }, [keyPressed, dropping, isObstructed, canHold, held, updateUpcomingList, placeDropping, superRotate]);

  // Score calculator
  const calculateScore = useCallback((rowsCleared) => {
    switch (rowsCleared) {
      case 1: return 100;
      case 2: return 300;
      case 3: return 500;
      case 4: return 800;
      default: return 0;
    }
  }, []);

  // useEffect statements
  // Initial call to init()
  useEffect(() => {
    init();
  }, [init]);

  // Tick handler
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameIsOver || isPaused) return;
      setTick(tick => tick + 1);
      // Associate key press with commands
      keyMapper();
    }, TICK);
    return () => clearInterval(interval);
  }, [keyMapper, gameIsOver, isPaused]);

  // Long tick handler
  useEffect(() => {
    if (tick >= LONGTICK) {
      let newDropping = dropping.moveDown();
      // If `dropping` can drop: drop `dropping` by one cell
      if (!isObstructed(newDropping)) {
        setDropping(newDropping);
      }

      // If `dropping` can't drop:
      else {
        // Save `dropping` to `placed`, deselect `dropping`
        // Read `placed` and clear full rows
        let rowsCleared = saveToPlaced(dropping);

        // Update score based on `rowsCleared`
        setScore(score => score + calculateScore(rowsCleared));

        // Update `upcomingList` and select the first element as `dropping`
        // Place `dropping` at the top of the grid
        placeDropping(updateUpcomingList());
        setCanHold(true);
      }
      setTick(0);
    }
  }, [tick, dropping, score, placed, isObstructed, saveToPlaced, updateUpcomingList, placeDropping, calculateScore]);

  // Key press handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = trackedKeys[event.key];
      if (key && keyPressed[key] === STATUS.NOT_PRESSED && !event.repeat) {
        setKeyPressed(prev => ({...prev, [key]: STATUS.PRESSED}));
      }
      if (key && keyPressed[key] === STATUS.DONE && event.repeat) {
        setKeyPressed(prev => ({...prev, [key]: STATUS.PRESSED}));
      }
    };
    const handleKeyUp = (event) => {
      const key = trackedKeys[event.key];
      if (key) {
        setKeyPressed(prev => ({...prev, [key]: STATUS.NOT_PRESSED}));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyPressed]);
  
  // Tetromino image loader
  const ImgLoader = (props) => {
    return (
      <img
        src={require(`./tetrominos/${props.name}.png`)}
        alt={props.name}
        style={{
          width: "80px",
          height: "80px",
          paddingLeft: "20px",
          paddingTop: props.paddingTop,
          paddingBottom: props.paddingBottom
        }}
      />
    );
  };

  // Game over box
  const GameOverBox = (props) => {
    return (
      <div className="overlay-box" style={{padding: "20px"}}>
        <h1 style={{color: "#fff", textAlign: "center"}}>
          GAME OVER
        </h1>
        <h2 style={{color: "#fff", textAlign: "center"}}>
          Score: {score}
        </h2>
        <button className="overlay-button" onClick={init}>
          Restart
        </button>
      </div>
    )
  }

  // Pause box
  const PauseBox = (props) => {
    return (
      <div className="overlay-box" style={{padding: "20px"}}>
        <h1 style={{color: "#fff", textAlign: "center"}}>
          PAUSED
        </h1>
        <button className="overlay-button" onClick={() => setIsPaused(false)}>
          Resume
        </button>
        <button className="overlay-button" onClick={init}>
          Restart
        </button>
      </div>
    )
  }

  // Grid loader
  const GridLoader = (props) => {
    let grid = createGrid();
    placed.forEach((cell) => {
      if (cell.x >= 0 && cell.x < GRID_WIDTH && cell.y >= 0 && cell.y < GRID_HEIGHT) {
        grid[cell.y][cell.x] = cell.type;
      }
    })
    dropping.getCellCoordinates().forEach((cell) => {
      if (cell.x >= 0 && cell.x < GRID_WIDTH && cell.y >= 0 && cell.y < GRID_HEIGHT) {
        grid[cell.y][cell.x] = dropping.type;
      }
    })
    
    if (gameIsOver) return <GameOverBox />;
    if (isPaused) return <PauseBox />;
    return (
      <div className="tetris-grid" style={{padding: "20px"}}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="tetris-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={getCellClassName(cell)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    )
  };

  // Debug box
  const DebugBox = (props) => {
    return DEBUG ? (
      <div>
        <h3 style={{color: "#fff", textAlign: "center"}}>
          Debug
        </h3>
        <div className="box">
          <h3 style={{color: "#fff", textAlign: "center"}}>
            {tick}
          </h3>
          <p style={{color: "#fff", textAlign: "center", fontSize: "10px"}}>
            {debugMessage}
          </p>
        </div>
      </div>
    ) : null;
  };

  // Left panel
  const LeftPanel = (props) => {
    return (
      <div className="panel">
        <h3 style={{color: "#fff", textAlign: "center"}}>
          Hold
        </h3>
        <div className="box">
          {
            <ImgLoader name={getTypeString(held.type)} paddingTop="20px" paddingBottom="20px" />
          }
        </div>
        <DebugBox />
      </div>
    );
  }

  // Center panel
  const CenterPanel = (props) => {
    return (
      <div className="panel">
        <h2 style={{color: "#fff", textAlign: "center"}}>
          TETRIS
        </h2>
        <GridLoader />
      </div>
    );
  }

  // Right panel
  const RightPanel = (props) => {
    return (
      <div className="panel">
        <h3 style={{color: "#fff", textAlign: "center"}}>
          Upcoming
        </h3>
        <div className="box">
          <ImgLoader name={getTypeString(upcomingList[0])} paddingTop="20px" />
          <ImgLoader name={getTypeString(upcomingList[1])} />
          <ImgLoader name={getTypeString(upcomingList[2])} />
          <ImgLoader name={getTypeString(upcomingList[3])} />
          <ImgLoader name={getTypeString(upcomingList[4])} paddingBottom="20px" />
        </div>
        <h3 style={{color: "#fff", textAlign: "center"}}>
          Score
        </h3>
        <div className="box">
          <h3 style={{color: "#fff", textAlign: "center"}}>
            {score}
          </h3>
        </div>
      </div>
    );
  }
  
  // Main return
  return (
    <div className="App">
      <div className="game-wrapper">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
