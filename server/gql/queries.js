import {GraphQLObjectType, GraphQLNonNull, GraphQLInt} from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import {defaultArgs, resolver} from 'graphql-sequelize';
import {getNode} from '@gql/node';
import {Customer, customerQueries} from '@gql/models/customers';
import {Driver, driverQueries} from '@gql/models/drivers';
import {VehicleCategory, vehicleCategoryQueries} from '@gql/models/vehicleCategories';
import {VehicleSubCategory, vehicleSubCategoryQueries} from '@gql/models/vehicleSubCategories';
import {bookingQueries} from '@gql/models/bookings';
import {nearestVehicleQueries} from '@gql/customQueries/nearestVehicle';
import {isLoggedinQuery} from '@gql/customQueries/me';

const {nodeField, nodeTypeMapper} = getNode();

const DB_TABLES = {
    customer: customerQueries,
    driver: driverQueries,
    vehicleCategory: vehicleCategoryQueries,
    vehicleSubCategory: vehicleSubCategoryQueries,
    booking: bookingQueries
};

const CUSTOMS = {
    nearestVehicle: nearestVehicleQueries,
    me: isLoggedinQuery
};


console.log(`VehicleCategoryQueries is `, vehicleCategoryQueries.query)

export const addQueries = () => {
    const query = {};
    Object.keys(DB_TABLES).forEach(table => {
        query[camelCase(table)] = {
            ...DB_TABLES[table].query,
            resolve: resolver(DB_TABLES[table].model),
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)},
                ...DB_TABLES[table].args,
                ...defaultArgs(DB_TABLES[table].model)
            }
        };
        query[pluralize(camelCase(table))] = {
            ...DB_TABLES[table].list
        };
    });

    // adding Queries from CUSTOMS (those which have custom resolvers)
    Object.keys(CUSTOMS).forEach(que => {
        query[camelCase(que)] = {
            ...CUSTOMS[que]
        };
    });
    return query;
};

nodeTypeMapper.mapTypes({
    customers: Customer
});
export const QueryRoot = new GraphQLObjectType({
    name: 'Query',
    node: nodeField,
    fields: () => ({
        ...addQueries()
    })
});
