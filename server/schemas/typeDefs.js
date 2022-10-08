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
    questionBody1: String
    yourAnswer1: String
    yourGuess1: String
    questionBody2: String
    yourAnswer2: String
    yourGuess2: String
    questionBody3: String
    yourAnswer3: String
    yourGuess3: String
    questionBody4: String
    yourAnswer4: String
    yourGuess4: String
    questionBody5: String
    yourAnswer5: String
    yourGuess5: String
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
    newGame(username: String): User
    newQuestion(questionBody: String): Question
<<<<<<< HEAD
    addAnswer(yourAnswer: String, opponentAnswer: String, yourGuess: String, opponentGuess: String): Question
=======
    
    submitAnswer(
        questionBody1: String
        yourAnswer1: String
        yourGuess1: String
        questionBody2: String
        yourAnswer2: String
        yourGuess2: String
        questionBody3: String
        yourAnswer3: String
        yourGuess3: String
        questionBody4: String
        yourAnswer4: String
        yourGuess4: String
        questionBody5: String
        yourAnswer5: String
        yourGuess5: String
        ): User
>>>>>>> develop
    
}
`;

module.exports = typeDefs;