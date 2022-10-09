import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { LEAVE_GAME, SUBMIT_ANSWERS } from '../utils/mutations';
import { GET_ME, GET_USER_INFO } from '../utils/queries'
import { questions } from '../assets/variables/questions'
import Results from '../components/Results';


const Game = () => {
  const [formState, setFormState] = useState({});
const [GameInfo, SetGameInfo] = useState({category: '', opponent: '', categoryQuestions: [], answersSubmitted: false})
const { category, opponent, categoryQuestions, answersSubmitted } = GameInfo
const { loading, data: myData } = useQuery(GET_ME)
const { data } = useQuery(GET_USER_INFO, {
  variables: { username: opponent },
  skip: !answersSubmitted,
  pollInterval: 1000
});
const [answerSubmit] = useMutation(SUBMIT_ANSWERS)


const handleFormSubmit = async (event) => {
  event.preventDefault();
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
      variables: { questions: categoryQuestions, answers: answerArray, guesses:  guessArray },
    });
    SetGameInfo({
      ...GameInfo,
      answersSubmitted: true
    })
  } catch (e) {
    console.log(e);
  }
};

const handleChange = (event) => {
  const { name, value } = event.target;
  setFormState({
    ...formState,
    [name]: value,
  });
};

useEffect(()=>{
  if(answersSubmitted && !loading){
  console.log(myData.me.currentGame);
  }
},[answersSubmitted])

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
  console.log(myData);
}, [myData, category])

  return (
    
    <div>
      { loading ? (
        <p>loading...</p>
      ) : (
        <>
        <h1>Your game against {opponent} in {category}</h1>
        {categoryQuestions.length && (
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
          <button type="submit">Submit Answers</button>
          </form>
        )}
        
        </>
      )}
      
          <Results />  
    </div>
  );
};

export default Game;