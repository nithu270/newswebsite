import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";


// ------------------------------------
// INITIAL SUDOKU GRID
// ------------------------------------

const generateSudokuGrid = () => {
  const grid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const presetNumbers = [
    [0, 0, 5],
    [1, 3, 3],
    [2, 6, 7],
    [3, 1, 6],
    [4, 4, 1],
    [5, 7, 9],
    [6, 2, 4],
    [7, 5, 2],
    [8, 8, 8],
  ];

  presetNumbers.forEach(([r, c, val]) => {
    grid[r][c] = val;
  });

  return grid;
};


// ------------------------------------
// CHECK COMPLETE SUDOKU
// ------------------------------------

const isValidSudoku = (grid) => {

  const isValidSet = (arr) => {
    return (
      arr.length === 9 &&
      !arr.includes(0) &&
      new Set(arr).size === 9
    );
  };


  // Rows
  for (let row = 0; row < 9; row++) {
    if (!isValidSet(grid[row])) {
      return false;
    }
  }


  // Columns
  for (let col = 0; col < 9; col++) {

    const column = grid.map((row) => row[col]);

    if (!isValidSet(column)) {
      return false;
    }
  }


  // 3 x 3 boxes
  for (let row = 0; row < 9; row += 3) {

    for (let col = 0; col < 9; col += 3) {

      const box = [];

      for (let r = 0; r < 3; r++) {

        for (let c = 0; c < 3; c++) {

          box.push(grid[row + r][col + c]);
        }
      }

      if (!isValidSet(box)) {
        return false;
      }
    }
  }

  return true;
};


// ------------------------------------
// CHECK WHETHER A NUMBER CAN BE PLACED
// ------------------------------------

const isSafeMove = (grid, row, col, number) => {

  // Check row
  for (let c = 0; c < 9; c++) {

    if (c !== col && grid[row][c] === number) {
      return false;
    }
  }


  // Check column
  for (let r = 0; r < 9; r++) {

    if (r !== row && grid[r][col] === number) {
      return false;
    }
  }


  // Check 3x3 box

  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  for (let r = boxStartRow; r < boxStartRow + 3; r++) {

    for (let c = boxStartCol; c < boxStartCol + 3; c++) {

      if (
        (r !== row || c !== col) &&
        grid[r][c] === number
      ) {
        return false;
      }
    }
  }

  return true;
};


// ------------------------------------
// SUDOKU COMPONENT
// ------------------------------------

