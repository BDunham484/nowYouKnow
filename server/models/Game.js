//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
const Question = require('./Question');

//create the schema for the model using the Schema contructor and outline the fields
const gameSchema = new Schema(
    {
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
        questions: [Question.schema]
    }
);



const Game = model('Game', gameSchema);

module.exports = Game;