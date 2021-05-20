import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { driversTable, vehiclesTable, bookingTable } from '@utils/testUtils/mockData';

describe('Get Past-Bookings record for logged-in customer!', () => {
  const pastBookingsQuery = `
      query {
         pastBookings(status: ["REQUESTED","CONFIRMED"]) {
            data {
              id
              createdAt
              updatedAt
              vehicleId
              startTime
              endTime
            }
          }
      }
  `;

  it('should request for past bookings records!', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.vehicles, 'findAll').mockImplementation(() => [vehiclesTable[0]]);

    jest.spyOn(dbClient.models.drivers, 'findAll').mockImplementation(() => [driversTable[0]]);

    await getResponse(pastBookingsQuery).then((response) => {
      expect(get(response, 'body.data.pastBookings')).toBeTruthy();
      const result = get(response, 'body.data.pastBookings.data[0]');
      expect(result).toEqual(
        expect.objectContaining({
          id: bookingTable[0].id,
          vehicleId: bookingTable[0].vehicleId
        })
      );
      done();
    });
  });
});
