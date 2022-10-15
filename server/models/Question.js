//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');

//create the schema for the model using the Schema constructor and outline the fields
const questionSchema = new Schema(
    {
        questionBody: {
            type: String
        },
        yourAnswer: {
            type: String,
            minlength: 1,
            maxlength: 280
        },
        opponentAnswer: {
            type: String,
            minlength: 1,
            maxlength: 280
        },
        yourGuess: {
            type: String,
            minlength: 1,
            maxlength: 280
        },
        opponentGuess: {
            type: String,
            minlength: 1,
            maxlength: 280
        },
        youCorrect: {
            type: Boolean
        },
        opponentCorrect: {
            type: Boolean
        }
    }
);

//create the comment model using the CommentSchema
const Question = model('Question', questionSchema);

//export the Comment Model
module.exports = Question;
