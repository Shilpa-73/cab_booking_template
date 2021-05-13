import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import { getBookingById } from '../../daos/bookings';
import { updateUsingId, upsertUsingCriteria } from '../../database/dbUtils';
import db from '@database/models';
import { ADDRESS_TYPE, BOOKING_STATUS, USER_TYPE } from '../../utils/constants';
import moment from 'moment';

// This is response fields of the query
export const confirmBookingFields = {
  flag: {
    type: GraphQLNonNull(GraphQLBoolean),
    description: 'The flag state the boolean value identify the booking is successful or not!'
  },
  message: {
    type: GraphQLNonNull(GraphQLString),
    description: 'The text message will show up on front-end!'
  }
};

// This is a query argument that will passed from the graphiql/front-end
export const confirmBookingArgs = {
  bookingId: {
    type: GraphQLNonNull(GraphQLInt),
    description: 'id of booking request that driver wants to book!'
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
  async resolve(source, { bookingId, lat, long }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.DRIVER });

      // Check the cab that is customer is requesting is available or not!
      const bookingAvailable = await getBookingById(bookingId);
      if (!bookingAvailable) throw new Error(`The booking is not available!`);

      // Do entry in the booking table for booking request!
      await updateUsingId(db.bookings, {
        id: bookingId,
        status: BOOKING_STATUS.CAB_ASSIGNED,
        startTime: moment(),
        driverId: user.userId || 1 // Todo to remove later and use user.id from the context! after auth middleware implementation
      });

      // Todo set driver address and cab address lat/long to its related table!
      await Promise.all([
        new Promise((resolve, reject) => {
          upsertUsingCriteria(
            db.address,
            {
              lat,
              long
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
              long
            },
            {
              itemId: bookingAvailable.vehicleId,
              type: ADDRESS_TYPE.VEHICLE
            }
          );
          resolve();
        })
      ]);

      return {
        flag: true,
        message: `Your booking has been confirmed!`
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'Cab booking mutation for customer!'
};

// After acceptance of the request , for the booking updation need to use this query
export const updateBookingMutation = {
  type: confirmBookingResponse,
  args: {
    ...confirmBookingArgs
  },
  async resolve(source, { bookingId, endTime, lat, long }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.DRIVER });

      // Check the cab that is customer is requesting is available or not!
      const bookingAvailable = await getBookingById(bookingId);
      if (!bookingAvailable) throw new Error(`The booking is not available!`);

      // Do entry in the booking table for booking request!
      await updateUsingId(db.bookings, {
        id: bookingId,
        endTime,
        status: BOOKING_STATUS.CONFIRMED
      });

      // Todo testing pending!
      await Promise.all([
        new Promise((resolve, reject) => {
          upsertUsingCriteria(
            db.address,
            {
              lat,
              long
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
              long
            },
            {
              itemId: bookingAvailable.vehicleId,
              type: ADDRESS_TYPE.VEHICLE
            }
          );
          resolve();
        })
      ]);

      // Todo on a confirmation of booking , Do entry in a payments table!

      return {
        flag: true,
        message: `Your booking has been confirmed!`
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'Cab booking mutation for customer!'
};
