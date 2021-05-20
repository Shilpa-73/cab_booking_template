import get from 'lodash/get';
import { vehicleSubCategoriesTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Vehicle Sub Categories graphQL-server-DB pagination tests', () => {
  const vehicleSubCategoryQuery = `
      query {
        vehicleSubCategories(first:1){
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

  it('should have a query to get the vehicle sub categories', async (done) => {
    await getResponse(vehicleSubCategoryQuery).then((response) => {
      console.log(`response.body is `, response.body);
      const result = get(response, 'body.data.vehicleSubCategories.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: vehicleSubCategoriesTable[0].id,
          name: vehicleSubCategoriesTable[0].name
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async (done) => {
    await getResponse(vehicleSubCategoryQuery).then((response) => {
      const result = get(response, 'body.data.vehicleSubCategories.pageInfo');
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
