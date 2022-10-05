const { User, Invite, Question } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


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
            const invite = await Invite.create({'username': context.user.username, accepted: false})
            await User.findOneAndUpdate( 
                {'username': username} , {$push: {
                    openInvites: invite}})
                return username
        },
        cancelInvite: async (parent, { username }, context) => {
            await User.findOneAndUpdate( 
                {'username': username} , {$pull: {openInvites: {'username': context.user.username}}})
                return username
        },
        acceptInvite: async (parent, {username}, context) => {
            await User.findOneAndUpdate( 
                {'username': context.user.username, "openInvites.username": username} , {'openInvites.$.accepted': true})
                return context.user.username
        },
        //adds game to current user games array
        addGame: async (parent, args, context) => {
            console.log('ARGS!!!!!')
            console.log(args)
            console.log("CONTEXT!!!!")
            console.log(context.user)
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { games: args }},
                    { new: true }
                );
                return user;
            };
        },
        //adds question to current Game: questions[]
        addQuestion: async (parent, args) => {
                const question = await Game.find(
                    { $push: { question: args }},
                    { new: true }
                );
                return question;
        }
    }
};

module.exports = resolvers;