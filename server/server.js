//import express.js package
const express = require('express');
//import database connection to mongodb via mongoose
const db = require('./config/connection');

//set environment variable
const PORT = process.env.PORT || 3001;
//instantiate the server
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: false }));
//parse incoming JSON data
app.use(express.json());

//establish connection to server via the listen() methos
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Now listening on port: ${PORT}!`);
    });
});