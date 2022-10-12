import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { LEAVE_GAME, SUBMIT_ANSWERS, LEAVE_GAME_ME } from '../utils/mutations';
import { GET_ME, GET_USER_INFO } from '../utils/queries'
import { questions } from '../assets/variables/questions'
import Results from '../components/Results';


const Game = () => {
const [formState, setFormState] = useState({});
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
      console.log(data.user.currentGame);
      if(data.user.currentGame.answerSubmit){
        handleLeaveGameMe();
      }
    }
  }

}, [data])

const handleFormSubmit = async () => {
  let answerArray = [];
  let guessArray = [];
  let answer;
  let guess;
  for(let i=0; i<categoryQuestions.length; i++){
    answer = formState['answer-' + i.toString()]
    guess = formState['guess-' + i.toString()]
    answerArray.push(answer);
    guessArray.push(guess);
  }
  try {
    await answerSubmit({
      variables: { questions: categoryQuestions, answers: answerArray, guesses:  guessArray, opponent: opponent },
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

const handleChange = (event) => {
  const { name, value } = event.target;
  setFormState({
    ...formState,
    [name]: value,
  });
};

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
                onChange={handleChange}>
                </input>
                <input
                placeholder="your guess"
                name={"guess-"+index}
                onChange={handleChange}>
                </input>

              </div>
          ))}

          </form>
                    <button onClick={handleFormSubmit}>Submit Answers</button>
                    <button onClick={handleLeaveGame}>Leave Game</button>
                    </>
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