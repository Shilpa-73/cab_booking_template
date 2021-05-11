import {GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean} from 'graphql';
import db from '@database/models';
import {generatePassword,comparePassword} from '@database/bcrypt'

//This is response fields of the signup response
export const signupUserFields = {
    flag:{
        type: GraphQLNonNull(GraphQLBoolean),
        description: 'This field state that the customer signup is done perfectly or not!'
    },
    user_id: {
        type: GraphQLNonNull(GraphQLInt),
        description: 'The user_id that is created after signup!'
    },
    message: {
        type: GraphQLNonNull(GraphQLString),
        description: 'The message that shows registration message regarding customer!'
    }
};

//This is a query argument that will passed from the graphiql/front-end
export const signupUserArgs = {
    first_name:{
        type: GraphQLNonNull(GraphQLString),
        description: 'first name of the customer!'
    },
    last_name:{
        type: GraphQLNonNull(GraphQLString),
        description: 'Last name of customer!'
    },
    mobile_no:{
        type: GraphQLNonNull(GraphQLString),
        description: 'mobile no of customer!'
    },
    email: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Email id of user account!'
    },
    address:{
        type: GraphQLString,
        description: 'Address of customer!'
    },
    city:{
        type: GraphQLString,
        description: 'City of customer!'
    },
    state:{
        type: GraphQLString,
        description: 'State of the customer!'
    },
    country:{
        type: GraphQLString,
        description: 'Country of the customer!'
    },
    password: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Password of the user that want to do login!'
    }
};

export const signupResponse = new GraphQLObjectType({
    name: 'signupResponse',
    fields: () => ({
        ...signupUserFields
    })
});

export const signupMutations = {
    type: signupResponse,
    args: {
        ...signupUserArgs
    },
    async resolve(source, { first_name, last_name,email, password, mobile_no, ...rest }, context, info) {
        try {
            let { customers, passport }= db

            let existCustomer = await customers.findOne({where:{mobile_no}, raw:true})
            if(existCustomer)
                throw new Error(`This ${mobile_no} is already registered, 
                Please try with another mobile number!`)

            let generatedPassword = await generatePassword(password)

            let customer = await customers.create({
                first_name,
                last_name,
                email,
                mobile_no,
                ...rest
            }).then(data=>data.toJSON())


            console.log(`customer details is here!`, customer)

            //Create password
            await passport.create({
                user_type :'CUSTOMER',
                provider_type:'LOCAL',
                password:generatedPassword,
                user_id:customer.id
            })

            return {
                flag: true,
                user_id: customer.id,
                message : `Your account is created. Please login to continue!`
            };
        } catch (e) {
            throw Error(`Internal Error: ${e}`);
        }
    },
    description: 'Signup api for customer'
};