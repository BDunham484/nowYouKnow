//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
const Question = require('./Question')
const CurrentGame = require('./CurrentGame');

//create the schema for the model using the Schema contructor and outline the fields
const gameSchema = new Schema(
    {
        username: {
            type: String
        },
        opponent: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        yourScore: {
            type: Number
        },
        opponentScore: {
            type: Number
        },
        winner: {
            type: String
        },
        questions: [CurrentGame.schema],
        // opponentQuestions: [Question.schema]
    },
);



const Game = model('Game', gameSchema);

module.exports = Game;