//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');


//create the schema for the model using the Schema constructor and outline the fields
const inviteSchema = new Schema(
    {   
        username: {
            type: String
        },
        category: {
            type: String
        },
        accepted: {
            type: Boolean
        }
    }
);

//create the Invite model using the inviteSchema
const Invite = model('Invite', inviteSchema);

//export the Guess schema
module.exports = Invite;