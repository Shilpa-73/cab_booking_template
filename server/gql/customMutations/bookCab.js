import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import { bookCabs, checkCabAvailability, getCabById } from '../../daos/cabs';
import { USER_TYPE } from '../../utils/constants';
import { confirmBookingFields } from './confirmBookingRequest';

// This is response fields of the query
export const cabBookingFields = {
  bookingId: {
    type: GraphQLNonNull(GraphQLInt),
    description: 'Booking Id to trace the booking request!'
  },
  booking: {
    type: new GraphQLObjectType({
      name: 'bookingType',
      fields: () => ({
        ...confirmBookingFields
      })
    })
  },
  message: {
    type: GraphQLNonNull(GraphQLString),
    description: 'The text message will show up on front-end!'
  }
};

// This is a query argument that will passed from the graphiql/front-end
export const cabBookingArgs = {
  pickupAddress: {
    type: GraphQLNonNull(GraphQLString),
    description: 'pickup address of the customer!'
  },
  destinationAddress: {
    type: GraphQLNonNull(GraphQLString),
    description: 'destination address of the customer!'
  },
  pickupLat: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'latitude of pickup address'
  },
  pickupLong: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'longitude of pickup address'
  },
  destinationLat: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'latitude of destination address'
  },
  destinationLong: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'longitude of destination address'
  },
  vehicleId: {
    type: GraphQLNonNull(GraphQLInt),
    description: 'id of cab that customer wants to book!'
  }
};

export const cabBookingResponse = new GraphQLObjectType({
  name: 'cabBookingResponse',
  fields: () => ({
    ...cabBookingFields
  })
});

export const cabBookingMutation = {
  type: cabBookingResponse,
  args: {
    ...cabBookingArgs
  },
  async resolve(
    source,
    { pickupLat, pickupLong, destinationLat, destinationLong, pickupAddress, destinationAddress, vehicleId },
    { user, isAuthenticatedUser },
    info
  ) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.CUSTOMER });

      // Check the cab that is customer is requesting is available or not!
      const cabAvailable = await checkCabAvailability(vehicleId);
      if (!cabAvailable) throw new Error(`The requested cab is not available for booking!`);

      // Do other stuff for booking once the cab is available
      // Get cab details
      const cabDetails = await getCabById(vehicleId);

      // Do entry in the booking table for booking request!
      const response = await bookCabs({
        pickupLat,
        pickupLong,
        destinationLat,
        destinationLong,
        pickupAddress,
        destinationAddress,
        vehicleId,
        amount: cabDetails.amount, // Because it happens sometime that cab amount will
        // change in future so we could fetch the exact amount of booking time
        customerId: 51 // Todo to remove later and use user.id from the context! after auth middleware implementation
      });

      return {
        bookingId: response.bookingData.id,
        booking: {
          ...response.bookingData
        },
        message: `Your booking has been requested!,
                 Please wait util confirmation`
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'Cab booking mutation for customer!'
};
