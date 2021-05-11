import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { vehicleCategoryQueries } from './vehicleCategories';
import db from '@database/models';
const { nodeInterface } = getNode();

export const VehicleSubCategoryFields = {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) }
};

// Vehicle Sub Category
export const VehicleSubCategory = new GraphQLObjectType({
    name: 'VehicleSubCategory',
    interfaces: [nodeInterface],
    fields: () => ({
        ...VehicleSubCategoryFields,
        categories: {
            ...vehicleCategoryQueries.list,
            resolve: (source, args, context, info) =>
                vehicleCategoryQueries.list.
                resolve(source, args, { ...context, vehicleSubCategory: source.dataValues }, info)
        }
    })
});

// relay compliant list
export const VehicleSubCategoryConnection = createConnection({
    nodeType: VehicleSubCategory,
    name: 'vehicleSubCategories',
    target: db.vehicleSubCategories,
    before: (findOptions, args, context) => {
        findOptions.include = findOptions.include || [];

        if (context?.vehicleCategory?.id) {
            findOptions.include.push({
                model: db.vehicleCategories,
                as:'vehicle_category',
                where: {
                    id: context.vehicleCategory?.id
                }
            });
        }
        return findOptions;
    }
});

// queries on the VehicleSubCategory table
export const vehicleSubCategoryQueries = {
    args: {
        id: {
            type: GraphQLNonNull(GraphQLInt)
        }
    },
    query: {
        type: VehicleSubCategory
    },
    list: {
        ...VehicleSubCategoryConnection,
        type: VehicleSubCategoryConnection.connectionType,
        args: VehicleSubCategoryConnection.connectionArgs
    },
    model: db.vehicleSubCategories
};
