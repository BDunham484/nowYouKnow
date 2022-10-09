import { gql } from '@apollo/client';

export const GET_ME = gql`

    {
        me {
            _id
            username
            email
            inGame
            currentGame {
                QandA {
                    yourAnswer
                    yourGuess
                }
                opponent
                category
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
            currentGame {
                QandA {
                    yourAnswer
                    yourGuess
                }
            }
            openInvites {
                username
                category
                accepted
            }
        }
    }
`