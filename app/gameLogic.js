const gameLogic = {
    claculateScores: (player, choice, result) => {
        const scoreChanges = { "Lielais": 3, "Zole": 18, "Maza zole": 18};
        const lossPenalty = { "Lielais": -6, "Zole": -21, "Maza zole": -21};
        const specialWinBonus = { "Jani": 3, "Beztikis": 6};
        const specialLossPenalty = { "Jani": -3, "Beztikis": -6};

        //
        if(choice === "Lielais") {
            switch (result){
                case "Win Basic":
                    return player.score += 3;
                case "Win Jani":
                    return player.score += 6;
                case "Win Bezstikis":
                    return player.score += 9;
                case "Loss":
                    return player.score -= 6;
                case "Loss Jani":
                    return player.score -= 9;
                case "Loss Bezstikis":
                    return player.score -= 12;
            }
        }

        if(choice === "Zole") {
            switch (result){
                case "Zole Win Basic":
                    return player.score += 18;
                case "Zole Win Jani":
                    return player.score += 21;
                case "Zole Win Bezstikis":
                    return player.score += 24;
                case "Zole Loss":
                    return player.score -= 21;
                case "Zole Loss Jani":
                    return player.score -= 24;
                case "Zole Loss Bezstikis":
                    return player.score -= 27;
            }
        }

        if(choice === "Maza zole") {
            if(result === "Maza zole Win"){
                return player.score += 18;
            } else if(result === "Maza zole Loss"){
                return player.score -= 21;
            }
        }

        if(choice === "Galds"){
            if(result === "Lose"){
                return player.score -= 6;
            }
        }

    }
}