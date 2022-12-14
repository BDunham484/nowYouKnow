import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { LEAVE_GAME, SUBMIT_ANSWERS, LEAVE_GAME_ME } from '../../utils/mutations';
import { GET_ME, GET_USER_INFO } from '../../utils/queries'
import { questions } from '../../assets/variables/questions'
import './Game.scss';

const Game = () => {
  // references for answers and guesses arrays
  const answersRef = useRef([])
  const guessesRef = useRef([])

  // state containing the initial information about the game
  const [GameInfo, SetGameInfo] = useState({category: '', opponent: '', categoryQuestions: [], answersSubmitted: false })
  const { category, opponent, categoryQuestions, answersSubmitted } = GameInfo

  // get logged in user's info, querying once a second
  const { loading, data: myData } = useQuery(GET_ME, {
    pollInterval: 1000
  })

  // get opponents data, only once you have submitted your answers
  // query once a second
  const { loading: loadingUser, data } = useQuery(GET_USER_INFO, {
    variables: { username: opponent },
    skip: !answersSubmitted,
    pollInterval: 1000
  });

  // graph ql mutations
  const [answerSubmit] = useMutation(SUBMIT_ANSWERS)
  const [leaveGame] = useMutation(LEAVE_GAME)
  const [leaveGameMe] = useMutation(LEAVE_GAME_ME)

  // leave the game if the opponent has left the game
  useEffect(() => {
    if(!loading){
      if(myData.me.inGame){
        if(!myData.me.currentGame.opponentInGame){
          handleLeaveGame()
        }
    }
  }
  }, [myData])

  // set your own "inGame" to false before going to the results page
  useEffect(() => {
    if(answersSubmitted){
      if(!loadingUser){
        if(data.user.currentGame.answerSubmit){
          handleLeaveGameMe();
        }
      }
    }
  }, [data])

// submit answers when button is clicked
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

// if you choose to leave the game, or the opponent leaves the game
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

// leave game before going to game results
const handleLeaveGameMe = async () => {
  try {
    await leaveGameMe()
  } catch(e) {
    console.log(e);
  }
  window.location.replace('/gameresults')
}

// set the username and category of the current game
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
    
    <div id='in-game-wrapper'>
      {answersSubmitted ? (
        <div className="leave-game">
          <div>Waiting on {opponent} to submit their responses....</div>
          <div className="leave-button">
            <button className="leave-game" onClick={handleLeaveGame}>Leave Game</button>
          </div>
          
        </div>
        
      ) : (
        <>
      { loading ? (
        <p>loading...</p>
      ) : (
        <>
        {myData.me.inGame ? (
        <div className="flex-container">
        <h1>Your game against {opponent} in {category}</h1>
        {categoryQuestions.length && (
          <section>
          <form id="game-form" onSubmit={handleFormSubmit}>
          {categoryQuestions.map((question, index) => (
              <div key={index}>
                <div className="question">{question}</div>
                <input className="responses"
                placeholder="your answer"
                name={"answer-"+index}
                ref={(el) => (answersRef.current[index] = el)}>
                </input>
                <input className="responses"
                placeholder="your guess"
                name={"guess-"+index}
                ref={(el) => (guessesRef.current[index] = el)}>
                </input>

              </div>
          ))}
          
          </form>
          <div className="btns">
            <button onClick={handleFormSubmit}>Submit Answers</button>
            <button className="leave-game" onClick={handleLeaveGame}>Leave Game</button>
          </div>
          </section>
          )}
          </div>
          ) : (<div>You are not currently in a Game. Please go to the home page to invite a friend!</div>)}
          </>
        )}  
        </>
      )}


    </div>
  );
};

export default Game;