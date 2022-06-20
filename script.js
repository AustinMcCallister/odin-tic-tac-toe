const gameBoard = (() => {
  let _turnCount = 0;
  const _gameState = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const getTurnCount = () => _turnCount;
  const getGameState = () => _gameState;

  return {
    getTurnCount,
    getGameState,
  }
})();

const displayController = (() => {
  // DOM Cache
  const _board = document.querySelector('.game-container');

  return {

  }
})();

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
