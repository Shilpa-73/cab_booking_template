import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { vehicleSubCategoriesTable } from '@utils/testUtils/mockData';

describe('VehicleSubCategory graphQL-server-DB query tests', () => {
  const id = 1;
  const vehicleSubCategoryQuery = `
  query {
    vehicleSubCategory (id: ${id}) {
        id
        name
    }
  }
  `;
  it('should request for vehicle-sub-category', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(vehicleSubCategoryQuery).then((response) => {
      expect(get(response, 'body.data.vehicleSubCategory')).toBeTruthy();

      const vResult = get(response, 'body.data.vehicleSubCategory');
      expect(vResult).toEqual(
        expect.objectContaining({
          id: vehicleSubCategoriesTable[0].id,
          name: vehicleSubCategoriesTable[0].name
        })
      );
      done();
    });
  });
});
