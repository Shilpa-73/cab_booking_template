import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getBookingById } from '@daos/bookings';
import { distanceDiff, updateUsingId, upsertUsingCriteria } from '@database/dbUtils';
import db from '@database/models';
import { ADDRESS_TYPE, BOOKING_STATUS, USER_TYPE } from '@utils/constants';
import moment from 'moment';

import { times } from '@gql/models/timestamps';

// This is response fields of the query
export const confirmBookingFields = {
  id: {
    type: GraphQLNonNull(GraphQLInt),
    description: 'The id of the booking!'
  },
  status: {
    type: GraphQLNonNull(GraphQLString),
    description: 'The current status of the booking request!'
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
  amount: {
    type: GraphQLNonNull(GraphQLFloat)
  },
  ...times
};

// This is a query argument that will passed from the graphiql/front-end
export const confirmBookingArgs = {
  bookingId: {
    type: GraphQLNonNull(GraphQLInt),
    description: 'id of booking request that driver wants to book!'
  },
  lat: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'current lat of driver wants to book!'
  },
  long: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'current long of driver'
  },
  startTime: {
    type: GraphQLDateTime
  },
  endTime: {
    type: GraphQLDateTime
  }
};

export const confirmBookingResponse = new GraphQLObjectType({
  name: 'confirmBookingResponse',
  fields: () => ({
    ...confirmBookingFields
  })
});

// First time driver confirm the request! & customer will receive the message for updates
export const confirmBookingMutation = {
  type: confirmBookingResponse,
  args: {
    ...confirmBookingArgs
  },
  async resolve(source, { bookingId, lat, long, startTime }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.DRIVER });

      // Check the cab that is customer is requesting is available or not!
      const bookingAvailable = await getBookingById(bookingId);
      if (!bookingAvailable) throw new Error(`The booking is not available!`);

      if (bookingAvailable.status === BOOKING_STATUS.CAB_ASSIGNED)
        throw new Error(`This booking request is already confirmed!`);

      // Do entry in the booking table for booking request!
      const updatedBooking = await updateUsingId(db.bookings, {
        id: bookingId,
        status: BOOKING_STATUS.CAB_ASSIGNED,
        startTime: startTime ? moment(startTime).format('HH:mm:ss') : moment().format('HH:mm:ss'),
        driverId: user.userId || 1 // Todo to remove later and use user.id from the context! after auth middleware implementation
      }).then((data) => data.toJSON());

      // Todo set driver address and cab address lat/long to its related table!
      await Promise.all([
        new Promise((resolve, reject) => {
          upsertUsingCriteria(
            db.address,
            {
              lat,
              long,
              itemId: bookingAvailable.driverId,
              type: ADDRESS_TYPE.DRIVER
            },
            {
              itemId: bookingAvailable.driverId,
              type: ADDRESS_TYPE.DRIVER
            }
          );
          resolve();
        }),
        new Promise((resolve, reject) => {
          upsertUsingCriteria(
            db.address,
            {
              lat,
              long,
              itemId: bookingAvailable.vehicleId,
              type: ADDRESS_TYPE.VEHICLE
            },
            {
              itemId: bookingAvailable.vehicleId,
              type: ADDRESS_TYPE.VEHICLE
            }
          );
          resolve();
        })
      ]);

      const km = distanceDiff(
        bookingAvailable.pickupLat,
        bookingAvailable.pickupLong,
        bookingAvailable.destinationLat,
        bookingAvailable.destinationLat
      );
      console.log(`km are`, km);
      const amount = km * bookingAvailable.amount;

      console.log(`updatedBooking is `, updatedBooking);

      return {
        ...updatedBooking,
        amount
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'Cab booking mutation for customer!'
};
