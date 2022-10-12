const {gql} = require('apollo-server-express');

const typeDefs = gql `

type CurrentGame {
    _id: ID
    QandA: [Question]
    opponentQandA: [Question]
    answerSubmit: Boolean
    category: String
    opponent: String
    createdAt: String
    opponentInGame: Boolean
}

type Game {
    _id: ID
    username: User
    opponent: User
    yourScore: Int
    opponentScore: Int
    winner: String
    questions: [Question]
}

type Question {
    _id: ID
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
    password: String
    games: [Game]
    inGame: Boolean
    currentGame: CurrentGame
    currentQuestion: String
    openInvites: [Invite]
}

type Invite {
    _id: ID
    username: String
    category: String
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
    deleteUser(username: String!, email: String!, password: String!): User
    sendInvite(username: String!, category: String!): String
    cancelInvite(username: String!): String
    acceptInvite(username: String!): String
    declineInvite(username: String!): String
    addGame(opponent: ID!, yourScore: Int, opponentScore: Int, winner: String, questions: [String]): User
    addQuestion(questionBody: String!, yourAnswer: String, opponentAnswer: String, yourGuess: String, opponentGuess: String, youCorrect: Boolean, opponentCorrect: Boolean): Game
    newGame(category: String!, opponent: String!): String
    leaveGame(username: String): String
    leaveGameMe: String
    newQuestion(questionBody: String): Question
    addAnswer(yourAnswer: String, opponentAnswer: String, yourGuess: String, opponentGuess: String): Question
    submitAnswer(answers: [String]!, guesses: [String]!, opponent: String!): String
}
`;

module.exports = typeDefs;
