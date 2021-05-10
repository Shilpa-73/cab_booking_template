import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import db from '@database/models';

const { nodeInterface } = getNode();
export const customerFields = {
    id: { type: GraphQLNonNull(GraphQLID) },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    mobile_no: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString }
};

// Customer
export const Customer = new GraphQLObjectType({
    name: 'Customer',
    interfaces: [nodeInterface],
    fields: () => ({
        ...customerFields
    })
});

// relay compliant list
export const CustomerConnection = createConnection({
    nodeType: Customer,
    name: 'customers',
    target: db.customers,
    before: (findOptions, args, context) => {
        findOptions.include = findOptions.include || [];
        return findOptions;
    }
});

// queries on the customers table
export const customerQueries = {
    args: {
        id: {
            type: GraphQLNonNull(GraphQLInt)
        }
    },
    query: {
        type: Customer
    },
    list: {
        ...CustomerConnection,
        type: CustomerConnection.connectionType,
        args: CustomerConnection.connectionArgs
    },
    model: db.customers
};

export const customerMutations = {
    args: customerFields,
    type: Customer,
    model: db.customers
};
