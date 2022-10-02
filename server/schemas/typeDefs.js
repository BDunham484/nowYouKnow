const {gql} = require('apollo-server-express');

const typeDefs = gql `
    
type User {
    _id: ID
    username: String
    email: String
    friends: [User]
}

type Query {
    me: User
}

type Guess {
    _id: ID
    guessBody: String
    username: String
    createdAt: String
}

type Question {
    questionText: String
    createdAt: String
    username: String
    guesses: [Guess]
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