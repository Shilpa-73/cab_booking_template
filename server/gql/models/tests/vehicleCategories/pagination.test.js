import get from 'lodash/get';
import { vehicleCategoriesTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Vehicle Categories graphQL-server-DB pagination tests', () => {
  const vehicleCategoryQuery = `
      query {
        vehicleCategories(first:1){
            edges{
              node{
                id
                name
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

  it('should have a query to get the vehicle categories', async (done) => {
    await getResponse(vehicleCategoryQuery).then((response) => {
      console.log(`response.body is `, response.body);
      const result = get(response, 'body.data.vehicleCategories.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: vehicleCategoriesTable[0].id,
          name: vehicleCategoriesTable[0].name
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async (done) => {
    await getResponse(vehicleCategoryQuery).then((response) => {
      const result = get(response, 'body.data.vehicleCategories.pageInfo');
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
