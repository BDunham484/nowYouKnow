const {gql} = require('apollo-server-express');

const typeDefs = gql `

type CurrentGame {
    _id: ID
    QandA: [Question]
    answerSubmit: Boolean
    createdAt: String
}

type Game {
    _id: ID
    username: User
    opponent: User
    yourScore: Int
    opponentScore: Int
    winner: String
    questions: [CurrentGame]
}

type Question {
    _id: ID
    questions: [String]
    answers: [String]
    guesses: [String]
}

type User {
    _id: ID
    username: String
    email: String
    password: String
    games: [CurrentGame]
    inGame: Boolean
    currentGame: CurrentGame
    currentQuestion: String
    openInvites: [Invite]
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
    questions: [Question]
    game: Game
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
    declineInvite(username: String!): String
    addGame(opponent: ID!, yourScore: Int, opponentScore: Int, winner: String, questions: [String]): User
    addQuestion(questionBody: String!, yourAnswer: String, opponentAnswer: String, yourGuess: String, opponentGuess: String, youCorrect: Boolean, opponentCorrect: Boolean): Game
    newGame: String
    newQuestion(questionBody: String): Question
    addAnswer(yourAnswer: String, opponentAnswer: String, yourGuess: String, opponentGuess: String): Question
    submitAnswer(questions: [String]!, answers: [String]!, guesses: [String]!): User
}
`;

module.exports = typeDefs;