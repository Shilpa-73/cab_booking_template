import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import db from '@database/models';
import {vehicleCategoryQueries} from "./vehicleCategories";
import {vehicleSubCategoryQueries} from "./vehicleSubCategories";
import {bookingQueries} from "./bookings";

const { nodeInterface } = getNode();
export const vehicleFields = {
    id: { type: GraphQLNonNull(GraphQLID) },
    vehicle_number: { type: GraphQLString },
    amount: { type: GraphQLInt },
    model_no: { type: GraphQLString },
    brand_name: { type: GraphQLString },
    manufacturing_year: { type: GraphQLString }
};

// Vehicle
export const Vehicle = new GraphQLObjectType({
    name: 'Vehicle',
    interfaces: [nodeInterface],
    fields: () => ({
        ...vehicleFields,
        vehicleCategory: {
            ...vehicleCategoryQueries.list,
            resolve: (source, args, context, info) =>
                vehicleCategoryQueries.list.resolve(source, args, { ...context, vehicle: source.dataValues }, info)
        },
        vehicleSubCategory: {
            ...vehicleSubCategoryQueries.list,
            resolve: (source, args, context, info) =>
                vehicleSubCategoryQueries.list.resolve(source, args, { ...context, vehicle: source.dataValues }, info)
        },
        bookings: {
            ...bookingQueries.list,
            resolve: (source, args, context, info) =>
                bookingQueries.list.resolve(source, args, { ...context, vehicle: source.dataValues }, info)
        }
    })
});

// relay compliant list
export const VehicleConnection = createConnection({
    nodeType: Vehicle,
    name: 'vehicles',
    target: db.vehicles,
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

        if (context?.vehicleCategory?.id) {
            findOptions.include.push({
                model: db.vehicleCategories,
                as:'vehicle_category',
                where: {
                    id: context.vehicleCategory?.id
                }
            });
        }

        if (context?.vehicleSubCategory?.id) {
            findOptions.include.push({
                model: db.vehicleSubCategories,
                as:'vehicle_sub_category',
                where: {
                    id: context.vehicleSubCategory?.id
                }
            });
        }
        return findOptions;
    }
});

// queries on the vehicles table
export const vehicleQueries = {
    args: {
        id: {
            type: GraphQLNonNull(GraphQLInt)
        }
    },
    query: {
        type: Vehicle
    },
    list: {
        ...VehicleConnection,
        type: VehicleConnection.connectionType,
        args: VehicleConnection.connectionArgs
    },
    model: db.vehicles
};

export const vehicleMutations = {
    args: vehicleFields,
    type: Vehicle,
    model: db.vehicles
};