const Sudoku = () => {

  const [grid, setGrid] = useState(generateSudokuGrid());

  const [isWon, setIsWon] = useState(false);

  const [selectedCell, setSelectedCell] = useState({
    row: null,
    col: null,
  });

  const [errorCell, setErrorCell] = useState({
    row: null,
    col: null,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const { width, height } = useWindowSize();


  // ------------------------------------
  // HANDLE CELL CHANGE
  // ------------------------------------

  const handleCellChange = (row, col, value) => {

    // Only allow 1-9
    if (value !== "" && !/^[1-9]$/.test(value)) {
      return;
    }


    // Clear error when editing
    setErrorCell({
      row: null,
      col: null,
    });

    setErrorMessage("");


    // Empty cell
    if (value === "") {

      const newGrid = grid.map((r) => [...r]);

      newGrid[row][col] = 0;

      setGrid(newGrid);

      return;
    }


    const number = parseInt(value);


    // Check Sudoku rules
    if (!isSafeMove(grid, row, col, number)) {

      setErrorCell({
        row,
        col,
      });

      setErrorMessage(
        `${number} already exists in this row, column, or 3×3 box.`
      );

      return;
    }


    // Update grid
    const newGrid = grid.map((r) => [...r]);

    newGrid[row][col] = number;

    setGrid(newGrid);
  };


  // ------------------------------------
  // CHECK WIN
  // ------------------------------------

  const checkWin = () => {

    if (isValidSudoku(grid)) {

      setIsWon(true);

      setErrorMessage("");

    } else {

      setIsWon(false);

      setErrorMessage(
        "The Sudoku is not complete or contains an invalid number."
      );
    }
  };


  // ------------------------------------
  // RESET
  // ------------------------------------

  const resetGame = () => {

    setGrid(generateSudokuGrid());

    setIsWon(false);

    setSelectedCell({
      row: null,
      col: null,
    });

    setErrorCell({
      row: null,
      col: null,
    });

    setErrorMessage("");
  };


  // ------------------------------------
  // AUTO CHECK
  // ------------------------------------

  useEffect(() => {

    if (isValidSudoku(grid)) {
      setIsWon(true);
    }

  }, [grid]);


  // ------------------------------------
  // UI
  // ------------------------------------

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-3 sm:px-4 py-5 sm:py-6 overflow-x-hidden">

      {/* CONFETTI */}

      {isWon && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
        />
      )}


      {/* MAIN CONTAINER */}

      <div className="w-full max-w-2xl mx-auto">


        {/* HEADER */}

        <div className="text-center mb-4 sm:mb-5">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            🧩 Sudoku Challenge
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-lg mx-auto px-2">
            Fill the grid with numbers 1-9 without repeating
            in rows, columns, and boxes.
          </p>

        </div>


        {/* GAME CARD */}

        <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 md:p-5 w-full">


          {/* SUDOKU BOARD */}

          <div className="w-full max-w-[420px] mx-auto aspect-square">

            <div className="grid grid-cols-9 w-full h-full border-2 border-gray-800 rounded-md overflow-hidden">

              {grid.map((row, rowIndex) =>

                row.map((cell, colIndex) => {

                  const isSelected =
                    selectedCell.row === rowIndex &&
                    selectedCell.col === colIndex;


                  const isError =
                    errorCell.row === rowIndex &&
                    errorCell.col === colIndex;


                  // Thicker right border
                  const borderRight =
                    colIndex === 2 || colIndex === 5
                      ? "border-r-2 border-r-gray-800"
                      : "border-r border-r-gray-300";


                  // Thicker bottom border
                  const borderBottom =
                    rowIndex === 2 || rowIndex === 5
                      ? "border-b-2 border-b-gray-800"
                      : "border-b border-b-gray-300";


                  return (

                    <input
                      key={`${rowIndex}-${colIndex}`}

                      type="text"

                      inputMode="numeric"

                      maxLength="1"

                      value={cell !== 0 ? cell : ""}

                      onChange={(e) =>
                        handleCellChange(
                          rowIndex,
                          colIndex,
                          e.target.value
                        )
                      }

                      onClick={() =>
                        setSelectedCell({
                          row: rowIndex,
                          col: colIndex,
                        })
                      }

                      className={`
                        w-full
                        h-full
                        min-w-0
                        aspect-square

                        text-center

                        text-sm
                        sm:text-base
                        md:text-lg

                        font-bold

                        outline-none

                        transition-all
                        duration-150

                        ${borderRight}
                        ${borderBottom}

                        ${
                          cell !== 0
                            ? "text-gray-700"
                            : "text-blue-600"
                        }

                        ${
                          isSelected
                            ? "bg-blue-100 ring-2 ring-inset ring-blue-500 z-10"
                            : "bg-white"
                        }

                        ${
                          isError
                            ? "bg-red-100 ring-2 ring-inset ring-red-500"
                            : ""
                        }

                        hover:bg-blue-50

                        focus:bg-blue-50
                        focus:ring-2
                        focus:ring-inset
                        focus:ring-blue-400
                      `}
                    />

                  );

                })

              )}

            </div>

          </div>


          {/* ERROR MESSAGE */}

          {errorMessage && !isWon && (

            <div className="mt-3 text-center">

              <p className="text-xs sm:text-sm text-red-600 font-medium">
                ⚠️ {errorMessage}
              </p>

            </div>

          )}


          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mt-4">

            <button
              onClick={checkWin}
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-semibold text-sm transition-all shadow-md"
            >
              Check Solution
            </button>


            <button
              onClick={resetGame}
              className="w-full sm:w-auto px-5 py-2 bg-gray-600 hover:bg-gray-700 active:scale-95 text-white rounded-lg font-semibold text-sm transition-all shadow-md"
            >
              Reset Game
            </button>

          </div>

        </div>


        {/* SUCCESS */}

        {isWon && (

          <div className="mt-4 bg-green-50 border border-green-300 rounded-xl p-3 text-center shadow-md">

            <p className="text-sm sm:text-base font-bold text-green-700">
              🎉 Congratulations! You solved the Sudoku! 🎉
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default Sudoku;