//graphql type definitions used in communicating with client
const typeDefs = `
type User {
    _id: String!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
}

type Book {
    bookId: String!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
}

input BookInput {
    bookId: String!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    getUser(_id: String!): User
    }
    
type Mutation {
    login(username: String!, password: String!): Auth
    createUser(username: String!, password: String!, email: String!): Auth
    saveBook(_id: String!, book: BookInput!): User
    deleteBook(userId: String!, bookId: String!): User
}
`;

export default typeDefs;