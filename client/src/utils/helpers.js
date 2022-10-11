
//helper function that takes players data and the questions to output the game model
export function compareUsers(yourData, opponentData, questions) {
    let yourQandA = yourData.me.currentGame.QandA;
    let opponentQandA = opponentData.user.currentGame.QandA;
    let username = yourData.me.username;
    let opponent = yourData.me.currentGame.opponent;
    var winner = '';
    let yourScore = 0;
    let opponentScore = 0;
    let questionArray = [];
    yourQandA.map((answer, index) => {
        if (answer.yourAnswer === opponentQandA[index].yourGuess) {
            opponentScore++
        } 
        
        if (answer.yourGuess === opponentQandA[index].yourAnswer){
            yourScore++  
        }

        const questionModel = {
            'questionBody': questions[index],
            'yourAnswer': answer.yourAnswer,
            'opponentAnswer': opponentQandA[index].yourAnswer,
            'yourGuess': answer.yourGuess,
            'opponentGuess': opponentQandA[index].yourGuess
        }
        questionArray.push(questionModel);
    })

    if (yourScore > opponentScore) {
        var winner = username;
    } else if (yourScore < opponentScore) {
        var winner = opponent;
    } else {
        var winner = "It's a tie!!";
    }

    return {
        username: username,
        opponent: opponent,
        yourScore: yourScore,
        opponentScore: opponentScore,
        winner: winner,
        question: questionArray
    }
}

