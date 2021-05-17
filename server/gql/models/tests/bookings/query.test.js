import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { vehicleCategoriesTable, vehicleSubCategoriesTable } from '@utils/testUtils/mockData';

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
  it('should request for vehicle categories and vehicle sub categories', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.vehicleCategories, 'findAll').mockImplementation(() => [vehicleCategoriesTable[0]]);

    jest
      .spyOn(dbClient.models.vehicleSubCategories, 'findAll')
      .mockImplementation(() => [vehicleSubCategoriesTable[0]]);

    await getResponse(vehicleQuery).then((response) => {
      expect(get(response, 'body.data.vehicle')).toBeTruthy();
      console.log(`response  is here!`, response);
      done();
    });
  });
});
