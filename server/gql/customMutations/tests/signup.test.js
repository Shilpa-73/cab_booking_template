import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Do Signup for customer!', () => {
  const credentials = {
    email: 'chiragtest@gmail.com',
    password: '123456',
    firstName: 'chiragtest',
    lastName: 'test lastname',
    mobileNo: '9978970960'
  };

  const signupMutation = `
      mutation {
          signup(  
                email: "${credentials.email}", 
                password: "${credentials.password}", 
                firstName: "${credentials.firstName}",
                lastName: "${credentials.lastName}",
                mobileNo: "${credentials.mobileNo}"
          ) {
            userId
            message
          }
      }
  `;

  it('should request for signup customer!', async (done) => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(signupMutation).then((response) => {
      expect(get(response, 'body.data.signup')).toBeTruthy();

      // Todo to handle error in case of mobile already registered!
      done();
    });
  });
});
