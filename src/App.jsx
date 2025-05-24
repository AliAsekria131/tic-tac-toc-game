import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import o from "../public/sound/o.mp3";
import x from "../public/sound/x.mp3";
import win from "../public/sound/win.mp3";

function Square({ value, onSquareClick, className }) {
  const markclass = value === "X" ? "x-mark" : value === "O" ? "o-mark" : " ";

  return (
    <button
      className={`square ${className} ${markclass}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function playSound(type) {
    const audio = new Audio(type);
    audio.play();
    console.log(audio);
  }

  useEffect(() => {
    const winner = calculateWinner(squares);

    if (winner) {
      playSound(win);
    } else {
      const lastMove = squares.filter(Boolean).length;
      if (lastMove > 0) {
        playSound(xIsNext ? o : x); // لاحظ أن الدور تغير
      }
    }
  }, [squares]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "الفائز هو: " + winner;
  } else {
    status = "اللاعب التالي: " + (xIsNext ? "X" : "O");
  }

  function getSquareClass(index) {
    const classes = [];

    // صفوف
    if (index < 3) classes.push("top");
    if (index > 5) classes.push("bottom");

    // أعمدة
    if (index % 3 === 0) classes.push("left");
    if (index % 3 === 2) classes.push("right");

    return classes.join(" ");
  }

  return (
    <>
      <div className="status">{status}</div>
      <hr />
      <div className="board-row">
        {[0, 1, 2].map((i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            className={getSquareClass(i)}
          />
        ))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map((i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            className={getSquareClass(i)}
          />
        ))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map((i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            className={getSquareClass(i)}
          />
        ))}
      </div>

      <button onClick={resetGame} className="reset-button">
        إعادة اللعب 🔄
      </button>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info"></div>
    </div>
  );
}
