import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $username: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      username: $username
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_GAME = gql`
  mutation AddGame(
    $opponent: ID!
    $yourScore: Int
    $opponentScore: Int
    $winner: String
    ) {
    addGame(
      opponent: $opponent
      yourScore: $yourScore
      opponentScore: $opponentScore
      winner: $winner) {
        _id
        username
        games {
          opponent {
          _id
        }
        yourScore
        opponentScore
        winner
    }
  }
}
`;


export const SEND_INVITE = gql`
  mutation sendInvite($username: String!) {
    sendInvite(username: $username)
  }
`;

export const CANCEL_INVITE = gql`
  mutation cancelInvite($username: String!) {
    cancelInvite(username: $username)
  }
`;

export const ACCEPT_INVITE = gql`
  mutation acceptInvite($username: String!) {
    acceptInvite(username: $username)
  }
`;

export const DECLINE_INVITE = gql`
  mutation declineInvite($username: String!) {
    declineInvite(username: $username)
  }
`;



