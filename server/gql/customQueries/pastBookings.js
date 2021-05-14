import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLFloat } from 'graphql';
import { getPastBookingDetailsOfCustomer } from '@daos/bookings';
import { USER_TYPE } from '../../utils/constants';
import { GraphQLDateTime } from 'graphql-iso-date/dist';
import { timestamps, times } from '../models/timestamps';

const pastBookingResponseFields = new GraphQLObjectType({
  name: 'pastBookingResponseFields',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    vehicleNumber: {
      type: GraphQLNonNull(GraphQLString)
    },
    vehicleId: {
      type: GraphQLNonNull(GraphQLInt)
    },
    category: {
      type: GraphQLString
    },
    subCategory: {
      type: GraphQLString
    },
    pickupLat: {
      type: GraphQLNonNull(GraphQLFloat)
    },
    pickupLong: {
      type: GraphQLNonNull(GraphQLFloat)
    },
    destinationLat: {
      type: GraphQLNonNull(GraphQLFloat)
    },
    destinationLong: {
      type: GraphQLNonNull(GraphQLFloat)
    },
    ...times,
    ...timestamps
  })
});

// This is response fields of the past bookings queries
export const pastBookingFields = {
  data: {
    type: GraphQLList(pastBookingResponseFields)
  }
};

// This is a query argument that will passed from the graphiql/front-end
export const bookingListArgs = {
  status: {
    type: GraphQLList(GraphQLString),
    description: 'status for the customer booking, show that the booking is confirmed or NA'
  },
  startDate: {
    type: GraphQLDateTime,
    description: 'start date for the customer want to fetch the record!'
  },
  endDate: {
    type: GraphQLDateTime,
    description: 'end date for the customer want to fetch the record!'
  }
};

export const pastBookingResponse = new GraphQLObjectType({
  name: 'pastBookingResponse',
  fields: () => ({
    ...pastBookingFields
  })
});

export const pastBookingQueries = {
  type: pastBookingResponse,
  args: {
    ...bookingListArgs
  },
  async resolve(source, { ...rest }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.CUSTOMER });

      const allBookings = await getPastBookingDetailsOfCustomer({
        customerId: user.userId || 51, // Todo to remove later static customer-id!
        ...rest
      });

      return {
        data: allBookings
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'To get nearest devices available for customer'
};
