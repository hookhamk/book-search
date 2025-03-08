import { IBookDocument } from "../models/Book.js";
import User from "../models/User.js";
import { AuthenticationError, signToken } from "../services/auth.js";

//prepare args for resolvers
interface GetUserArgs {
    _id: string;
}

interface LoginArgs {
    username: string;
    password: string;
}

interface CreateUserArgs {
    username: string;
    password: string;
    email: string;
}

interface SaveBookArgs {
    _id: string;
    book: IBookDocument;
}

interface DeleteBookArgs {
    userId: string;
    bookId: string;
}

const resolvers = {
    Query: {
        //find user based on id
        getUser: async (_parent: any, { _id }: GetUserArgs) => {
            return await User.findOne({ _id });
        },
    },
    Mutation: {
        //find user using username, then verify the password. if correct, sign and return a token
        login: async (_parent: any, { username, password }: LoginArgs) => {
            const user = await User.findOne({ username })

            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        //create a new user using username, password, and email. then sign a token and return it
        createUser: async (_parent: any, { username, password, email }: CreateUserArgs) => {
            const user = await User.create({ username, password, email });

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        //if logged in, add book to user's book array
        saveBook: async (_parent: any, { _id, book }: SaveBookArgs, context: any) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true },
                );

                return updatedUser;
            }

            throw new AuthenticationError('Need to be logged in to save a book');
        },
        //if logged in, remove book from user's book array via book id
        deleteBook: async (_parent: any, { userId, bookId }: DeleteBookArgs, context: any) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true },
                );

                return updatedUser;
            }
            throw new AuthenticationError('Need to be logged in to delete a book');
        },

    }
};

export default resolvers;