import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME, GET_USER_INFO } from '../../utils/queries';
import { compareUsers } from '../../utils/helpers';


const Results = () => {

    const { loading, data: myData } = useQuery(GET_ME);
    const [GameInfo, SetGameInfo] = useState({ opponent: '' })
    const { opponent } = GameInfo

    const { data } = useQuery(GET_USER_INFO, {
        variables: { username: opponent },
    });


    useEffect(() => {
        if (!loading) {
            SetGameInfo({
                ...GameInfo,
                opponent: myData.me.currentGame.opponent
            })
        }
    }, [myData])

    const yourData = {
        me: {
            currentGame: {
                QandA: [
                    {
                        yourAnswer: 'red',
                        yourGuess: 'red'
                    },
                    {
                        yourAnswer: 'dog',
                        yourGuess: 'cat'
                    },
                    {
                        yourAnswer: 'taco',
                        yourGuess: 'pizza'
                    }
                ],
                opponent: 'deb'
            },
            username: 'brad'
        }
    }

    const opponentData = {
        user: {
            currentGame: {
                QandA: [
                    {
                        yourAnswer: 'green',
                        yourGuess: 'blue'
                    },
                    {
                        yourAnswer: 'cat',
                        yourGuess: 'dog'
                    },
                    {
                        yourAnswer: 'pizza',
                        yourGuess: 'salad'
                    }
                ],
                opponent: 'brad'
            },
            username: 'deb'
        }
    }

    const questions = [
            'What is my favorite color?',
            'What is my favorite animal?',
            'What is my favorite food?'
        ]




    const testing = () => {
        console.log('TEST BUTTON CLICKED');
        // console.log(data)
        // console.log(answers)
        console.log(compareUsers(yourData, opponentData, questions))
        // compareUsers(yourData, opponentData)
    }




    return (
        <div>
            {loading ? (
                <p>loading...</p>
            ) : (
                <>
                    <button onClick={testing}>TEST</button>
                </>
            )}

        </div>
    );
};

export default Results;