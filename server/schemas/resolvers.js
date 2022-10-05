const { User, Invite } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const Game = require('../models/Game');
const Question = require('../models/Question');


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
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Invalid Username')
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Invalid Password')
            }
            const token = signToken(user);
            return { token, user };
        },
        sendInvite: async (parent, { username }, context) => {
            console.log(username);
            const invite = await Invite.create({ 'username': context.user.username, accepted: false })
            await User.findOneAndUpdate(
                { 'username': username }, {
                    $push: {
                        openInvites: invite
                    }
            })
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
        // adds game to current user games array
        addGame: async (parent, args, context) => {
            console.log('ARGS!!!!!')
            console.log(args)
            console.log("CONTEXT!!!!")
            console.log(context.user)
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
        newGame: async (parent, args, context) => {
            console.log('ARGS!!!!!')
            console.log(args)
            console.log("CONTEXT!!!!")
            console.log(context.user)
            if (context.user) {
                const game = await Game.create({ username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $set: { currentGame: game._id } },
                    { new: true }
                );
                console.log(game._id)
                return game;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        //adds question to current Game: questions[]
        addQuestion: async (parent, args, context) => {
            console.log('ARGS!!!')
            console.log(args)
            console.log('CONTEXT!!!');
            console.log(context.user)
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id })

                const game = await Game.findByIdAndUpdate(
                    { _id: user.currentGame },
                    { $push: { questions: args } },
                    { new: true }
                );
                console.log('GAME ID!!!!')
                console.log(user.currentGame)
                console.log('GAME !!!')
                console.log(game)
                return game;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        newQuestion: async (parent, args, context) => {
            console.log('ARGS!!!!!')
            console.log(args)
            console.log("CONTEXT!!!!")
            console.log(context.user)
            if (context.user) {
                const question = await Question.create({ username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $set: { currentQuestion: question._id } },
                    { new: true }
                );
                console.log(question._id)
                return question;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        addAnswer: async (parent, args, context) => {
            console.log('ARGS!!!')
            console.log(args)
            console.log('CONTEXT!!!');
            console.log(context.user)
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id })

                const answer = await Question.findByIdAndUpdate(
                    { _id: user.currentQuestion },
                    { $set: { yourAnswer: args.yourAnswer,
                        opponentAnswer: args.opponentAnswer,
                        yourGuess: args.yourGuess,
                        opponentGuess: args.opponentGuess} },
                    { new: true }
                );

                const game = await Game.findByIdAndUpdate(
                    { _id: user.currentGame },
                    { $push: { questions: args } },
                    { new: true }
                );
                console.log('Question ID!!!!')
                console.log(user.currentQuestion)
                console.log('Answer !!!')
                console.log(answer)
                console.log('GAME !!!!');
                console.log(game);
                return answer;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    }
};

module.exports = resolvers;    
