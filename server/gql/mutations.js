import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import upperFirst from 'lodash/upperFirst';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';
import { customerMutations } from '@gql/models/customers';
import { loginMutation } from '@gql/customMutations/authLogin';
import camelCase from 'lodash/camelCase';
import { signupMutations } from './customMutations/signup';
import { cabBookingMutation } from './customMutations/bookCab';

const CUSTOMS = {
  login: loginMutation,
  signup: signupMutations,
  bookCab: cabBookingMutation
};

export const createResolvers = (model) => ({
  createResolver: (parent, args, context, resolveInfo) => model.create(args),
  updateResolver: (parent, args, context, resolveInfo) => updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) => deleteUsingId(model, args)
});
export const DB_TABLES = {
  customer: customerMutations
};

export const addMutations = () => {
  const mutations = {};

  Object.keys(DB_TABLES).forEach((table) => {
    const { id, ...createArgs } = DB_TABLES[table].args;
    mutations[`create${upperFirst(table)}`] = {
      ...DB_TABLES[table],
      args: createArgs,
      resolve: createResolvers(DB_TABLES[table].model).createResolver
    };
    mutations[`update${upperFirst(table)}`] = {
      ...DB_TABLES[table],
      resolve: createResolvers(DB_TABLES[table].model).updateResolver
    };
    mutations[`delete${upperFirst(table)}`] = {
      type: deletedId,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: createResolvers(DB_TABLES[table].model).deleteResolver
    };
  });

  // adding mutations from CUSTOMS (those which have custom resolvers)
  Object.keys(CUSTOMS).forEach((que) => {
    mutations[camelCase(que)] = {
      ...CUSTOMS[que]
    };
  });
  return mutations;
};

export const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...addMutations()
  })
});
