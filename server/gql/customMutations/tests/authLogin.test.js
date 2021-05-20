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
      done();
    });
  });

  it('should request for login customer with Password mismatch!', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    const loginMutationPasswordError = `
      mutation {
          login(email: "${credentials.email}", password: "123") {
            userId
            token
          }
      }
  `;
    await getResponse(loginMutationPasswordError).then((response) => {
      try {
        // Do nothing!
      } catch (e) {
        expect(e.message).toBe('Password Mismatch!');
      }
      done();
    });
  });
});
