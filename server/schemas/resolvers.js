const { User, Invite } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const Game = require('../models/Game');
const Question = require('../models/Question');
const CurrentGame = require('../models/CurrentGame');


const resolvers = {
    Query: {
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
        },
        //get all games
        game: async (parent, args, context) => {
            if (context.user) {
                return await Game.find();
            }

        }

    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        deleteUser: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findByIdAndDelete(
                    {_id: context.user._id},
                    {deleteOne: User}
                );
                return user;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
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
        sendInvite: async (parent, { username, category }, context) => {
            if(!username || !category) {
                throw new Error('You must pick a category and username')
            }
            if(username === context.user.username) {
                throw new Error("You cant't play against yourself! :) Please pick another user")
            }
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
        cancelInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': username }, { $pull: { openInvites: { 'username': context.user.username } } })
            return username
        },
        acceptInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': context.user.username, "openInvites.username": username }, { 'openInvites.$.accepted': true })
            return context.user.username
        },
        declineInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': context.user.username }, { $pull: { openInvites: { 'username': username } } })
            return username
        },
        // adds game to current user games array
        addGame: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { games: args } },
                    { new: true }
                );
                return user;
            };
        },
        //creates newGame, generates Game _id, and pushes it to currentGame array in User model
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
        //adds question to current Game: questions[]
        //with the addition of asking/answering all 5 questions at once this resolver may not be needed.  Leaving for now. 
        addQuestion: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id })

                const game = await Game.findByIdAndUpdate(
                    { _id: user.currentGame },
                    { $push: { questions: args } },
                    { new: true }
                );
                return game;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        //with the addition of asking/answering all 5 questions at once this resolver may not be needed.  Leaving for now. 
        newQuestion: async (parent, args, context) => {

            if (context.user) {
                const question = await Question.create({ 'username': context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $set: { currentQuestion: question._id } },
                    { new: true }
                );
                return question;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
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
