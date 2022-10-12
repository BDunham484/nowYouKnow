import React from "react";

const Results = ({finalGameResults}) => {
    const { username, opponent, yourScore, opponentScore, winner, questionsArray } = finalGameResults

    return (
        <div>
            <div>
                <h2>Your results with {opponent}...
                {winner === "It's a tie!!" ? (<span>{winner}</span>) : (
                <>
                    {winner === username ? (
                        <span>you won</span>
                    ):(
                        <span>{winner} won</span>
                    )}
                </>
                )}</h2>
                <h3>Your final score: {yourScore}. {opponent}'s final score: {opponentScore}</h3>
                {questionsArray.map((question, index) => (
                    <div key={index}>
                        Question: {question.questionBody}
                        <div>
                            <span>
                                Your Answer: {question.yourAnswer}
                            </span>
                            <span>
                                Opponent's Guess: {question.opponentGuess}
                            </span>
                        </div>
                        <div>
                            <span>
                                Opponent's Answer: {question.opponentAnswer}
                            </span>
                            <span>
                                Your Guess: {question.yourGuess}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;