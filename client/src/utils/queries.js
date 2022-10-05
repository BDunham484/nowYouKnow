import { gql } from '@apollo/client';

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            inGame
            currentGame {
                _id
                currentQuestion
                answersSubmitted
                answer
                guess
                createdAt
            }
            games {
                yourScore
                opponentScore
                winner
                opponent {
                    _id
                    username
                }
            }
        }
    }
`