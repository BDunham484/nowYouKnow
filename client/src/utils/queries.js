import { gql } from '@apollo/client';

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
        }
    }
`

export const GET_INVITES = gql`
    {
        me {
            openInvites {
                username
                accepted
            }
        }
    }
`