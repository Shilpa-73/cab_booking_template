import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { vehicleSubCategoryQueries } from './vehicleSubCategories';
import { getNode } from '@gql/node';
import db from '@database/models';
import { vehicleQueries } from './vehicles';

const { nodeInterface } = getNode();
export const VehicleCategoryFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString }
};

// VehicleCategory
export const VehicleCategory = new GraphQLObjectType({
  name: 'VehicleCategory',
  interfaces: [nodeInterface],
  fields: () => ({
    ...VehicleCategoryFields,
    vehicleSubCategories: {
      ...vehicleSubCategoryQueries.list,
      resolve: (source, args, context, info) =>
        vehicleSubCategoryQueries.list.resolve(source, args, { ...context, vehicleCategory: source.dataValues }, info)
    },
    vehicles: {
      ...vehicleQueries.list,
      resolve: (source, args, context, info) =>
        vehicleQueries.list.resolve(source, args, { ...context, vehicleCategory: source.dataValues }, info)
    }
  })
});

// relay compliant list
export const VehicleCategoryConnection = createConnection({
  nodeType: VehicleCategory,
  name: 'vehicleCategories',
  target: db.vehicleCategories,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    if (context?.vehicleSubCategory?.id) {
      findOptions.include.push({
        model: db.vehicleSubCategories,
        as: 'vehicle_sub_categories',
        where: {
          id: context.vehicleSubCategory.id
        }
      });
    }

    if (context?.vehicle?.id) {
      findOptions.include.push({
        model: db.vehicles,
        as: 'vehicles',
        where: {
          id: context.vehicle.id
        }
      });
    }
    return findOptions;
  }
});

// queries on the vehicleCategories table
export const vehicleCategoryQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: VehicleCategory
  },
  list: {
    ...VehicleCategoryConnection,
    type: VehicleCategoryConnection.connectionType,
    args: VehicleCategoryConnection.connectionArgs
  },
  model: db.vehicleCategories
};
