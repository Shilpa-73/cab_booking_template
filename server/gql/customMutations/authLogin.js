import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';
import db from '@database/models';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import {comparePassword} from '@database/bcrypt'

let unusedVar={
    a:2,

    newk:`djfghdj`,
    doubleQuoteEx:"jhjghjgd"
}

let funV = function () {
    return 'demo'
}

//This is response fields of the query
export const loginUserFields = {
    user_id: {
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
    async resolve(source, { email, password }, context, info) {
        try {
            let { customers, passport, tokens }= db

            let existCustomer = await customers.findOne({where:{email:email.toLowerCase()}, raw:true})
            if(!existCustomer) throw new Error(`This ${email} account does not exist!`)

            //If customer is present check the password is matching or not!
            let passportData = await passport.findOne({
                where: {
                    user_id: existCustomer.id,
                    user_type: 'CUSTOMER',
                    provider_type: 'LOCAL'
                },
                raw: true
            })
            if(!passportData)
                throw new Error(`This ${email} account provider not exist!`)

            //Compare the password
            let matchPassword = await comparePassword(password, passportData.password)
            if(!matchPassword) throw new Error(`Password Mismatch!`)

            //Todo token create logic is pending!

            let token = await jwt.sign(
                {
                    user_id: existCustomer.id,
                    email: existCustomer.email
                },
                process.env.TOKEN_SECRET,
                {expiresIn: 3600000}
            );
            //Do entry of this token into the database
            await tokens.create({
                type:'CUSTOMER',
                token,
                login_time:moment(),
                user_id:existCustomer.id,
                token_expiry: moment().add(3600,'seconds')
            })

            return { token, user_id: existCustomer.id };
        } catch (e) {
            throw Error(`Internal Error: ${e}`);
        }
    },
    description: 'Get presigned AWS S3 URI which can be used to upload data to S3'
};