const scoreTable = {
   "Lielais": {
    "Uzvara":              { self: 2, others: -1 },
    "Uzvara Jaņi":         { self: 4, others: -2 },
    "Uzvara Bezstiķis":    { self: 6, others: -3 },
    "Zaudējums":           { self: -4, others: 2 },
    "Zaudējums Jaņi":      { self: -6, others: 3 },
    "Zaudējums Bezstiķis": { self: -8, others: 4 },
  },
  "Zole": {
    "Zole Uzvara":              { self: 12, others: -6 },
    "Zole Uzvara Jaņi":         { self: 14, others: -7 },
    "Zole Uzvara Bezstiķis":    { self: 16, others: -8 },
    "Zole Zaudējums":           { self: -14, others: 7 },
    "Zole Zaudējums Jaņi":      { self: -16, others: 8 },
    "Zole Zaudējums Bezstiķis": { self: -18, others: 9 },
  },
  "Mazā Zole": {
    "Mazā Zole Uzvara":    { self: 12, others: -6 },
    "Mazā Zole Zaudējums": { self: -14, others: 7 },
    }
  };
  
  function updateOthers(players, chosenIndex, points) {
    players.forEach((player, index) => {
      if (index !== chosenIndex) {
        player.score += points;
      }
    });
  }
  
  const gameLogic3 = {
    calculateScores: (players, choice, result, chosenPlayerIndex) => {
      const chosenPlayer = players[chosenPlayerIndex];
      const category = choice.trim();
      const scoreData = scoreTable[category]?.[result];
  
      if (!scoreData) {
        console.warn(`Neatpazīts rezultāts: ${result} pie izvēles ${choice}`);
        return;
      }
  
      chosenPlayer.score += scoreData.self;
      updateOthers(players, chosenPlayerIndex, scoreData.others);
    }
  };
  
  export default gameLogic3;
  