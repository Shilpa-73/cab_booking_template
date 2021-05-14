import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import db from '@database/models';
import { bookingQueries } from './bookings';
import { timestamps } from './timestamps';

const { nodeInterface } = getNode();
export const customerFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  firstName: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'first_name' },
  lastName: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'last_name' },
  mobileNo: { type: GraphQLNonNull(GraphQLString), sqlColumn: 'mobile_no' },
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
    ...customerFields,
    ...timestamps,
    bookings: {
      ...bookingQueries.list,
      resolve: (source, args, context, info) =>
        bookingQueries.list.resolve(source, args, { ...context, customer: source.dataValues }, info)
    }
  })
});

// relay compliant list
export const CustomerConnection = createConnection({
  nodeType: Customer,
  name: 'customers',
  target: db.customers,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    if (context?.booking?.id) {
      findOptions.include.push({
        model: db.bookings,
        as: 'bookings',
        where: {
          id: context.booking?.id
        }
      });
    }
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
