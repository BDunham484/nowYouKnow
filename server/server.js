//import express.js package
const express = require('express');

// apollo server 
const {ApolloServer} = require('apollo-server-express');

// typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');

//import database connection to mongodb via mongoose
const db = require('./config/connection');

//set environment variable
const PORT = process.env.PORT || 3001;

// create new instance of apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});
//instantiate the server
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: false }));
//parse incoming JSON data
app.use(express.json());

//create a new instance of an Apollo Server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    //integrate Apoloo server with the Express application as middleware
    server.applyMiddleware({ app });

    //establish connection to server via the listen() methos
    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`Now listening on port: ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
}

//call the async function to start the browser
startApolloServer(typeDefs, resolvers);