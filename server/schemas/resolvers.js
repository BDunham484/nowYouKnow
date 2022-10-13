const { User, Invite } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const Game = require('../models/Game');
const CurrentGame = require('../models/CurrentGame');


const resolvers = {
    Query: {
        // gets logged in user's data
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('You are not logged in');
        },
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
        },

        // get user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
        }
    },
    Mutation: {
        // add a new user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // deletes signed in user
        deleteUser: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findByIdAndDelete(
                    {_id: context.user._id},
                    {deleteOne: User}
                );
                return context.user.username;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        // takes credentials and creates a token for user login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Invalid email')
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Invalid Password')
            }
            const token = signToken(user);
            return { token, user };
        },
        // send an invite to a friend with their username and the chosen category
        sendInvite: async (parent, { username, category }, context) => {
            if(!username || !category) {
                throw new Error('You must pick a category and username')
            }
            if(username === context.user.username) {
                throw new Error("You cant't play against yourself! :) Please pick another user")
            }
            // create a new invite and push it to the chosen user's open invites
            const invite = await Invite.create({ 'username': context.user.username, accepted: false, 'category': category })
            const user = await User.findOneAndUpdate(
                { 'username': username }, {
                $push: {
                    openInvites: invite
                }
            })
            if(!user){
                throw new Error('User does not exist')
            }
            return username
        },
        // takes invite away from chosen user's open invites if you choose to cancel the invitation
        cancelInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': username }, { $pull: { openInvites: { 'username': context.user.username } } })
            return username
        },
        // changes your open invite from a user to show that it has been accepted
        acceptInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': context.user.username, "openInvites.username": username }, { 'openInvites.$.accepted': true })
            return context.user.username
        },
        // remove someones game invite from your own open invite list
        declineInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': context.user.username }, { $pull: { openInvites: { 'username': username } } })
            return username
        },
        //creates an initialized current Game to your user
        newGame: async (parent, { category, opponent }, context) => {
            if(context.user) {
            const currentGame = await CurrentGame.create({
                'answerSubmit': false,
                'category': category,
                'opponent': opponent,
                'opponentInGame': true
            })
            await User.findOneAndUpdate(
                { 'username': context.user.username }, {
                $set: {
                    currentGame: currentGame,
                    inGame: true
                }
            })
            return context.user.username
        }
            throw new AuthenticationError('You need to be logged in!');
        },
        // leave the game if you no longer want to play. Forces the other user to leave the game as well
        leaveGame: async(parent, { username }, context) => {
            if(context.user) {
                await User.findOneAndUpdate(
                    { 'username': context.user.username }, {
                        'inGame': false
                })
                await User.findOneAndUpdate(
                    { 'username': username }, {
                        'currentGame.opponentInGame': false
                })
                return context.user.username
            }
                throw new AuthenticationError('You need to be logged in!');
        },
        // leave the game but only update your own in game status
        leaveGameMe: async(parent, args, context) => {
            if(context.user) {
                await User.findOneAndUpdate(
                    { 'username': context.user.username }, {
                    $set: {
                        inGame: false
                    }
                })
                return context.user.username
            }
                throw new AuthenticationError('You need to be logged in!');
        },
        // submit your answers and guesses to both you and your opponent's current game
        submitAnswer: async (parent, { answers, guesses, opponent }, context) => {
            if (context.user) {
                let yourArray = []
                let opponentArray = []
                answers.forEach((answer, index) => {
                    const yourQuestionModel = {
                        'yourAnswer': answer,
                        'yourGuess': guesses[index]
                    }
                    const opponentQuestionModel = {
                        'opponentAnswer': answer,
                        'opponentGuess': guesses[index]
                    }
                    yourArray.push(yourQuestionModel)
                    opponentArray.push(opponentQuestionModel)
                })

                await User.findOneAndUpdate(
                    { 'username': context.user.username }, {
                    'currentGame.QandA': yourArray,
                    'currentGame.answerSubmit': true
                })
                await User.findOneAndUpdate(
                    { 'username': opponent }, {
                    'currentGame.opponentQandA': opponentArray
                })
                return context.user.username;
            }
            throw new AuthenticationError('You need to be logged in!');          
    }}
};

module.exports = resolvers;    
