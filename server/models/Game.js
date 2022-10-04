//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
const Question = require('./Question');
// const Answer = require('./Answer');
const User = require('./User');

//create the schema for the model using the Schema contructor and outline the fields
const gameSchema = new Schema(
    {
        opponent: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        yourScore: {
           // type: Int
        },
        opponentScore: {
            //type: Int
        },
        winner: {
            type: String
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Question'
            }
        ]
    },
);



const Game = model('Game', gameSchema);

module.exports = Game;