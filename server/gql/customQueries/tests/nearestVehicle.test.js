import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Get Nearest Cabs available to book for logged-in customer!', () => {
  const coordinates = {
    lat: -0.1277,
    long: 51.5073
  };

  const nearestCabsQuery = `
      query {
         nearestCabs(lat: ${coordinates.lat}, long: ${coordinates.long}) {
            data {
              id
              vehicleNumber
              category
              subCategory
              distanceDiff
            }
          }
      }
  `;

  it('should request for nearest cabs for booking!', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(nearestCabsQuery).then((response) => {
      console.log(`response.body is here!`, response.body);

      expect(get(response, 'body.data.nearestCabs')).toBeTruthy();
      const result = get(response, 'body.data.nearestCabs.data');

      console.log(`nearest cabs response is here!`, result);
      done();
    });
  });
});
