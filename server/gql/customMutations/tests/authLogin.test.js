import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Do Login for customer!', () => {
  const credentials = {
    email: 'chirag@gmail.com',
    password: '123456'
  };

  const loginMutation = `
      mutation {
          login(email: "${credentials.email}", password: "${credentials.password}") {
            userId
            token
          }
      }
  `;

  it('should request for login customer!', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(loginMutation).then((response) => {
      expect(get(response, 'body.data.login')).toBeTruthy();
      const result = get(response, 'body.data.login');

      expect(result).toEqual(
        expect.objectContaining({
          userId: 1
        })
      );
      // Todo to handle errors like "password mismatch!" OR "Email does not exist!"
      done();
    });
  });
});
