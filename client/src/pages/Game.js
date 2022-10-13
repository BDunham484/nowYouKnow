import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { LEAVE_GAME, SUBMIT_ANSWERS, LEAVE_GAME_ME } from '../utils/mutations';
import { GET_ME, GET_USER_INFO } from '../utils/queries'
import { questions } from '../assets/variables/questions'


const Game = () => {
  const answersRef = useRef([])
  const guessesRef = useRef([])

  const [GameInfo, SetGameInfo] = useState({category: '', opponent: '', categoryQuestions: [], answersSubmitted: false })
  const { category, opponent, categoryQuestions, answersSubmitted } = GameInfo

  const { loading, data: myData } = useQuery(GET_ME, {
    pollInterval: 1000
  })
  const { loading: loadingUser, data } = useQuery(GET_USER_INFO, {
    variables: { username: opponent },
    skip: !answersSubmitted,
    pollInterval: 1000
  });

  const [answerSubmit] = useMutation(SUBMIT_ANSWERS)
  const [leaveGame] = useMutation(LEAVE_GAME)
  const [leaveGameMe] = useMutation(LEAVE_GAME_ME)

  useEffect(() => {
    if(!loading){
      if(myData.me.inGame){
        if(!myData.me.currentGame.opponentInGame){
          handleLeaveGame()
        }
    }
  }
  }, [myData])

  useEffect(() => {
    if(answersSubmitted){
      if(!loadingUser){
        if(data.user.currentGame.answerSubmit){
          handleLeaveGameMe();
        }
      }
    }
  }, [data])

const handleFormSubmit = async () => {
  const answersArray = answersRef.current.map(answer => answer.value)
  const guessesArray = guessesRef.current.map(guess => guess.value)
  try {
    await answerSubmit({
      variables: { questions: categoryQuestions, answers: answersArray, guesses:  guessesArray, opponent: opponent },
    });
    SetGameInfo({
      ...GameInfo,
      answersSubmitted: true
    })
  } catch (e) {
    console.log(e);
  }
};

const handleLeaveGame = async () => {
  try {
    await leaveGame({
      variables: {username: opponent}
    })
  } catch(e) {
    console.log(e);
  }
  window.location.replace('/')
}

const handleLeaveGameMe = async () => {
  try {
    await leaveGameMe()
  } catch(e) {
    console.log(e);
  }
  window.location.replace('/gameresults')
}


useEffect(() => {
  if(!loading) {
    SetGameInfo({
      ...GameInfo,
      category: myData.me.currentGame.category,
      opponent: myData.me.currentGame.opponent,
    })
  }
  if(category){
    SetGameInfo({
      ...GameInfo,
      categoryQuestions: questions[category]
    })
  }
}, [myData, category])

  return (
    
    <div>
      {answersSubmitted ? (
        <div>Waiting on {opponent} to submit their responses....</div>
      ) : (
        <>
      { loading ? (
        <p>loading...</p>
      ) : (
        <>
        {myData.me.inGame ? (
        <div>
        <h1>Your game against {opponent} in {category}</h1>
        {categoryQuestions.length && (
          <>
          <form onSubmit={handleFormSubmit}>
          {categoryQuestions.map((question, index) => (
              <div key={index}>
                <div>{question}</div>
                <input
                placeholder="your answer"
                name={"answer-"+index}
                ref={(el) => (answersRef.current[index] = el)}>
                </input>
                <input
                placeholder="your guess"
                name={"guess-"+index}
                ref={(el) => (guessesRef.current[index] = el)}>
                </input>

              </div>
          ))}
          </form>
          <button onClick={handleFormSubmit}>Submit Answers</button>
          </>
          )}
          </div>
          ) : (<div>You are not currently in a Game. Please go to the home page to invite a friend!</div>)}
          </>
        )}  
        </>
      )}
        <button onClick={handleLeaveGame}>Leave Game</button>

    </div>
  );
};

export default Game;