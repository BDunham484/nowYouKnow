//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');

//create the schema for the model using the Schema constructor and outline the fields
const questionSchema = new Schema(
    {
        questions: {
            type: [String]
        },
        answers: {
            type: [String]
        },
        guesses: {
            type: [String]
        }
        // questionBody: {
        //     type: String
        // },
        // yourAnswer: {
        //     type: String,
        //     // required: 'You need to leave an answer!',
        //     minlength: 1,
        //     maxlength: 280
        // },
        // opponentAnswer: {
        //     type: String,
        //     // required: 'You need to leave an answer!',
        //     minlength: 1,
        //     maxlength: 280
        // },
        // yourGuess: {
        //     type: String,
        //     // required: 'You need to make a guess!',
        //     minlength: 1,
        //     maxlength: 280
        // },
        // opponentGuess: {
        //     type: String,
        //     // required: 'You need to make a guess!',
        //     minlength: 1,
        //     maxlength: 280
        // },
        // youCorrect: {
        //     type: Boolean
        // },
        // opponentCorrect: {
        //     type: Boolean
        // },
        // questionBody1: {
        //     type: String
        // },
        // yourAnswer1: {
        //     type: String
        // },
        // yourGuess1: {
        //     type: String
        // },
        // questionBody2: {
        //     type: String
        // },
        // yourAnswer2: {
        //     type: String
        // },
        // yourGuess2: {
        //     type: String
        // },
        // questionBody3: {
        //     type: String
        // },
        // yourAnswer3: {
        //     type: String
        // },
        // yourGuess3: {
        //     type: String
        // },
        // questionBody4: {
        //     type: String
        // },
        // yourAnswer4: {
        //     type: String
        // },
        // yourGuess4: {
        //     type: String
        // },
        // questionBody5: {
        //     type: String
        // },
        // yourAnswer5: {
        //     type: String
        // },
        // yourGuess5: {
        //     type: String
        // },
    },
);



//create the comment model using the CommentSchema
const Question = model('Question', questionSchema);

//export the Comment Model
module.exports = Question;
