const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  const getBoardArr = () => board;
  const addMarkToBoardArr = (position, mark) => board.splice(position, 1, mark);
  const resetBoardArr = () => board.fill("");

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
          event.target.innerHTML = gameController.playerOne.getMark();
          event.target.setAttribute("disabled", "");
          event.target.classList.add("marked");
          gameController.playerOne.addMark(event.target.getAttribute("data-grid-number"));
          gameController.playerOne.setPlayerTurn(false);
          gameController.playerTwo.setPlayerTurn(true);
          displayCurrentTurn(2);
          return;
        }

        if (gameController.playerTwo.getPlayerTurn() === true) {
          event.target.innerHTML = gameController.playerTwo.getMark();
          event.target.setAttribute("disabled", "");
          event.target.classList.add("marked");
          gameController.playerTwo.addMark(event.target.getAttribute("data-grid-number"));
          gameController.playerTwo.setPlayerTurn(false);
          gameController.playerOne.setPlayerTurn(true);
          displayCurrentTurn(1);
          return;
        }
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
    const playerOneName = document.querySelector(".p1-name");
    const playerTwoName = document.querySelector(".p2-name");

    addPlayerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const playerNumber = event.target.getAttribute("data-player-number");
      const formData = new FormData(addPlayerForm);
      const name = formData.get("name");

      if (playerNumber === "1") {
        savePlayerName(1, name);
        resetForm();
        closeAddPlayerDialog();
        showElements(playerOneName);
        hideElements(addPlayerOneButton);
        gameController.playerTwo.getName() !== "" ? displayController.enableAllButtons() : -1;
      }

      if (playerNumber === "2") {
        savePlayerName(2, name);
        resetForm();
        closeAddPlayerDialog();
        showElements(playerTwoName);
        hideElements(addPlayerTwoButton);
        gameController.playerOne.getName() !== "" ? displayController.enableAllButtons() : -1;
      }

      if (gameController.playerOne.getName() !== "" && gameController.playerTwo.getName() !== "") displayCurrentTurn(1);
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

  const handleNewGameEvent = () => {
    const button = document.querySelector(".new-game-button");
    button.addEventListener("click", () => {
      window.location.reload();
    });
  };

  const savePlayerName = (playerNumber, name = "") => {
    if (playerNumber !== 1 && playerNumber !== 2) {
      throw new Error(`Invalid argument: expected 1 or 2, but received ${player}.`);
    }

    if (playerNumber === 1) {
      const playerOneName = document.querySelector(".p1-name");
      gameController.playerOne.setName(name);
      playerOneName.innerHTML = gameController.playerOne.getName();
    }

    if (playerNumber === 2) {
      const playerTwoName = document.querySelector(".p2-name");
      gameController.playerTwo.setName(name);
      playerTwoName.innerHTML = gameController.playerTwo.getName();
    }
  };

  const updateScoreElement = (playerNumber) => {
    if (playerNumber !== 1 && playerNumber !== 2) {
      throw new Error(`Invalid argument: expected 1 or 2, but received ${playerNumber}.`);
    }

    if (playerNumber === 1) {
      const label = document.querySelector(".p1-score-count");
      label.innerHTML = gameController.playerOne.getScore();
    }

    if (playerNumber === 2) {
      const label = document.querySelector(".p2-score-count");
      label.innerHTML = gameController.playerTwo.getScore();
    }
  };

  const setFormPlayerAttr = (playerNumber) => {
    const addPlayerForm = document.querySelector(".add-player-form");
    addPlayerForm.setAttribute("data-player-number", playerNumber);
  };

  const displayCurrentTurn = (playerNumber) => {
    const playerOneContainer = document.querySelector(".p1-info-container");
    const playerOneTurnLabel = document.querySelector(".p1-turn-label");
    const playerTwoContainer = document.querySelector(".p2-info-container");
    const playerTwoTurnLabel = document.querySelector(".p2-turn-label");

    if (playerNumber === 1) {
      playerOneContainer.classList.add("current-turn");
      playerOneTurnLabel.classList.remove("transparent");
      playerTwoTurnLabel.classList.add("transparent");
      playerTwoContainer.classList.remove("current-turn");
    }

    if (playerNumber === 2) {
      playerTwoContainer.classList.add("current-turn");
      playerTwoTurnLabel.classList.remove("transparent");
      playerOneTurnLabel.classList.add("transparent");
      playerOneContainer.classList.remove("current-turn");
    }
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

  const markAllBoardButtons = () => {
    const boardButtons = document.querySelectorAll(".board-button");
    boardButtons.forEach((button) => {
      button.classList.add("marked");
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

  const resetButtonStyle = () => {
    const boardButtons = document.querySelectorAll(".board-button");
    boardButtons.forEach((button) => {
      button.classList.remove("marked");
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

  const startGame = () => {
    renderGameboard();
    handlePlayerMarkEvents();
    handleAddPlayerEvent();
    handleSaveDialogEvent();
    handleCancelDialogEvent();
    handlePlayAgainEvent();
    handleNewGameEvent();
  };

  return {
    startGame,
    handleAnnouncementEvent,
    updateScoreElement,
    enableAllButtons,
    disableAllButtons,
    markAllBoardButtons,
    resetButtonText,
    resetButtonStyle,
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
      displayController.markAllBoardButtons();
      displayController.updateScoreElement(1);
      displayController.handleAnnouncementEvent("Game Over", playerOne.getName());
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
      displayController.markAllBoardButtons();
      displayController.updateScoreElement(2);
      displayController.handleAnnouncementEvent("Game Over", playerTwo.getName());
    }
  };

  const checkDraw = () => {
    if (turnCount === 9 && playerOne.getHasWon() === false && playerTwo.getHasWon() === false) {
      displayController.disableAllButtons();
      displayController.markAllBoardButtons();
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
    displayController.resetButtonStyle();
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

displayController.startGame();
