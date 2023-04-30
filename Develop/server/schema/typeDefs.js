const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type User {
		_id: ID
		username: String!
		email: String!
		password: String!
		savedBooks: [Book]
	}

	type Book {
		_id: ID
		authors: [String]!
		description: String!
		bookId: String!
		image: String
		link: String
		title: String!
	}

	type Query {
		me: User
	}

	type Auth {
		token: ID!
		user: User
	}

	input BookInput {
		authors: [String]!
		description: String!
		bookId: String!
		image: String
		link: String
		title: String!
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!): Auth
		login(email: String!, password: String!): Auth
		saveBook(bookData: BookInput!): User
		removeBook(bookId: String!): User
	}
`;

module.exports = typeDefs;
