import React, {useState, useEffect, useCallback } from 'react';
import './App.css';
import {TETROMINOS, Tetromino, getCellClassName, getRandom, getTypeString, initialTopPosition} from './TetrisInternal';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const TICK = 10;
const LONGTICK = 100;  // Represents number of ticks before a long tick


function App() {
  const [upcomingList, setUpcomingList] = useState([TETROMINOS.NULL, TETROMINOS.NULL, TETROMINOS.NULL, TETROMINOS.NULL, TETROMINOS.NULL]);
  const [held, setHeld] = useState(new Tetromino({ x: 0, y: 0}, TETROMINOS.NULL, 0));
  const [placed, setPlaced] = useState([]);
  const [dropping, setDropping] = useState(new Tetromino({ x: 0, y: 0}, TETROMINOS.NULL, 0));
  const [tick, setTick] = useState(0);

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
    setPlaced([]);
    let dropType = getRandom();
    setDropping(new Tetromino(initialTopPosition(dropType), dropType, 0));
    setTick(0);
  }, []);

  // TODO: Whether a tetromino is obstructed by `placed`
  const isObstructed = useCallback((tetromino) => {
    return false;
  }, []);

  // TODO: Save tetromino to `placed` and clear full rows, return number of rows cleared

  // TODO: Update `upcomingList` and pop the first element


  // useEffect statements
  // Initial call to init()
  useEffect(() => {
    init();
  }, [init]);

  // Tick handler
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick => tick + 1);
      // TODO: Associate key press with commands
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  // Long tick handler
  useEffect(() => {
    if (tick === LONGTICK) {
      let newDropping = dropping.moveDown();
      // If `dropping` can drop: drop `dropping` by one cell
      if (!isObstructed(newDropping)) {
        setDropping(newDropping);
      }

      // TODO: If `dropping` can't drop:
      else {
        // Save `dropping` to `placed`, deselect `dropping`
        // Read `placed` and clear full rows

        // Update score based on `rowsCleared`

        // Update `upcomingList` and select the first element as `dropping`
        // Place `dropping` at the top of the grid
      }
      setTick(0);
    }
  }, [tick, dropping, placed, isObstructed]);


  // TODOs

  // TODO: Implement key press handler

  // TODO: Implement how the dropping block reacts to movement commands in TetrisInternal.js

  // TODO: Implement the hold command

  // TODO: Implement the score system

  // TODO: Implement the game over system

  // TODO: Implement the pause system



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
          paddingRight: "20px",
          paddingTop: props.paddingTop,
          paddingBottom: props.paddingBottom
        }}
      />
    );
  };

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
            0
          </h3>
        </div>
      </div>
    );
  }
  

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
