import { convertDbResponseToRawResponse, mapKeysToCamelCase } from '../database/dbUtils';
import { tables } from '../utils/constants';
import db from '@database/models';
import { Op } from 'sequelize';

// Check the requested cab is available to book or not!
export const checkCabAvailability = async (cabId) => {
  // Check already reserved this requested cab
  const cabReserved = await db.bookings.findOne({
    attributes: ['vehicleId', 'id', 'amount'],
    where: {
      status: 'CAB_ASSIGNED',
      vehicleId: cabId,
      endTime: null,
      createdAt: {
        [Op.gt]: new Date().setHours(0, 0, 0, 0),
        [Op.lt]: new Date()
      }
    },
    raw: true
  });

  return !cabReserved;
};

export const getNearestAvailableCabs = async ({ lat, long }) => {
  const { QueryTypes } = db.vehicles.sequelize;

  // Check already reserved cabs
  const bookedCabs = await db.bookings.findAll({
    attributes: ['vehicleId', 'id'],
    where: {
      status: 'CAB_ASSIGNED',
      endTime: null,
      createdAt: {
        [Op.gt]: new Date().setHours(0, 0, 0, 0),
        [Op.lt]: new Date()
      }
    }
  });
  const bookedCabIds = bookedCabs.map((cb) => cb.vehicleId);

  const distanceQuery = `
               (
                               select *
                               from distance(
                                       ${lat}, ${long},
                                       addr.lat, addr.long
                                   )
                           )       as disDiff
            `;
  const sqlQuery = `
                with distanceDiff as (
                    select vh.*,
                           vc.name as category,
                           vs.name as sub_category,
                           ${distanceQuery}
                    from ${tables.address} addr
                    inner join ${tables.vehicles} vh on vh.id = addr.item_id
                    inner join ${tables.vehicleCategories} vc on vc.id = vh.vehicle_category_id
                    inner join ${tables.vehicleSubCategories} vs on vs.id = vh.vehicle_sub_category_id
                    where addr.type = 'VEHICLE'
                    AND NOT (vh.id=ANY('{${bookedCabIds.join(',')}}'))
                    order by disDiff ASC
                    limit 20
                    )
                select * from distanceDiff;
            `;

  return mapKeysToCamelCase(await db.vehicles.sequelize.query(sqlQuery, { type: QueryTypes.SELECT }));
};

// Return cab detail by their id
export const getCabById = async (cabId) =>
  convertDbResponseToRawResponse(
    await db.vehicles.findOne({
      where: {
        id: cabId
      },
      include: [
        {
          model: db.vehicleCategories,
          attributes: ['name'],
          as: 'vehicle_category'
        },
        {
          model: db.vehicleSubCategories,
          attributes: ['name'],
          as: 'vehicle_sub_category'
        }
      ]
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
