import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import db from '@database/models';

const { nodeInterface } = getNode();
export const customerFields = {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    amount: { type: GraphQLInt }
};

// Customer
export const Customer = new GraphQLObjectType({
    name: 'Product',
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
