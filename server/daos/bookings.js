import { convertDbResponseToRawResponse, transformDbArrayResponseToRawResponse } from '../database/dbUtils';
import { BOOKING_STATUS } from '../utils/constants';
import db from '@database/models';
import { Op } from 'sequelize';
import moment from 'moment';

export const getPastBookingDetailsOfCustomer = async ({ customerId, startDate, status = [] }) => {
  const where = {
    status: { [Op.in]: [BOOKING_STATUS.CONFIRMED] }
  };

  if (customerId) {
    where.customerId = customerId;
  }

  if (status) {
    where.status = { [Op.in]: status };
  }

  if (startDate) {
    where.createdAt = {
      [Op.gt]: moment(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })),
      [Op.lt]: moment()
    };
  }

  return transformDbArrayResponseToRawResponse(
    await db.bookings.findAll({
      where: {
        ...where
      },
      include: [
        {
          model: db.vehicles,
          attributes: ['id', 'vehicleNumber', 'modelNo'],
          as: 'vehicle'
        }
      ]
    })
  );
};

// Return cab detail by their id
export const getBookingById = async (bookingId) =>
  convertDbResponseToRawResponse(
    await db.bookings.findOne({
      where: {
        id: bookingId
      },
      include: [
        {
          model: db.vehicles,
          attributes: ['id', 'vehicleNumber', 'modelNo'],
          as: 'vehicle'
        },
        {
          model: db.customers,
          attributes: ['id', 'firstName', 'lastName', 'mobileNo', 'email'],
          as: 'customer'
        },
        {
          model: db.drivers,
          attributes: ['id', 'firstName', 'lastName', 'mobileNo', 'email', 'drivingLicenseNumber'],
          as: 'driver'
        }
      ]
    })
  );
