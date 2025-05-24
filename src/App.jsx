import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

import { db, ref, set, onValue, update } from "./firebase"; // استيراد Firebase

const roomId = "room1"; // اسم الغرفة (يمكنك تغييره لاحقًا)
const roomRef = ref(db, `rooms/${roomId}`);




const sounds = {
  x: new Audio("/sound/x.mp3"),
  o: new Audio("/sound/o.mp3"),
  win: new Audio("/sound/win.mp3"),
};

// تحميل الأصوات مسبقًا
Object.values(sounds).forEach((audio) => {
  audio.load(); // يبدأ تحميل الملف
});

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

  useEffect(() => {
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSquares(data.squares || Array(9).fill(null));
        setXIsNext(data.xIsNext ?? true);
      }
    });
  
    return () => unsubscribe();
  }, []);




  function playSound(type) {
    const audio = type;
    audio.play();
    console.log(audio);
  }

  useEffect(() => {
    const winner = calculateWinner(squares);

    if (winner) {
      playSound(sounds.win);
    } else {
      const lastMove = squares.filter(Boolean).length;
      if (lastMove > 0) {
        playSound(xIsNext ? sounds.o : sounds.x); // لاحظ أن الدور تغير
      }
    }
  }, [squares]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
  
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
  
    update(roomRef, {
      squares: nextSquares,
      xIsNext: !xIsNext,
    });
  }
  

  function resetGame() {
    update(roomRef, {
      squares: Array(9).fill(null),
      xIsNext: true,
    });
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
