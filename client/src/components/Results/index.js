import React from "react";
import './Results.scss';

const Results = ({finalGameResults}) => {
    const { username, opponent, yourScore, opponentScore, winner, questionsArray } = finalGameResults

    return (
        <div>
            <div className="results">
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
                <h3>Your final score: {yourScore}</h3>
                <h3>{opponent}'s final score: {opponentScore}</h3>
                <div className="result-titles">
                    <h3 id="Qs">Questions:</h3>
                    <h3 id="yours">Your Responses:</h3>
                    <h3 id="theirs">Their Responses:</h3>
                </div>
                {questionsArray.map((question, index) => (
                    <div className="responses" key={index}>
                        <span className="questions">
                            <p>{question.questionBody}</p>
                        </span>
                        <div className="their-responses">
                            <span className="your-ans">
                                <h4>Your Answer:</h4> 
                                <p>{question.yourAnswer}</p>
                            </span>
                            <span className="their-guess">
                                <h4>Their Guess:</h4> 
                                <p>{question.opponentGuess}</p>
                            </span>
                        </div>
                        <div className="your-responses">
                            <span className="their-ans">
                                <h4>Their Answer: </h4>
                                <p>{question.opponentAnswer}</p>
                            </span>
                            <span className="your-guess">
                                <h4>Your Guess: </h4>
                                <p>{question.yourGuess}</p>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;