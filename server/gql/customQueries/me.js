import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLFloat
} from 'graphql';
import db from '@database/models';

let userFields = new GraphQLObjectType({
    name: 'userFields',
    fields: () => ({
        id:{
            type: GraphQLNonNull(GraphQLInt)
        },
        firstName:{
            type: GraphQLNonNull(GraphQLString)
        },
        lastName:{
            type: GraphQLNonNull(GraphQLString)
        },
    })
});

//This is response fields of the nearest vehicle queries
export const loginUserDetail = {
    flag:{
        type: GraphQLNonNull(GraphQLBoolean),
        description    : 'This field state that the customer signup is done perfectly or not!'
    },
    data: {
        type : userFields
    }
};

export const isLoggedinResponse = new GraphQLObjectType({
    name: 'isLoggedinResponse',
    fields: () => ({
        ...loginUserDetail
    })
});

export const isLoggedinQuery = {
    type: isLoggedinResponse,
    args: {},
    async resolve(source, {  }, {user}, info) {
        try {
            let { Customers } = db

            console.log(`context user data is here!`, user)

            // make sure user is logged in
            if (!user) {
                throw new Error('You are not authenticated!')
            }

            // user is authenticated
            return await Customers.findById(user.id)
        } catch (e) {
            throw Error(`Internal Error: ${e}`);
        }
    },
    description: 'To get nearest devices available for customer'
};