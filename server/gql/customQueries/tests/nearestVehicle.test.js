import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { vehicleCategoriesTable, vehiclesTable, vehicleSubCategoriesTable } from '@utils/testUtils/mockData';

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
      expect(get(response, 'body.data.nearestCabs')).toBeTruthy();
      const result = get(response, 'body.data.nearestCabs.data[0]');

      expect(result).toEqual(
        expect.objectContaining({
          id: vehiclesTable[0].id,
          vehicleNumber: vehiclesTable[0].vehicleNumber,
          category: vehicleCategoriesTable[0].name,
          subCategory: vehicleSubCategoriesTable[0].name
        })
      );
      done();
    });
  });
});