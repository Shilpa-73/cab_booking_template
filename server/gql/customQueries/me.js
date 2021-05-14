import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';
import db from '@database/models';
import { findOneById } from '../../database/dbUtils';

// This is response fields of the nearest vehicle queries
export const loginUserField = {
  id: {
    type: GraphQLNonNull(GraphQLInt)
  },
  firstName: {
    type: GraphQLNonNull(GraphQLString)
  },
  lastName: {
    type: GraphQLNonNull(GraphQLString)
  }
};

export const isLoggedinResponse = new GraphQLObjectType({
  name: 'isLoggedinResponse',
  fields: () => ({
    ...loginUserField
  })
});

export const isLoggedinQuery = {
  type: isLoggedinResponse,
  args: {},
  async resolve(source, args, { user }, info) {
    try {
      // make sure user is logged in
      if (!user) {
        throw new Error('You are not authenticated!');
      }

      // user is authenticated
      const userData = await findOneById(db.customers, user.userId);
      if (!userData) throw new Error('The requested account is no more exist!');
      return userData;
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'To get nearest devices available for customer'
};
