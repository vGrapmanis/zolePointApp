const gameLogic = {
    calculateScores: (players, choice, result, chosenPlayerIndex) => {
        const chosenPlayer = players[chosenPlayerIndex];

        if(choice === "Lielais") {
            switch (result){
                case "Win Basic":
                    chosenPlayer.score += 3;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score -= 1;
                        }
                    });
                    break;
                case "Win Jani":
                    chosenPlayer.score += 6;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score -= 2;
                        }
                    });
                    break;
                case "Win Bezstikis":
                    chosenPlayer.score += 9;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score -= 3;
                        }
                    });
                    break;
                case "Loss Basic":
                    chosenPlayer.score -= 6;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score += 2;
                        }
                    });
                    break;
                case "Loss Jani":
                    chosenPlayer.score -= 9;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score += 3;
                        }
                    });
                    break;
                case "Loss Bezstikis":
                    chosenPlayer.score -= 12;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score += 4;
                        }
                    });
                    break;
            }
        }

        if(choice === "Zole") {
            switch (result){
                case "Zole Win Basic":
                    chosenPlayer.score += 18;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score -= 6;
                        }
                    });
                    break;
                case "Zole Win Jani":
                    chosenPlayer.score += 21;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score -= 7;
                        }
                    });
                    break;
                case "Zole Win Bezstikis":
                    chosenPlayer.score += 24;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score -= 8;
                        }
                    });
                    break;
                case "Zole Loss Basic":
                    chosenPlayer.score -= 21;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score += 7;
                        }
                    });
                    break;
                case "Zole Loss Jani":
                    chosenPlayer.score -= 24;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score += 8;
                        }
                    });
                    break;
                case "Zole Loss Bezstikis":
                    chosenPlayer.score -= 27;
                    players.forEach((player, index) => {
                        if(index !== chosenPlayerIndex){
                            player.score += 9;
                        }
                    });
                    break;
            }
        }

        if(choice === "Maza zole") {
            if(result === "Maza zole Win"){
                chosenPlayer.score += 18;
                players.forEach((player, index) => {
                    if(index !== chosenPlayerIndex){
                        player.score -= 6;
                    }
                });
            } else if(result === "Maza zole Loss"){
                chosenPlayer.score -= 21;
                players.forEach((player, index) => {
                    if(index !== chosenPlayerIndex){
                        player.score += 7;
                    }
                });
            }
        }
// šeit zaudētaju nosaka pēc spēles. zaudētājs -6, pārējie +2
        // if(choice === "Galds"){
        //     if(result === "Lose"){
        //         return player.score -= 6;
        //     }
        // }

    }
}

export default gameLogic;