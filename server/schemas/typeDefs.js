const {gql} = require('apollo-server-express');

const typeDefs = gql `

type CurrentGame {
    _id: ID
    currentQuestion: Int
    answersSubmitted: Boolean
    answer: String
    guess: String
    createdAt: String
}

type Game {
    opponent: User
    yourScore: Int
    opponentScore: Int
    winner: String
    questions: [Question]
}

type Question {
    questionBody: String
    yourAnswer: String
    opponentAnswer: String
    yourGuess: String
    opponentGuess: String
    youCorrect: Boolean
    opponentCorrect: Boolean
}

type User {
    _id: ID
    username: String
    email: String
    inGame: Boolean
    currentGame: CurrentGame
    openInvites: [Invite]
    games: [Game]
}

type Invite {
    _id: ID
    username: String
    accepted: Boolean
}

type Query {
    me: User
    users: [User]
    user(username: String!): User 
}

type Auth {
    token: ID!
    user: User
}

type Mutation {
    login(email: String!, password:String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    sendInvite(username: String!): String
    cancelInvite(username: String!): String
    acceptInvite(username: String!): String
    addGame(opponent: ID!, yourScore: Int, opponentScore: Int, winner: String, questions: [String]): User
    addQuestion(questionBody: String!): Game
}
`;

module.exports = typeDefs;