const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoardArr = () => board;
  const addMarkToBoardArr = (position, mark) => board.splice(position, 1, mark);
  const resetBoardArr = () => (board = ["", "", "", "", "", "", "", "", ""]);

  return {
    getBoardArr,
    addMarkToBoardArr,
    resetBoardArr,
  };
})();

const displayController = (function () {
  const board = gameBoard.getBoardArr();

  const renderGameboard = () => {
    const container = document.querySelector(".gameboard-container");
    board.forEach((mark, index) => {
      container.insertAdjacentHTML(
        "beforeend",
        `<button class="board-button" data-grid-number="${index}" disabled>${mark}</button>`
      );
    });
  };

  const handlePlayerMarkEvents = () => {
    const boardButtons = document.querySelectorAll(".board-button");

    boardButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        if (gameController.playerOne.getPlayerTurn() === true) {
          gameController.playerOne.addMark(event.target.getAttribute("data-grid-number"));
          event.target.innerHTML = gameController.playerOne.getMark();
          event.target.setAttribute("disabled", "");
          gameController.playerOne.setPlayerTurn(false);
          gameController.playerTwo.setPlayerTurn(true);
          return;
        }

        gameController.playerTwo.addMark(event.target.getAttribute("data-grid-number"));
        event.target.innerHTML = gameController.playerTwo.getMark();
        event.target.setAttribute("disabled", "");
        gameController.playerTwo.setPlayerTurn(false);
        gameController.playerOne.setPlayerTurn(true);
      });
    });
  };

  const handleAddPlayerEvent = () => {
    const addPlayerButtons = document.querySelectorAll(".add-player-button");
    addPlayerButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const playerNumber = event.target.getAttribute("data-player-number");
        showAddPlayerDialog();
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
        savePlayerName(1, name);
        resetForm();
        closeAddPlayerDialog();
        displayController.showElements(playerOneName);
        displayController.hideElements(addPlayerOneButton);
        gameController.playerTwo.getName() !== "" ? displayController.enableAllButtons() : -1;
      }

      if (playerNumber === "2") {
        savePlayerName(2, name);
        resetForm();
        closeAddPlayerDialog();
        displayController.showElements(playerTwoName);
        displayController.hideElements(addPlayerTwoButton);
        gameController.playerOne.getName() !== "" ? displayController.enableAllButtons() : -1;
      }
    });
  };

  const handleCancelDialogEvent = () => {
    const cancelButton = document.querySelector(".cancel-button");
    cancelButton.addEventListener("click", () => {
      resetForm();
      closeAddPlayerDialog();
    });
  };

  const handlePlayAgainEvent = () => {
    const playAgainButton = document.querySelector(".play-again-button");
    playAgainButton.addEventListener("click", () => {
      gameController.resetGame();
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

  const savePlayerName = (playerNumber = 0, name = "") => {
    if (playerNumber !== 1 && playerNumber !== 2) {
      throw new Error(`Invalid argument: expected 1 or 2, but received ${player}.`);
    }

    if (playerNumber === 1) {
      const playerOneName = document.querySelector(".player-one-name");
      gameController.playerOne.setName(name);
      playerOneName.innerHTML = gameController.playerOne.getName();
    }

    if (playerNumber === 2) {
      const playerTwoName = document.querySelector(".player-two-name");
      gameController.playerTwo.setName(name);
      playerTwoName.innerHTML = gameController.playerTwo.getName();
    }
  };

  const updateScoreElement = (playerNumber) => {
    if (playerNumber !== 1 && playerNumber !== 2) {
      throw new Error(`Invalid argument: expected 1 or 2, but received ${playerNumber}.`);
    }

    if (playerNumber === 1) {
      const label = document.querySelector(".player-one-score-count");
      label.innerHTML = gameController.playerOne.getScore();
    }

    if (playerNumber === 2) {
      const label = document.querySelector(".player-two-score-count");
      label.innerHTML = gameController.playerTwo.getScore();
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

  const showAddPlayerDialog = () => {
    const addPlayerDialog = document.querySelector(".add-player-dialog");
    addPlayerDialog.show();
  };

  const closeAddPlayerDialog = () => {
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

const gameController = (function () {
  const playerOne = createPlayer("X", true);
  const playerTwo = createPlayer("O", false);
  let turnCount = 0;

  const resetTurnCount = () => (turnCount = 0);
  const increaseTurnCount = () => turnCount++;

  const checkPlayerOneWin = () => {
    const board = gameBoard.getBoardArr();

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
      displayController.disableAllButtons();
      displayController.updateScoreElement(1);
      displayController.handleAnnouncementEvent("Game Over!", playerOne.getName());
    }
  };

  const checkPlayerTwoWin = () => {
    const board = gameBoard.getBoardArr();

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
      displayController.disableAllButtons();
      displayController.updateScoreElement(2);
      displayController.handleAnnouncementEvent("Game Over!", playerTwo.getName());
    }
  };

  const checkDraw = () => {
    if (turnCount === 9 && playerOne.getHasWon() === false && playerTwo.getHasWon() === false) {
      displayController.disableAllButtons();
      displayController.handleAnnouncementEvent("Draw!");
    }
  };

  const checkGameProgress = () => {
    checkPlayerOneWin();
    checkPlayerTwoWin();
    checkDraw();
  };

  const resetGame = () => {
    resetTurnCount();
    playerOne.setHasWon(false);
    playerTwo.setHasWon(false);
    gameBoard.resetBoardArr();
    displayController.enableAllButtons();
    displayController.resetButtonText();
  };

  return { playerOne, playerTwo, increaseTurnCount, checkGameProgress, resetGame };
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
    gameBoard.addMarkToBoardArr(position, playerMark);
    gameController.increaseTurnCount();
    gameController.checkGameProgress();
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
