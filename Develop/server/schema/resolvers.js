const { User, Book } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id }).select(
					"-__v -password"
				);
				return userData;
			}
			throw new AuthenticationError("Not logged in");
		},
	},
	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("No user found with this email");
			}

			const correctPassword = await user.isCorrectPassword(password);

			if (!correctPassword) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const token = signToken(user);

			return { token, user };
		},
		saveBook: async (parent, { bookData }, context) => {
			if (!context.user) {
				throw new AuthenticationError("Not logged in");
			}

			const updatedUser = await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $addToSet: { savedBooks: bookData } },
				{ new: true, runValidators: true }
			).populate("savedBooks");

			if (!updatedUser) {
				console.error("Could not save book");
				throw new Error("Could not save book");
			}

			return updatedUser;
		},
		removeBook: async (parent, { bookId }, context) => {
			if (!context.user) {
				throw new AuthenticationError("Not logged in");
			}

			const updatedUser = await User.findOneAndRemove(
				{ _id: context.user._id },
				{ $pull: { savedBooks: { bookId } } },
				{ new: true }
			).populate("savedBooks");

			if (!updatedUser) {
				console.error("Could not remove this book");
				throw new Error("Could not remove this book");
			}
		},
	},
};

module.exports = resolvers;
