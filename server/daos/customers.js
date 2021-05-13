import { convertDbResponseToRawResponse } from '../database/dbUtils';
import { USER_TYPE } from '../utils/constants';
import db from '@database/models';

// Return cab detail by their id
export const getCustomerById = async (customerId, withPassword = false) => {
  const response = {};
  try {
    response.user = convertDbResponseToRawResponse(
      await db.customers.findOne({
        where: {
          id: customerId
        },
        include: [
          {
            model: db.passport,
            as: 'vehicle_category'
          }
        ]
      })
    );

    if (withPassword) {
      await db.passport.findOne({
        where: {
          userType: USER_TYPE.CUSTOMER,
          userId: response.user.id
        }
      });
    }

    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};

// find single customer detail by mobileNo/Email Id
export const getCustomerByWhere = async (where) =>
  convertDbResponseToRawResponse(
    await db.customers.findOne({
      where
    })
  );

export const bookCabs = async ({ cabId, ...rest }) => {
  const response = {};
  try {
    response.bookignData = await db.bookings.create({
      ...rest
    });

    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};
