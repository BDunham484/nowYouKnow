//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
//import Guess model
const guessSchema = require('./Guess');
//import date formatting 
const dateFormat = require('../utils/dateFormat');

//create the schema for the model using the Schema constructor and outline the fields
const questionSchema = new Schema(
    {
        questionText: {
            type: String,
            required: 'You must enter a question!',
            minlenth: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        },
        username: {
            type: String,
            required: true
        },
        guesses: [guessSchema]
    },
    {
        toJSON: {
            getters: true
        }
    }
);

//get total count of guesses on retrieval
questionSchema.virtual('guessCount').get(function() {
    return this.guesses.length;
});

//create the comment model using the CommentSchema
const Question = model('Question', questionSchema);

//export the Comment Model
module.exports = Question;
