const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let turnCount = 0;
  let isWinner = false;

  const getBoard = () => board;
  const addMarkToBoard = (position, mark) => board.splice(position, 1, mark);
  const resetBoardArr = () => (board = ["", "", "", "", "", "", "", "", ""]);
  const resetIsWinner = () => (isWinner = false);
  const resetTurnCount = () => (turnCount = 0);
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

  return {
    addMarkToBoard,
    resetBoardArr,
    resetIsWinner,
    resetTurnCount,
    increaseTurnCount,
    getBoard,
    checkGameProgress,
  };
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
        const playerNumber = event.target.getAttribute("data-player-number");
        showDialog();
        setFormPlayerAttr(playerNumber);
      });
    });
  };

  const handleSaveDialogEvent = () => {
    const addPlayerForm = document.querySelector(".add-player-form");
    addPlayerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const playerNumber = event.target.getAttribute("data-player-number");
      const formData = new FormData(addPlayerForm);
      const name = formData.get("name");

      if (playerNumber === "1") {
        savePlayerOneName(name);
        resetForm();
        closeDialog();
      }

      if (playerNumber === "2") {
        savePlayerTwoName(name);
        resetForm();
        closeDialog();
      }
    });
  };

  const handleCancelDialogEvent = () => {
    const cancelButton = document.querySelector(".cancel-button");
    cancelButton.addEventListener("click", () => {
      resetForm();
      closeDialog();
    });
  };

  const handlePlayAgainEvent = () => {
    const playAgainButton = document.querySelector(".play-again-button");
    playAgainButton.addEventListener("click", () => {
      resetGame();
    });
  };

  const savePlayerOneName = (name) => {
    const playerOneName = document.querySelector(".player-one-name");
    playerOne.setName(name);
    playerOneName.innerHTML = playerOne.getName();
  };

  const savePlayerTwoName = (name) => {
    const playerTwoName = document.querySelector(".player-two-name");
    playerTwo.setName(name);
    playerTwoName.innerHTML = playerTwo.getName();
  };

  const setFormPlayerAttr = (playerNumber) => {
    const addPlayerForm = document.querySelector(".add-player-form");
    addPlayerForm.setAttribute("data-player-number", playerNumber);
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

  const showAnnoucementDialog = () => {
    const annoucementDialog = document.querySelector(".announcement-dialog");
    annoucementDialog.show();
  };

  const closeAnnoucementDialog = () => {
    const annoucementDialog = document.querySelector(".announcement-dialog");
    annoucementDialog.close();
  };

  const resetButtonText = () => {
    const boardButtons = document.querySelectorAll(".board-button");
    boardButtons.forEach((button) => {
      button.innerHTML = "";
    });
  };

  const resetForm = () => {
    const addPlayerForm = document.querySelector(".add-player-form");
    addPlayerForm.reset();
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
    handleSaveDialogEvent,
    handleCancelDialogEvent,
    enableAllButtons,
    disableAllButtons,
    resetGame,
  };
})();

function createPlayer(mark = "", turn = false) {
  const playerMark = mark;
  let playerName = "";
  let playerTurn = turn;

  const getName = () => playerName;
  const setName = (name) => (playerName = name);
  const getMark = () => playerMark;
  const addMark = (position) => {
    gameBoard.addMarkToBoard(position, playerMark);
    gameBoard.increaseTurnCount();
    gameBoard.checkGameProgress(playerName);
  };

  const getPlayerTurn = () => playerTurn;
  const setPlayerTurn = (turn = false) => (playerTurn = turn);

  return { getName, setName, addMark, getMark, getPlayerTurn, setPlayerTurn };
}

displayController.renderGameboard();
displayController.handlePlayerMarkEvents();
displayController.handleAddPlayerEvent();
displayController.handleSaveDialogEvent();
displayController.handleCancelDialogEvent();

const playerOne = createPlayer("X", true);
const playerTwo = createPlayer("O", false);
