//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
//import date formatting 
const dateFormat = require('../utils/dateFormat');

//create the schema for the model using the Schema constructor and outline the fields
const quessSchema = new Schema(
    {
        quessBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

//export the Guess schema
module.exports = guessSchema;