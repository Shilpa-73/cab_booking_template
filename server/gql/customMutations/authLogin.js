import {GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString} from 'graphql';
import db from '@database/models';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import {comparePassword} from '@database/bcrypt'
import {findOneById, findOneByCriteria, insertRecord} from '@database/dbUtils'

//This is response fields of the query
export const loginUserFields = {
    userId: {
        type: GraphQLNonNull(GraphQLInt),
        description: 'The user_id that is related to the email entered for the login in Database!'
    },
    token: {
        type: GraphQLNonNull(GraphQLString),
        description: 'The key by which later we will used this for authentication purpose!'
    }
};

//This is a query argument that will passed from the graphiql/front-end
export const loginUserArgs = {
    email: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Email id of user account!'
    },
    password: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Password of the user that want to do login!'
    }
};

export const loginResponse = new GraphQLObjectType({
    name: 'loginResponse',
    fields: () => ({
        ...loginUserFields
    })
});

export const loginMutation = {
    type: loginResponse,
    args: {
        ...loginUserArgs
    },
    async resolve(source, {email, password}, context, info) {
        try {

            //Check given email customer is exist or not!
            let existCustomer = await findOneByCriteria(db.customers,{email: email.toLowerCase()})
            if (!existCustomer) throw new Error(`This ${email} account does not exist!`)

            //If customer is present check the password is matching or not!
            let passportData = await findOneByCriteria(db.passport, {
                userId: existCustomer.id,
                userType: 'CUSTOMER',
                providerType: 'LOCAL'
            })
            if (!passportData)
                throw new Error(`This ${email} account provider not exist!`)

            //Compare the password
            let matchPassword = await comparePassword(password, passportData.password)
            if (!matchPassword) throw new Error(`Password Mismatch!`)

            //Create JWT token for the user that going to be loggin
            let token = await jwt.sign(
                {
                    userId: existCustomer.id,
                    email: existCustomer.email
                },
                process.env.TOKEN_SECRET,
                {expiresIn: 3600000}
            );

            //Insert record to tokens table for created jwt token!
            await insertRecord(db.tokens,{
                type: 'CUSTOMER',
                token,
                loginTime: moment(),
                userId: existCustomer.id,
                tokenExpiry: moment().add(3600, 'seconds')
            })

            return {token, userId: existCustomer.id};
        } catch (e) {
            throw Error(`Internal Error: ${e}`);
        }
    },
    description: 'Login mutation for customer!'
};