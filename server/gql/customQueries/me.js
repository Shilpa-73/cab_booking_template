import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import db from '@database/models';
import { findOneById } from '../../database/dbUtils';

const userFields = new GraphQLObjectType({
  name: 'userFields',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    firstName: {
      type: GraphQLNonNull(GraphQLString)
    },
    lastName: {
      type: GraphQLNonNull(GraphQLString)
    }
  })
});

// This is response fields of the nearest vehicle queries
export const loginUserDetail = {
  flag: {
    type: GraphQLNonNull(GraphQLBoolean),
    description: 'This field state that the customer signup is done perfectly or not!'
  },
  data: {
    type: userFields
  }
};

export const isLoggedinResponse = new GraphQLObjectType({
  name: 'isLoggedinResponse',
  fields: () => ({
    ...loginUserDetail
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
      const userData = await findOneById(db.customers, { id: user.userId });
      if (!userData) throw new Error('The requested account is no more exist!');
      return {
        flag: true,
        data: userData
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'To get nearest devices available for customer'
};
