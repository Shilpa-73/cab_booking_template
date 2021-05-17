import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { bookingTable, driversTable } from '@utils/testUtils/mockData';

describe('Booking graphQL-server-DB query tests', () => {
  const id = 1;
  const bookingQuery = `
  query {
    booking (id: ${id}) {
        id
        vehicleId
        drivers{
          edges{
            node{
              id
              firstName
              lastName
            }
          }
        }
    }
  }
  `;
  it('should request for booking with its driver detail', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.drivers, 'findAll').mockImplementation(() => [driversTable[0]]);

    await getResponse(bookingQuery).then((response) => {
      expect(get(response, 'body.data.booking')).toBeTruthy();

      const vResult = get(response, 'body.data.booking');
      expect(vResult).toEqual(
        expect.objectContaining({
          id: bookingTable[0].id,
          vehicleId: bookingTable[0].vehicleId
        })
      );

      const result = get(response, 'body.data.booking.drivers.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: driversTable[0].id,
          firstName: driversTable[0].firstName,
          lastName: driversTable[0].lastName
        })
      );

      done();
    });
  });
});
