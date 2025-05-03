const scoreTable = {
    "Lielais": {
      "Uzvara":              { self: 3, others: -1 },
      "Uzvara Jaņi":         { self: 6, others: -2 },
      "Uzvara Bezstiķis":    { self: 9, others: -3 },
      "Zaudējums":           { self: -6, others: 2 },
      "Zaudējums Jaņi":      { self: -9, others: 3 },
      "Zaudējums Bezstiķis": { self: -12, others: 4 },
    },
    "Zole": {
      "Zole Uzvara":              { self: 18, others: -6 },
      "Zole Uzvara Jaņi":         { self: 21, others: -7 },
      "Zole Uzvara Bezstiķis":    { self: 24, others: -8 },
      "Zole Zaudējums":           { self: -21, others: 7 },
      "Zole Zaudējums Jaņi":      { self: -24, others: 8 },
      "Zole Zaudējums Bezstiķis": { self: -27, others: 9 },
    },
    "Mazā Zole": {
      "Mazā Zole Uzvara":    { self: 18, others: -6 },
      "Mazā Zole Zaudējums": { self: -21, others: 7 },
    }
  };
  
  function updateOthers(players, chosenIndex, points) {
    players.forEach((player, index) => {
      if (index !== chosenIndex) {
        player.score += points;
      }
    });
  }
  
  const gameLogic4 = {
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
  
  export default gameLogic4;
  