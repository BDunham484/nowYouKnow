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
    },
);

//create the comment model using the CommentSchema
const Question = model('Question', questionSchema);

//export the Comment Model
module.exports = Question;
