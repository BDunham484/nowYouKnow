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
            console.log(username);
            const invite = await Invite.create({ 'username': context.user.username, accepted: false, 'category': category })
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
        declineInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate(
                { 'username': context.user.username }, { $pull: { openInvites: { 'username': username } } })
            return username
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
        newGame: async (parent, { category, opponent }, context) => {
            if(context.user) {
            const currentGame = await CurrentGame.create({
                'answerSubmit': false,
                'category': category,
                'opponent': opponent
            })
            await User.findOneAndUpdate(
                { 'username': context.user.username }, {
                $set: {
                    currentGame: currentGame
                }
            })
            return context.user.username
        }
            throw new AuthenticationError('You need to be logged in!');
        },
        joinGame: async(parent, args, context) => {
            if(context.user) {
                await User.findOneAndUpdate(
                    { 'username': context.user.username }, {
                    $set: {
                        inGame: true
                    }
                })
                return context.user.username
            }
                throw new AuthenticationError('You need to be logged in!');
        },
        leaveGame: async(parent, args, context) => {
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
        //with the addition of asking/answering all 5 questions at once this resolver may not be needed.  Leaving for now. 
        newQuestion: async (parent, args, context) => {
            console.log('ARGS!!!!!')
            console.log(args)
            console.log("CONTEXT!!!!")
            console.log(context.user)
            if (context.user) {
                const question = await Question.create({ 'username': context.user.username });

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

        submitAnswer: async (parent, { questions, answers, guesses }, context) => {

            if (context.user) {
                let finalArray = []
                answers.map((answer, index) => {
                    const questionModel = {
                        'yourAnswer': answer,
                        'yourGuess': guesses[index]
                    }
                    finalArray.push(questionModel)
                })

                const currentGame = await CurrentGame.create({
                    'QandA': finalArray,
                    'answerSubmit': true
                });

                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $set: { currentGame: currentGame } },
                    { new: true }
                );
                return context.user.username;
            }
            
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;    
