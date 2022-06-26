const gameBoard = (() => {
  const lockBoard = () => {
    const modules = document.querySelectorAll('.board-module');
    modules.forEach(module => {
      module.removeEventListener('mousedown', resolveChoice);
      if (!module.classList.contains('taken')) {
        module.classList.add('taken');
      }
    });
  };

  const resolveChoice = (event) => {
    const x = event.target.dataset.x;
    const y = event.target.dataset.y;
    gameController.takeTurn(x, y);
  };

  const reset = () => {
    gameController.getGameState().forEach(e => {
      e.forEach((f, i) => {
        e[i] = null;
      });
    });
    gameController.setTurnCount(0);
    displayController.destroy();
    displayController.draw();
  };

  return {
    lockBoard,
    resolveChoice,
    reset,
  }
})();

const gameController = (() => {
  let _turnCount = 0;
  const _gameState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const Player = (name) => {
    let _name = name;
    let _score = 0;
  
    const getName = () => _name;
    const setName = (name) => _name = name;
  
    const getScore = () => _score;
    const setScore = (score) => _score = score;
  
    return {
      getName,
      setName,
      getScore,
      setScore,
    };
  };

  const takeTurn = (x, y) => {
    // X always goes on even turns, starting from 0
    if (_turnCount % 2 === 0) {
      _gameState[x][y] = 0;
    }
    else {
      _gameState[x][y] = 1;
    }
    displayController.destroy();
    displayController.draw();
    const winState = _checkVictory();
    if (winState > 0) {
      if (winState == 1) {
        console.log('You win');
      }
      else {
        console.log('Draw');
      }
      gameBoard.lockBoard();
    }
    _turnCount++;
  };

  const _checkVictory = () => {
    // 0 = false, 1 = true, 2 = draw
    let win = 0;
    // Check horizontal
    _gameState.forEach(e => {
      if (e[0] !== null) {
        if (e[0] === e[1] && e[1] === e[2]) {
          return (win = 1);
        }
      }
    });
    // Check vertical
    _gameState[0].forEach((e, i) => {
      if (e !== null) {
        if (e === _gameState[1][i] && _gameState[1][i] === _gameState[2][i]) {
          return (win = 1);
        }
      }
    });
    // Check diagonals
    if (_gameState[0][0] !== null) {
      if (_gameState[0][0] === _gameState[1][1] && _gameState[1][1] === _gameState[2][2]) {
        return (win = 1);
      }
    }
    if (_gameState[0][2] !== null) {
      if (_gameState[0][2] === _gameState[1][1] && _gameState[1][1] === _gameState[2][0]) {
        return (win = 1);
      }
    }
    // Check draw
    if (_turnCount >= 8 && win == 0) {
      return (win = 2);
    }
    return win;
  };

  const getTurnCount = () => _turnCount;
  const setTurnCount = (turnCount) => _turnCount = turnCount;
  
  const getGameState = () => _gameState;

  return {
    getTurnCount,
    setTurnCount,
    getGameState,
    takeTurn,
  }
})();

const displayController = (() => {
  // DOM Cache
  const _board = document.querySelector('.game-container');

  const _bindEvent = (e) => {
    e.addEventListener('mousedown', gameBoard.resolveChoice);
  };

  const _drawX = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('viewBox', '0 0 24 24');
    path.setAttribute('fill', '#3B4252');
    path.setAttribute('d', 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z');
    svg.appendChild(path);
    return svg;
  };

  const _drawO = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('viewBox', '-3.1 -3 30 30');
    path.setAttribute('fill', '#3B4252');
    path.setAttribute('d', 'M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z');
    svg.appendChild(path);
    return svg;
  };

  const draw = () => {
    // Use document fragment to minimize DOM manipulations
    const docFrag = document.createDocumentFragment();
    gameController.getGameState().forEach((e, i) => {
      e.forEach((e, j) => {
        const container = document.createElement('div');
        const module = document.createElement('div');
        container.classList.add('board-module-container');
        module.classList.add('board-module');
        // Use i and j to track row and column coordinates of each module
        module.dataset.x = i;
        module.dataset.y = j;
        // null = empty, 0 = X, 1 = O
        if (e === null) {
          _bindEvent(module);
        }
        else if (e === 0) {
          module.appendChild(_drawX());
          module.classList.add('taken');
        }
        else if (e === 1) {
          module.appendChild(_drawO());
          module.classList.add('taken');
        }
        container.appendChild(module);
        docFrag.appendChild(container);
      });
    });
    _board.appendChild(docFrag);
  }

  const destroy = () => {
    while (_board.firstChild) {
      _board.removeChild(_board.firstChild);
    }
  }

  draw();

  return {
    draw,
    destroy,
  }
})();
