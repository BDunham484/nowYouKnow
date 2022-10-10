

export function compareUsers(yourData, opponentData, questions) {
    console.log(questions)
    let yourQandA = yourData.me.currentGame.QandA;
    let opponentQandA = opponentData.user.currentGame.QandA;
    let username = yourData.me.username;
    let opponent = yourData.me.currentGame.opponent;
    // console.log('yourData!!!!');
    // console.log(yourQandA);
    // console.log('opponentData!!!!');
    // console.log(opponentQandA)
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
        question: []
    }
}