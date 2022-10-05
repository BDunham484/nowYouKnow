//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');

const inviteSchema = new Schema(
    {   
        username: {
            type: String
        },
        accepted: {
            type: Boolean
        }
    }
);

const Invite = model('Invite', inviteSchema);

//export the Guess schema
module.exports = Invite;