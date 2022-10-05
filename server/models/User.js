//import the Schema contructor and the model function from mongoose
const { Schema, model } = require('mongoose');
//import bcrypt package for password encryption
const bcrypt = require('bcrypt');
const Game = require('./Game');
const Invite = require('./Invite')


//create the schema for the model using the Schema contructor and outline the fields
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must enter a vaild email address!']
        },
        password: {
            type: String,
            required: true,
            minlength: 5
        },
        games: [Game.schema],
        inGame: {
            type: Boolean
        },
        currentGame: Game.schema,
        openInvites: [Invite.schema]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

// set up pre-save middleware to create password
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

//compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

//get total count of friends on retrieval
userSchema.virtual('gameCount').get(function() {
    return this.games.length;
});

//create the user model using the UserSchema
const User = model('User', userSchema);

//export the User Model
module.exports = User;