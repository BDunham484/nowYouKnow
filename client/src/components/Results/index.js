import React, { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { compareUsers } from '../../utils/helpers';
import { questions } from '../../assets/variables/questions'



const Results = () => {

    const { loading, data: myData } = useQuery(GET_ME);
    const [GameData, setGameData] = useState({username: '', opponent: '', QandA: [], opponentQandA: [], category: ''})
    const { username, opponent, QandA, opponentQandA, category } = GameData
    const [finalGame, setFinalGame] = useState({username: '', opponent: '', yourScore: '', opponentScore: '', winner: '', question: []})
    const { username: finalUsername, opponent: finalOpponent, yourScore, opponentScore, winner, questionsArray } = finalGame

    useEffect(() => {
    if(!loading) {
        setGameData({
            ...GameData,
            username: myData.me.username,
            opponent: myData.me.currentGame.opponent,
            QandA: myData.me.currentGame.QandA,
            opponentQandA: myData.me.currentGame.opponentQandA,
            category: myData.me.currentGame.category
        })
      }
    }, [loading])

      useEffect(() => {
        if(username) {
            const yourData = {
                        QandA: QandA,
                        opponentQandA: opponentQandA,
                        opponent: opponent,
                        username: username,
                        questions: questions[category]
            }
            const finalResults = compareUsers(yourData)
            setFinalGame({
                ...finalGame,
                username: finalResults.username,
                opponent: finalResults.opponent,
                yourScore: finalResults.yourScore,
                opponentScore: finalResults.opponentScore,
                winner: finalResults.winner,
                questionsArray: finalResults.question
            })
        }
      }, [GameData])

    return (
        <div>
            {!finalUsername ? (
                <p>loading...</p>
            ) : (
                <>
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
                        {questionsArray.map(question => (
                            <div>
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
                                        Your Guess: {question.yourQuess}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
};

export default Results;