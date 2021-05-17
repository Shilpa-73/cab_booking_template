import get from 'lodash/get';
import { bookingTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Bookings graphQL-server-DB pagination tests', () => {
  const bookingsQuery = `
  query {
    bookings (first: 1){
      edges {
        node {
            id
            vehicleId
            startTime
            endTime
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

  it('should have a query to get the bookings request!', async (done) => {
    await getResponse(bookingsQuery).then((response) => {
      const result = get(response, 'body.data.bookings.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: bookingTable[0].id,
          vehicleId: bookingTable[0].vehicleId
          // startTime: bookingTable[0].startTime,
          // endTime: bookingTable[0].endTime,
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async (done) => {
    await getResponse(bookingsQuery).then((response) => {
      const result = get(response, 'body.data.bookings.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });
});
