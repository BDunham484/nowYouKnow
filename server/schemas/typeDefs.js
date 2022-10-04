const {gql} = require('apollo-server-express');

const typeDefs = gql `

type CurrentGame {
    _id: ID
    currentQuestion: Number
    answersSubmitted: Boolean
    answer: String
    guess: String
    createdAt: String
}

type Game {
    Opponent: User
    yourScore: Number
    opponentScore: Number
    winner: String
    questions: Question
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
    games: [Game]
}

type Query {
    me: User
    users: [User]
    user(username: String!): User
}

type Question {
    questionText: String
    createdAt: String
    username: String
}

type Auth {
    token: ID!
    user: User
}

type Mutation {
    login(email: String!, password:String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
}
`;

module.exports = typeDefs;