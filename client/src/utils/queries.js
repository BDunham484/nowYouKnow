import { gql } from '@apollo/client';

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            inGame
            currentGame {
                opponent
                category
                opponentInGame
                QandA {
                    yourAnswer
                    yourGuess
                }
                opponentQandA {
                    opponentAnswer
                    opponentGuess
                }
            }
        }
    }
`

export const GET_INVITES = gql`
    {
        me {
            openInvites {
                username
                category
                accepted
            }
        }
    }
`

export const GET_USER_INFO = gql`
    query user($username: String!){
        user(username: $username) {
            openInvites {
                username
                category
                accepted
            }
            inGame
            currentGame {
                opponent
                category
                answerSubmit
                opponentInGame
                QandA {
                    yourAnswer
                    yourGuess
                }
            }
        }
    }
`