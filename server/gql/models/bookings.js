import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { driverQueries } from './drivers';
import { customerQueries } from './customers';
// import { customerQueries } from './vehicles';
import { getNode } from '@gql/node';
import db from '@database/models';
import { times, timestamps } from './timestamps';

const { nodeInterface } = getNode();
export const BookingFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  sourceAddress: { type: GraphQLString, sqlColumn: 'source_address' },
  destinationAddress: { type: GraphQLString, sqlColumn: 'destination_address' },
  pickupAddress: { type: GraphQLString, sqlColumn: 'pickup_address' },
  status: { type: GraphQLString },
  vehicleId: { type: GraphQLInt, sqlColumn: 'vehicle_id' }
};

// Booking
export const Booking = new GraphQLObjectType({
  name: 'Booking',
  interfaces: [nodeInterface],
  fields: () => ({
    ...BookingFields,
    ...times,
    ...timestamps,
    drivers: {
      ...driverQueries.list,
      resolve: (source, args, context, info) =>
        driverQueries.list.resolve(source, args, { ...context, booking: source.dataValues }, info)
    },
    customers: {
      ...customerQueries.list,
      resolve: (source, args, context, info) =>
        customerQueries.list.resolve(source, args, { ...context, booking: source.dataValues }, info)
    }
  })
});

// relay compliant list
export const BookingConnection = createConnection({
  nodeType: Booking,
  name: 'booking',
  target: db.bookings,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    if (context?.vehicle?.id) {
      findOptions.include.push({
        model: db.vehicles,
        as: 'vehicle',
        where: {
          id: context.vehicle.id
        }
      });
    }

    if (context?.driver?.id) {
      findOptions.include.push({
        model: db.drivers,
        as: 'driver',
        where: {
          id: context.driver.id
        }
      });
    }

    if (context?.customer?.id) {
      findOptions.include.push({
        model: db.customers,
        as: 'customer',
        where: {
          id: context.customer.id
        }
      });
    }
    return findOptions;
  }
});

// queries on the vehicleCategories table
export const bookingQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Booking
  },
  list: {
    ...BookingConnection,
    type: BookingConnection.connectionType,
    args: BookingConnection.connectionArgs
  },
  model: db.bookings
};
