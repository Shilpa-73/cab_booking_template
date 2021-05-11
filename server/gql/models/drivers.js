import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import db from '@database/models';
import {bookingQueries} from "./bookings";

const { nodeInterface } = getNode();
export const driverFields = {
    id: { type: GraphQLNonNull(GraphQLID) },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    mobile_no: { type: GraphQLString },
    email: { type: GraphQLString },
    driving_license_number: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString }
};

// Driver
export const Driver = new GraphQLObjectType({
    name: 'Driver',
    interfaces: [nodeInterface],
    fields: () => ({
        ...driverFields,
        bookings: {
            ...bookingQueries.list,
            resolve: (source, args, context, info) =>
                bookingQueries.list.resolve(source, args, { ...context, driver: source.dataValues }, info)
        }
    })
});

// relay compliant list
export const DriverConnection = createConnection({
    nodeType: Driver,
    name: 'drivers',
    target: db.drivers,
    before: (findOptions, args, context) => {
        findOptions.include = findOptions.include || [];

        if (context?.booking?.id) {
            findOptions.include.push({
                model: db.bookings,
                as:'bookings',
                where: {
                    id: context.booking?.id
                }
            });
        }

        return findOptions;
    }
});

// queries on the drivers table
export const driverQueries = {
    args: {
        id: {
            type: GraphQLNonNull(GraphQLInt)
        }
    },
    query: {
        type: Driver
    },
    list: {
        ...DriverConnection,
        type: DriverConnection.connectionType,
        args: DriverConnection.connectionArgs
    },
    model: db.drivers
};

export const driverMutations = {
    args: driverFields,
    type: Driver,
    model: db.drivers
};
