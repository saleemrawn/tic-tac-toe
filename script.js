const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let turnCount = 0;
  let isWinner = false;

  const getBoard = () => board;
  const addMarkToBoard = (position, mark) => board.splice(position, 1, mark);
  const resetBoardArr = () => (board = ["", "", "", "", "", "", "", "", ""]);
  const resetIsWinner = () => (isWinner = false);
  const resetTurnCount = () => (turnCount = 0);
  const resetGame = () => {
    resetBoardArr();
    resetIsWinner();
    resetTurnCount();
    playerOne.setHasWon(false);
    playerTwo.setHasWon(false);
    displayController.enableAllButtons();
    displayController.resetButtonText();
  };
  const increaseTurnCount = () => turnCount++;
  const checkWinner = () => {
    if (
      (board[0] === "X" && board[1] === "X" && board[2] === "X") ||
      (board[3] === "X" && board[4] === "X" && board[5] === "X") ||
      (board[6] === "X" && board[7] === "X" && board[8] === "X") ||
      (board[0] === "X" && board[3] === "X" && board[6] === "X") ||
      (board[1] === "X" && board[4] === "X" && board[7] === "X") ||
      (board[2] === "X" && board[5] === "X" && board[8] === "X") ||
      (board[0] === "X" && board[4] === "X" && board[8] === "X") ||
      (board[2] === "X" && board[4] === "X" && board[6] === "X")
    ) {
      playerOne.setHasWon(true);
      playerOne.incrementScore();
      displayController.updateScoreElement(1);
      return;
    }

    if (
      (board[0] === "O" && board[1] === "O" && board[2] === "O") ||
      (board[3] === "O" && board[4] === "O" && board[5] === "O") ||
      (board[6] === "O" && board[7] === "O" && board[8] === "O") ||
      (board[0] === "O" && board[3] === "O" && board[6] === "O") ||
      (board[1] === "O" && board[4] === "O" && board[7] === "O") ||
      (board[2] === "O" && board[5] === "O" && board[8] === "O") ||
      (board[0] === "O" && board[4] === "O" && board[8] === "O") ||
      (board[2] === "O" && board[4] === "O" && board[6] === "O")
    ) {
      playerTwo.setHasWon(true);
      playerTwo.incrementScore();
      displayController.updateScoreElement(2);
      return;
    }
  };

  const checkGameProgress = () => {
    checkWinner();

    if (playerOne.getHasWon() === true || playerTwo.getHasWon() === true) {
      const name = playerOne.getHasWon() === true ? playerOne.getName() : playerTwo.getName();

      displayController.disableAllButtons();
      displayController.handleAnnouncementEvent("Game Over!", name);
    }

    if (turnCount === 9 && playerOne.getHasWon() === false && playerTwo.getHasWon() === false) {
      displayController.disableAllButtons();
      displayController.handleAnnouncementEvent("Draw!");
    }
  };

  return {
    getBoard,
    addMarkToBoard,
    resetBoardArr,
    resetIsWinner,
    resetTurnCount,
    resetGame,
    increaseTurnCount,
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
    const addPlayerOneButton = document.querySelector(".add-player-button[data-player-number='1']");
    const addPlayerTwoButton = document.querySelector(".add-player-button[data-player-number='2']");
    const playerOneName = document.querySelector(".player-one-name");
    const playerTwoName = document.querySelector(".player-two-name");

    addPlayerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const playerNumber = event.target.getAttribute("data-player-number");
      const formData = new FormData(addPlayerForm);
      const name = formData.get("name");

      if (playerNumber === "1") {
        savePlayerOneName(name);
        resetForm();
        closeDialog();
        displayController.showElements(playerOneName);
        displayController.hideElements(addPlayerOneButton);
      }

      if (playerNumber === "2") {
        savePlayerTwoName(name);
        resetForm();
        closeDialog();
        displayController.showElements(playerTwoName);
        displayController.hideElements(addPlayerTwoButton);
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
      gameBoard.resetGame();
      closeAnnoucementDialog();
    });
  };

  const handleAnnouncementEvent = (status = "", player = "") => {
    showAnnoucementDialog();

    const statusTitle = document.querySelector(".status-title");
    const winnerName = document.querySelector(".winner-name");
    statusTitle.innerHTML = status;
    player === "" ? (winnerName.innerHTML = "") : (winnerName.innerHTML = `${player} wins!`);
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

  const updateScoreElement = (player) => {
    if (player !== 1 && player !== 2) {
      throw new Error(`Invalid argument: expected 1 or 2, but received ${player}.`);
    }

    if (player === 1) {
      const label = document.querySelector(".player-one-score-count");
      label.innerHTML = playerOne.getScore();
    }

    if (player === 2) {
      const label = document.querySelector(".player-two-score-count");
      label.innerHTML = playerTwo.getScore();
    }
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

  const hideElements = (...elements) => {
    elements.forEach((element) => {
      element.classList.add("hide");
    });
  };

  const showElements = (...elements) => {
    elements.forEach((element) => {
      element.classList.remove("hide");
    });
  };

  return {
    renderGameboard,
    handlePlayerMarkEvents,
    handlePlayAgainEvent,
    handleAddPlayerEvent,
    handleSaveDialogEvent,
    handleCancelDialogEvent,
    handleAnnouncementEvent,
    updateScoreElement,
    enableAllButtons,
    disableAllButtons,
    hideElements,
    showElements,
    resetButtonText,
  };
})();

function createPlayer(mark = "", turn = false) {
  const playerMark = mark;
  let playerName = "";
  let playerTurn = turn;
  let playerScore = 0;
  let hasWon = false;

  const getName = () => playerName;
  const setName = (name) => (playerName = name);
  const getMark = () => playerMark;
  const addMark = (position) => {
    gameBoard.addMarkToBoard(position, playerMark);
    gameBoard.increaseTurnCount();
    gameBoard.checkGameProgress();
  };

  const getScore = () => playerScore;
  const incrementScore = () => playerScore++;

  const getHasWon = () => hasWon;
  const setHasWon = (bool = false) => (hasWon = bool);

  const getPlayerTurn = () => playerTurn;
  const setPlayerTurn = (turn = false) => (playerTurn = turn);

  return {
    getName,
    setName,
    addMark,
    getMark,
    getScore,
    incrementScore,
    getHasWon,
    setHasWon,
    getPlayerTurn,
    setPlayerTurn,
  };
}

displayController.renderGameboard();
displayController.handlePlayerMarkEvents();
displayController.handleAddPlayerEvent();
displayController.handleSaveDialogEvent();
displayController.handleCancelDialogEvent();
displayController.handlePlayAgainEvent();

const playerOne = createPlayer("X", true);
const playerTwo = createPlayer("O", false);
