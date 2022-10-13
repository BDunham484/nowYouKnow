
import React, { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { compareUsers } from '../utils/helpers';
import { questions } from '../assets/variables/questions'
import Results from '../components/Results'

const GameResults = () => {

    const { loading, data: myData } = useQuery(GET_ME);
    const [GameData, setGameData] = useState({username: '', opponent: '', QandA: [], opponentQandA: [], category: ''})
    const { username, opponent, QandA, opponentQandA, category } = GameData
    const [finalGame, setFinalGame] = useState({username: '', opponent: '', yourScore: '', opponentScore: '', winner: '', question: []})

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
      <>
      {finalGame.username && (
      <Results 
        finalGameResults = {finalGame}/>)}
      </>
    )
};

export default GameResults;