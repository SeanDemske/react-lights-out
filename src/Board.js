import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = .25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let rowIdx = 0; rowIdx < nrows; rowIdx++) {
      initialBoard.push([]);
      for (let colIdx = 0; colIdx < ncols; colIdx++) {
        initialBoard[rowIdx].push(Math.random() < chanceLightStartsOn);
      }
    }
    return initialBoard;
  }

  function hasWon() {
    return board.every(row => {
      return row.every(col => col === true);
    })
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const newBoard = oldBoard.map(row => [...row]);

      flipCell(y, x, newBoard); // Center
      flipCell(y, x - 1, newBoard); // Left
      flipCell(y, x + 1, newBoard); // Right
      flipCell(y - 1, x, newBoard); // Top
      flipCell(y + 1, x, newBoard); // Bottom

      return newBoard;
    });
  }

  let tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    hasWon() === true
    ?
    // Taken from https://codepen.io/john-ulmer/pen/XWNrJWM
    <div class="container">
      <div class="panel">
        <div class="panel-inner">
          <div class="panel-front">
            <p>Y</p>
          </div>
          <div class="panel-back">
            <p>W</p>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-inner">
          <div class="panel-front">
            <p>O</p>
          </div>
          <div class="panel-back">
            <p>I</p>
          </div>

        </div>
      </div>
      <div class="panel">
        <div class="panel-inner">
          <div class="panel-front">
            <p>U</p>
          </div>
          <div class="panel-back">
            <p>N</p>
          </div>
        </div>
      </div>
    </div>
    :
    <table className="Board">
      <tbody>{tblBoard}</tbody>
    </table>

  )
}

export default Board;
