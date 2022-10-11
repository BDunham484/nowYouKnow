//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
//import date formatting 
const dateFormat = require('../utils/dateFormat');
const Question = require('./Question');

//create the schema for the model using the Schema constructor and outline the fields
const currentGameSchema = new Schema(
    {   
        QandA: [Question.schema],
        // opponentQandA: [Question.schema],
        answerSubmit: {
            type: Boolean
        },
        category: {
            type: String
        },
        opponent: {
            type: String
        },
        opponentInGame: {
            type: Boolean
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