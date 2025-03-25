const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let turnCount = 0;
  let isWinner = false;

  const getBoard = () => board;
  const addMarkToBoard = (position, mark) => board.splice(position, 1, mark);
  const resetBoardArr = () => (board = ["", "", "", "", "", "", "", "", ""]);
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
      displayController.disableAllButtons();
      return `${player} wins! Game over!`;
    }
  };

  const checkDraw = () => {
    if (turnCount === 9 && isWinner === false) {
      displayController.disableAllButtons();
      return "Draw!";
    }
  };

  const checkGameProgress = (player) => {
    const status = checkWinner(player) || checkDraw();
    return status;
  };

  return { addMarkToBoard, resetBoardArr, increaseTurnCount, getBoard, checkGameProgress };
})();

const displayController = (function () {
  const board = gameBoard.getBoard();

  const renderGameboard = () => {
    const container = document.querySelector(".gameboard-container");

    board.forEach((mark, index) => {
      container.insertAdjacentHTML(
        "beforeend",
        `<button class="board-button" data-grid-number="${index}">${mark}</button>`
      );
    });
  };

  const handlePlayerMarkEvents = () => {
    const boardButtons = document.querySelectorAll(".board-button");

    boardButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        if (playerOne.getPlayerTurn() === true) {
          playerOne.addMark(event.target.getAttribute("data-grid-number"));
          event.target.innerHTML = playerOne.getMark();
          event.target.setAttribute("disabled", "");
          playerOne.setPlayerTurn(false);
          playerTwo.setPlayerTurn(true);
          return;
        }

        playerTwo.addMark(event.target.getAttribute("data-grid-number"));
        event.target.innerHTML = playerTwo.getMark();
        event.target.setAttribute("disabled", "");
        playerTwo.setPlayerTurn(false);
        playerOne.setPlayerTurn(true);
      });
    });
  };

  const handleAddPlayerEvent = () => {
    const addPlayerButtons = document.querySelectorAll(".add-player-button");
    addPlayerButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const playerType = event.target.getAttribute("data-player");
        showDialog(playerType);
      });
    });
  };

  const handlePlayAgainEvent = () => {
    const playAgainButton = document.querySelector(".play-again-button");
    playAgainButton.addEventListener("click", () => {
      resetGame();
    });
  };

  const enableAllButtons = () => {
    const boardButtons = document.querySelectorAll(".board-button");
    boardButtons.forEach((button) => {
      button.removeAttribute("disabled");
    });
  };

  const disableAllButtons = () => {
    const boardButtons = document.querySelectorAll(".board-button");
    boardButtons.forEach((button) => {
      button.setAttribute("disabled", "");
    });
  };

  const showDialog = () => {
    const addPlayerDialog = document.querySelector(".add-player-dialog");
    addPlayerDialog.show();
  };

  const closeDialog = () => {
    const addPlayerDialog = document.querySelector(".add-player-dialog");
    addPlayerDialog.close();
  };

  const resetButtonText = () => {
    const boardButtons = document.querySelectorAll(".board-button");
    boardButtons.forEach((button) => {
      button.innerHTML = "";
    });
  };

  const resetGame = () => {
    gameBoard.resetBoardArr();
    enableAllButtons();
    resetButtonText();
  };

  return {
    renderGameboard,
    handlePlayerMarkEvents,
    handlePlayAgainEvent,
    handleAddPlayerEvent,
    enableAllButtons,
    disableAllButtons,
    resetGame,
  };
})();

function createPlayer(name = "", mark = "", turn = false) {
  const playerName = name;
  const playerMark = mark;
  let playerTurn = turn;

  const getName = () => playerName;
  const getMark = () => playerMark;
  const addMark = (position) => {
    gameBoard.addMarkToBoard(position, playerMark);
    gameBoard.increaseTurnCount();
    gameBoard.checkGameProgress(playerName);
  };

  const getPlayerTurn = () => playerTurn;
  const setPlayerTurn = (turn = false) => (playerTurn = turn);

  return { getName, addMark, getMark, getPlayerTurn, setPlayerTurn };
}

displayController.renderGameboard();
displayController.handlePlayerMarkEvents();
displayController.handleAddPlayerEvent();

const playerOne = createPlayer("John", "X", true);
const playerTwo = createPlayer("Alicia", "O", false);
