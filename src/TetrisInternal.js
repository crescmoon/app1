export const TETROMINOS = Object.freeze({
  I: 1,
  J: 2,
  L: 3,
  O: 4,
  S: 5,
  T: 6,
  Z: 7,
  NULL: 8
})


export const getTypeString = (type) => {
  switch (type) {
    case TETROMINOS.I:
      return 'I';
    case TETROMINOS.J:
      return 'J';
    case TETROMINOS.L:
      return 'L';
    case TETROMINOS.O:
      return 'O';
    case TETROMINOS.S:
      return 'S';
    case TETROMINOS.T:
      return 'T';
    case TETROMINOS.Z:
      return 'Z';
    default:
      return 'NULL';
  }
}


export function initialTopPosition(type) {
  if (type === TETROMINOS.I || type === TETROMINOS.O) {
    return {x: 4, y: 0};
  } else {
    return {x: 4, y: 1}
  }
}


export function getRandom() {
  return Math.floor(Math.random() * 7) + 1;
}


export class Tetromino {
  constructor(origin, type, direction) {
    this.origin = origin;
    this.type = type;
    this.direction = direction;
  }
  
  getCellCoordinates() {
    let type = this.type;
    let origin = this.origin;
    let direction = this.direction;
    let alt = [];
    switch (type) {
      case TETROMINOS.I:
        switch (direction) {
          case 0: alt = [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]; break;
          case 1: alt = [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}]; break;
          case 2: alt = [{x: -2, y: 0}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}]; break;
          case 3: alt = [{x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]; break;
          default: alt = [];
        }
        break;
      case TETROMINOS.J:
        switch (direction) {
          case 0: alt = [{x: -1, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}]; break;
          case 1: alt = [{x: 0, y: -1}, {x: 1, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]; break;
          case 2: alt = [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}]; break;
          case 3: alt = [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}]; break;
          default: alt = [];
        }
        break;
      case TETROMINOS.L:
        switch (direction) {
          case 0: alt = [{x: 1, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}]; break;
          case 1: alt = [{x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]; break;
          case 2: alt = [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: 1}]; break;
          case 3: alt = [{x: -1, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}]; break;
          default: alt = [];
        }
        break;
      case TETROMINOS.O:
        switch (direction) {
          case 0: alt = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]; break;
          case 1: alt = [{x: -1, y: 0}, {x: 0, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}]; break;
          case 2: alt = [{x: -1, y: -1}, {x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}]; break;
          case 3: alt = [{x: 0, y: -1}, {x: 1, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}]; break;
          default: alt = [];
        }
        break;
      case TETROMINOS.S:
        switch (direction) {
          case 0: alt = [{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}]; break;
          case 1: alt = [{x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}]; break;
          case 2: alt = [{x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}]; break;
          case 3: alt = [{x: -1, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}]; break;
          default: alt = [];
        }
        break;
      case TETROMINOS.T:
        switch (direction) {
          case 0: alt = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}]; break;
          case 1: alt = [{x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]; break;
          case 2: alt = [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]; break;
          case 3: alt = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}]; break;
          default: alt = [];
        }
        break;
      case TETROMINOS.Z:
        switch (direction) {
          case 0: alt = [{x: -1, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}]; break;
          case 1: alt = [{x: 1, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}]; break;
          case 2: alt = [{x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}]; break;
          case 3: alt = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: -1, y: 1}]; break;
          default: alt = [];
        }
        break;
        default:
          alt = [];
    }
    return alt.map(cell => ({
      x: origin.x + cell.x,
      y: origin.y + cell.y
    }));
  }

  defaultRotation(cw) {
    if (cw) {
      this.direction = (this.direction + 1) % 4;
    } else {
      this.direction = (this.direction + 3) % 4;
    }
    if (this.type === TETROMINOS.I) {
      if (cw) {
        switch (this.direction) {
          case 0: this.origin.y -= 1; break;
          case 1: this.origin.x += 1; break;
          case 2: this.origin.y += 1; break;
          case 3: this.origin.x -= 1; break;
          default: break;
        }
      } else {
        switch (this.direction) {
          case 0: this.origin.x -= 1; break;
          case 1: this.origin.y -= 1; break;
          case 2: this.origin.x += 1; break;
          case 3: this.origin.y += 1; break;
          default: break;
        }
      }
    }
  }

  clone() {
    return new Tetromino({x: this.origin.x, y: this.origin.y}, this.type, this.direction);
  }

  moveDown() {
    return new Tetromino({x: this.origin.x, y: this.origin.y + 1}, this.type, this.direction);
  }

  moveLeft() {
    return new Tetromino({x: this.origin.x - 1, y: this.origin.y}, this.type, this.direction);
  }
  
  moveRight() {
    return new Tetromino({x: this.origin.x + 1, y: this.origin.y}, this.type, this.direction);
  }

  rotate(cw) {
    // TODO: Make the default rotation cleaner
    let newTetromino = new Tetromino({x: this.origin.x, y: this.origin.y}, this.type, this.direction);
    newTetromino.defaultRotation(cw);
    return newTetromino;
  }
}


export function getCellClassName(type) {
  switch (type) {
    case TETROMINOS.I:
      return 'tetris-cell I';
    case TETROMINOS.J:
      return 'tetris-cell J';
    case TETROMINOS.L:
      return 'tetris-cell L';
    case TETROMINOS.O:
      return 'tetris-cell O';
    case TETROMINOS.S:
      return 'tetris-cell S';
    case TETROMINOS.T:
      return 'tetris-cell T';
    case TETROMINOS.Z:
      return 'tetris-cell Z';
    default:
      return 'tetris-cell';
  }
}