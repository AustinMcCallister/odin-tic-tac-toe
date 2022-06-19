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
