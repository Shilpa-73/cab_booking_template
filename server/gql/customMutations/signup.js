import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import db from '@database/models';
import { generatePassword } from '@database/bcrypt';
import { findOneByCriteria, insertRecord } from '../../database/dbUtils';
import { USER_TYPE } from '../../utils/constants';

// This is response fields of the signup response
export const signupUserFields = {
  flag: {
    type: GraphQLNonNull(GraphQLBoolean),
    description: 'This field state that the customer signup is done perfectly or not!'
  },
  userId: {
    type: GraphQLNonNull(GraphQLInt),
    description: 'The user_id that is created after signup!'
  },
  message: {
    type: GraphQLNonNull(GraphQLString),
    description: 'The message that shows registration message regarding customer!'
  }
};

// This is a query argument that will passed from the graphiql/front-end
export const signupUserArgs = {
  firstName: {
    type: GraphQLNonNull(GraphQLString),
    description: 'first name of the customer!'
  },
  lastName: {
    type: GraphQLNonNull(GraphQLString),
    description: 'Last name of customer!'
  },
  mobileNo: {
    type: GraphQLNonNull(GraphQLString),
    description: 'mobile no of customer!'
  },
  email: {
    type: GraphQLNonNull(GraphQLString),
    description: 'Email id of user account!'
  },
  address: {
    type: GraphQLString,
    description: 'Address of customer!'
  },
  city: {
    type: GraphQLString,
    description: 'City of customer!'
  },
  state: {
    type: GraphQLString,
    description: 'State of the customer!'
  },
  country: {
    type: GraphQLString,
    description: 'Country of the customer!'
  },
  password: {
    type: GraphQLNonNull(GraphQLString),
    description: 'Password of the user that want to do login!'
  }
};

export const signupResponse = new GraphQLObjectType({
  name: 'signupResponse',
  fields: () => ({
    ...signupUserFields
  })
});

export const signupMutations = {
  type: signupResponse,
  args: {
    ...signupUserArgs
  },
  async resolve(source, { firstName, lastName, email, password, mobileNo, ...rest }, context, info) {
    try {
      // Check if customer is already registered with this mobile no!
      const existCustomer = await findOneByCriteria(db.customers, { mobileNo });
      if (existCustomer)
        throw new Error(`This ${mobileNo} is already registered, 
                Please try with another mobile number!`);

      // Create bcrypt password
      const generatedPassword = await generatePassword(password);

      // Create customer entry to customer table!
      const customer = await insertRecord(db.customers, {
        firstName,
        lastName,
        email,
        mobileNo,
        ...rest
      });

      // Create password
      await insertRecord(db.passport, {
        userType: USER_TYPE.CUSTOMER,
        providerType: 'LOCAL',
        password: generatedPassword,
        userId: customer.id
      });

      return {
        flag: true,
        userId: customer.id,
        message: `Your account is created. Please login to continue!`
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'Signup api for customer'
};
