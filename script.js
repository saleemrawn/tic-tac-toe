const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];
  let turnCount = 0;
  let isWinner = false;

  const getBoard = () => board;
  const addMarkToBoard = (position, mark) => board.splice(position, 1, mark);
  const increaseTurnCount = () => turnCount++;
  const checkWinner = (player) => {
    if (
      (board[0] === "X" && board[1] === "X" && board[2] === "X") ||
      (board[3] === "X" && board[4] === "X" && board[5] === "X") ||
      (board[6] === "X" && board[7] === "X" && board[8] === "X") ||
      (board[0] === "X" && board[3] === "X" && board[6] === "X") ||
      (board[1] === "X" && board[4] === "X" && board[7] === "X") ||
      (board[2] === "X" && board[5] === "X" && board[8] === "X") ||
      (board[0] === "X" && board[4] === "X" && board[8] === "X") ||
      (board[2] === "X" && board[4] === "X" && board[6] === "X") ||
      (board[0] === "O" && board[1] === "O" && board[2] === "O") ||
      (board[3] === "O" && board[4] === "O" && board[5] === "O") ||
      (board[6] === "O" && board[7] === "O" && board[8] === "O") ||
      (board[0] === "O" && board[3] === "O" && board[6] === "O") ||
      (board[1] === "O" && board[4] === "O" && board[7] === "O") ||
      (board[2] === "O" && board[5] === "O" && board[8] === "O") ||
      (board[0] === "O" && board[4] === "O" && board[8] === "O") ||
      (board[2] === "O" && board[4] === "O" && board[6] === "O")
    ) {
      isWinner = true;
      alert(`${player} wins! Game over!`);
    }
  };

  const checkDraw = () => {
    if (turnCount === 9 && isWinner === false) alert("Draw!");
  };

  return { addMarkToBoard, increaseTurnCount, getBoard, checkWinner, checkDraw };
})();

function createPlayer(name = "", mark = "") {
  const playerName = name;
  const playerMark = mark;

  const getName = () => playerName;
  const addMark = (position) => {
    gameBoard.addMarkToBoard(position, playerMark);
    gameBoard.increaseTurnCount();
    gameBoard.checkWinner(playerName);
    gameBoard.checkDraw();
  };

  return { getName, addMark };
}
