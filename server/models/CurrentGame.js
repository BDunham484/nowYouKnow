//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
//import date formatting 
const dateFormat = require('../utils/dateFormat');

//create the schema for the model using the Schema constructor and outline the fields
const currentGameSchema = new Schema(
    {   
        currentQuestion: {
            type: Number
        },
        answersSubmitted: {
            type: Boolean
        },
        answer: {
            type: String,
            required: true,
            maxlength: 280
        },
        guess: {
            type: String,
            required: true,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        }
    },
);

const CurrentGame = model('CurrentGame', currentGameSchema);

//export the Guess schema
module.exports = CurrentGame;