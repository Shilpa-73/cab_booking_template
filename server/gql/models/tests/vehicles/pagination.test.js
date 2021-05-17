import get from 'lodash/get';
import { vehiclesTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Vehicles graphQL-server-DB pagination tests', () => {
  const vehiclesQuery = `
  query {
    vehicles (first: 1){
      edges {
        node {
          id
          modelNo
          vehicleNumber
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

  it('should have a query to get the vehicles', async (done) => {
    await getResponse(vehiclesQuery).then((response) => {
      console.log(`response.body is `, response.body);
      const result = get(response, 'body.data.vehicles.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: vehiclesTable[0].id,
          modelNo: vehiclesTable[0].modelNo,
          vehicleNumber: vehiclesTable[0].vehicleNumber
        })
      );
      done();
    });
  });

  it('should have the correct pageInfo', async (done) => {
    await getResponse(vehiclesQuery).then((response) => {
      const result = get(response, 'body.data.vehicles.pageInfo');
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
