import React from "react";
import { GET_ME } from '../utils/queries'
import { useQuery } from '@apollo/client';



import Results from '../components/Results';

const GameResults = () => {

  const { loading, data: myData } = useQuery(GET_ME)

  if(!loading) {
    console.log(myData.me.currentGame.QandA);
    console.log(myData.me.currentGame.opponentQandA);


  }

  return (
    <div>
      <Results />
    </div>
  );
};

export default GameResults;