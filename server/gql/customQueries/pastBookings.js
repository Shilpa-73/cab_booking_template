import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import { getPastBookingDetailsOfCustomer } from '@daos/bookings';
import { USER_TYPE } from '../../utils/constants';

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
    startTime: {
      type: GraphQLString
    },
    endTime: {
      type: GraphQLString
    }
  })
});

// This is response fields of the past bookings queries
export const pastBookingFields = {
  flag: {
    type: GraphQLNonNull(GraphQLBoolean),
    description: 'This field state that the customer signup is done perfectly or not!'
  },
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
    type: GraphQLString,
    description: 'date for the customer want to fetch the record!'
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
        customerId: 51, // Todo to remove later static customer-id!
        ...rest
      });

      return {
        flag: true,
        data: allBookings
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'To get nearest devices available for customer'
};
