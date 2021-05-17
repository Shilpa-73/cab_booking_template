import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

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
      console.log(`loggedin response  is here!`, response);
      done();
    });
  });
});
