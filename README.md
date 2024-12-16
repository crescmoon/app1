# Tetris

A React-based minimalist implementation of the classic Tetris game.

---

## **Gameplay**

### **Key Bindings**

| Action          | Keys                      |
|-----------------|---------------------------|
| Move Left       | `a` / `ArrowLeft`         |
| Move Right      | `d` / `ArrowRight`        |
| Rotate Clockwise| `w` / `ArrowUp`           |
| Rotate Counter  | `z`                       |
| Soft Drop       | `s` / `ArrowDown`         |
| Hard Drop       | `Space`                   |
| Hold Piece      | `c`                       |
| Pause Game      | `Escape`                  |

### **Features**

- **Game Grid:** A 10x20 grid with an invisible top row.
- **Super Rotation System:** Fully implemented.
- **Game Over:** When new tetrominoes cannot spawn.
- **Score Tracking:** Simple scoring system based on rows cleared.

| Rows Cleared | Points |
|--------------|--------|
| 1            | 100    |
| 2            | 300    |
| 3            | 500    |
| 4            | 800    |

---

## **Future Improvements**

- **Better randomization:** Could use a 7-bag system for regular frequency of tetrominoes.
- **Scoring system:** Could be more rewarding.
  - T-spin detections.
  - Back-to-back bonuses.
  - Combos.
  - Full clear bonuses.
- **Speed system:** Could introduce dynamic speed increases.
- **Visuals:** Could use more effects.
  - Line clears and T-spins are not animated.
  - Game overs are abrupt.

---

## **How to Run the Game**

1. Clone the repository:

   ```bash
   git clone https://github.com/crescmoon/app1
   ```

2. Navigate to the project directory:

   ```bash
   cd app1
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open the game in a browser at `http://localhost:3000`.
