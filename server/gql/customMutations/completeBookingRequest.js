import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getBookingById } from '../../daos/bookings';
import { distanceDiff, insertRecord, updateUsingId, upsertUsingCriteria } from '../../database/dbUtils';
import db from '@database/models';
import { ADDRESS_TYPE, BOOKING_STATUS, USER_TYPE } from '../../utils/constants';
import moment from 'moment';

import { times } from '../models/timestamps';

// This is response fields of the query
export const completeBookingFields = {
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
export const completeBookingArgs = {
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
  endTime: {
    type: GraphQLDateTime
  }
};

export const completeBookingResponse = new GraphQLObjectType({
  name: 'completeBookingResponse',
  fields: () => ({
    ...completeBookingFields
  })
});

// After acceptance of the request , for the booking updation need to use this query
export const completeBookingMutation = {
  type: completeBookingResponse,
  args: {
    ...completeBookingArgs
  },
  async resolve(source, { bookingId, endTime, lat, long }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.DRIVER });

      // Check the cab that is customer is requesting is available or not!
      const bookingAvailable = await getBookingById(bookingId);
      if (!bookingAvailable) throw new Error(`The booking is not available!`);

      if (bookingAvailable.status === BOOKING_STATUS.CONFIRMED) throw new Error(`This booking is already completed!`);

      // Do entry in the booking table for booking request!
      const updatedBooking = await updateUsingId(db.bookings, {
        id: bookingId,
        endTime: endTime ? moment(endTime).format('HH:mm:ss') : moment().format('HH:mm:ss'),
        status: BOOKING_STATUS.CONFIRMED
      }).then((data) => data.toJSON());

      // In background update the vehicle/driver lat/long
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

      // Calculate distance in km to calculate the price below!
      const km = distanceDiff(
        bookingAvailable.pickupLat,
        bookingAvailable.pickupLong,
        bookingAvailable.destinationLat,
        bookingAvailable.destinationLat
      );
      console.log(`km are`, km);
      const amount = km * bookingAvailable.amount;

      await insertRecord(db.payments, {
        bookingId: bookingAvailable.id,
        payableAmount: amount
      });

      updatedBooking.amount = amount;
      return updatedBooking;
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'Cab booking mutation for customer!'
};
