// helper function that takes players data and the questions to output the game model
export function compareUsers(yourData) {
    let yourQandA = yourData.QandA;
    let opponentQandA = yourData.opponentQandA;
    let username = yourData.username;
    let opponent = yourData.opponent;
    let winner;
    let yourScore = 0;
    let opponentScore = 0;
    let questionArray = [];
    const questions = yourData.questions
    let youCorrect
    let opponentCorrect
    yourQandA.forEach((answer, index) => {
        if (answer.yourAnswer.toLowerCase().trim() === opponentQandA[index].opponentGuess.toLowerCase().trim()) {
            opponentScore++
            opponentCorrect = true;
        } else {
            opponentCorrect = false
        }
        
        if (answer.yourGuess.toLowerCase().trim() === opponentQandA[index].opponentAnswer.toLowerCase().trim()){
            yourScore++  
            youCorrect = true
        } else {
            youCorrect = false
        }

        const questionModel = {
            'questionBody': questions[index],
            'yourAnswer': answer.yourAnswer,
            'opponentAnswer': opponentQandA[index].opponentAnswer,
            'yourGuess': answer.yourGuess,
            'opponentGuess': opponentQandA[index].opponentGuess,
            'youCorrect': youCorrect,
            'opponentCorrect': opponentCorrect
        }
        questionArray.push(questionModel);
    })

    if (yourScore > opponentScore) {
        winner = username;
    } else if (yourScore < opponentScore) {
        winner = opponent;
    } else {
        winner = "It's a tie!!";
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

