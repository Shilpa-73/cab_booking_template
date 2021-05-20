import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { vehicleCategoriesTable } from '@utils/testUtils/mockData';

describe('VehicleCategory graphQL-server-DB query tests', () => {
  const id = 1;
  const vehicleCategoryQuery = `
  query {
    vehicleCategory (id: ${id}) {
        id
        name
    }
  }
  `;
  it('should request for vehicle-category', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(vehicleCategoryQuery).then((response) => {
      expect(get(response, 'body.data.vehicleCategory')).toBeTruthy();

      const vResult = get(response, 'body.data.vehicleCategory');
      expect(vResult).toEqual(
        expect.objectContaining({
          id: vehicleCategoriesTable[0].id,
          name: vehicleCategoriesTable[0].name
        })
      );
      done();
    });
  });
});
