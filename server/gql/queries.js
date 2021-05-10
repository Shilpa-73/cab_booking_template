import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultArgs, resolver } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { Customer, customerQueries } from '@gql/models/customers';

const { nodeField, nodeTypeMapper } = getNode();

const DB_TABLES = {
  customer: customerQueries
};

export const addQueries = () => {
  const query = {};
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES[table].query,
      resolve: resolver(DB_TABLES[table].model),
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        ...DB_TABLES[table].args,
        ...defaultArgs(DB_TABLES[table].model)
      }
    };
    query[pluralize(camelCase(table))] = {
      ...DB_TABLES[table].list
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