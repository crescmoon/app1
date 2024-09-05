import React from 'react';
import './App.css';
import {TETROMINOS, Tetromino, getCellClassName} from './TetrisInternal';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

function App() {
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

  const GridLoader = (props) => {
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

  const grid = createGrid();

  let tetrominos = [
    new Tetromino(
      { x: 6, y: 12 },
      TETROMINOS.T,
      0
    )
  ];

  tetrominos.forEach((tetromino) => {
    tetromino.getCellCoordinates().forEach(cell => {
      if (cell.x >= 0 && cell.x < GRID_WIDTH && cell.y >= 0 && cell.y < GRID_HEIGHT) {
        grid[cell.y][cell.x] = tetromino.type;
      }
    });
  })

  return (
    <div className="App">
      <div className="game-wrapper">
        <div className="next-panel">
          <h3 style={{color: "#fff", textAlign: "center"}}>
            Next
          </h3>
          <div className="box">
            <ImgLoader name="I" paddingTop="20px" paddingBottom="20px" />
          </div>
        </div>
        <div className="center-panel">
          <h2 style={{color: "#fff", textAlign: "center"}}>
            TETRIS
          </h2>
          <GridLoader />
        </div>
        <div className="right-panel">
          <h3 style={{color: "#fff", textAlign: "center"}}>
            Upcoming
          </h3>
          <div className="box">
            <ImgLoader name="T" paddingTop="20px" />
            <ImgLoader name="Z" />
            <ImgLoader name="I" />
            <ImgLoader name="J" />
            <ImgLoader name="O" paddingBottom="20px" />
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
      </div>
    </div>
  );
}

export default App;
