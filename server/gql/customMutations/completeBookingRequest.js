import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getBookingById } from '../../daos/bookings';
import { insertRecord, updateUsingId, upsertUsingCriteria } from '../../database/dbUtils';
import db from '@database/models';
import { ADDRESS_TYPE, BOOKING_STATUS, USER_TYPE } from '../../utils/constants';
import moment from 'moment';

// This is response fields of the query
export const completeBookingFields = {
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
  amount: {
    type: GraphQLNonNull(GraphQLInt)
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
  async resolve(source, { bookingId, endTime, lat, long, amount }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.DRIVER });

      // Check the cab that is customer is requesting is available or not!
      const bookingAvailable = await getBookingById(bookingId);
      if (!bookingAvailable) throw new Error(`The booking is not available!`);

      if (bookingAvailable.status === BOOKING_STATUS.CONFIRMED) throw new Error(`This booking is already completed!`);

      // Do entry in the booking table for booking request!
      await updateUsingId(db.bookings, {
        id: bookingId,
        endTime: endTime ? moment(endTime).format('HH:mm:ss') : moment().format('HH:mm:ss'),
        status: BOOKING_STATUS.CONFIRMED
      });

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

      amount = amount || 100;

      // Todo on a confirmation of booking , Do entry in a payments table!
      await insertRecord(db.payments, {
        bookingId: bookingAvailable.id,
        payableAmount: amount
      });

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
