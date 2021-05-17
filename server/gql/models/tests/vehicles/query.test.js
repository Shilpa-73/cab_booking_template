import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { vehicleCategoriesTable, vehicleSubCategoriesTable, vehiclesTable } from '@utils/testUtils/mockData';

describe('Vehicle graphQL-server-DB query tests', () => {
  const id = 1;
  const vehicleQuery = `
  query {
    vehicle (id: ${id}) {
        id
        vehicleNumber
        vehicleCategory{
          edges{
            node{
              id
              name
            }
          }
        }
    }
  }
  `;
  it('should request for vehicle with its category', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.vehicleCategories, 'findAll').mockImplementation(() => [vehicleCategoriesTable[0]]);

    jest
      .spyOn(dbClient.models.vehicleSubCategories, 'findAll')
      .mockImplementation(() => [vehicleSubCategoriesTable[0]]);

    await getResponse(vehicleQuery).then((response) => {
      expect(get(response, 'body.data.vehicle')).toBeTruthy();

      const vResult = get(response, 'body.data.vehicle');
      expect(vResult).toEqual(
        expect.objectContaining({
          id: vehiclesTable[0].id,
          vehicleNumber: vehiclesTable[0].vehicleNumber
        })
      );

      const result = get(response, 'body.data.vehicle.vehicleCategory.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: vehicleCategoriesTable[0].id,
          name: vehicleCategoriesTable[0].name
        })
      );
      done();
    });
  });
});
