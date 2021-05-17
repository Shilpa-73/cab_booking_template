import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { customersTable } from '@utils/testUtils/mockData';

describe('Check IsLoggedin query tests', () => {
  const checkIsLoggedinQuery = `
      query {
          me {
              id
              firstName
              lastName
          }
      }
  `;

  it('should request for loggedin user data', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(checkIsLoggedinQuery).then((response) => {
      expect(get(response, 'body.data.me')).toBeTruthy();

      const result = get(response, 'body.data.me');
      expect(result).toEqual(
        expect.objectContaining({
          id: Number(customersTable[0].id),
          firstName: customersTable[0].firstName,
          lastName: customersTable[0].lastName
        })
      );
      done();
    });
  });
});
