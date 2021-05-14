import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLFloat } from 'graphql';
import { getNearestAvailableCabs } from '@daos/cabs';
import { USER_TYPE } from '@utils/constants';

const vehicleResponse = new GraphQLObjectType({
  name: 'vehicleResponse',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    vehicleNumber: {
      type: GraphQLNonNull(GraphQLString)
    },
    category: {
      type: GraphQLNonNull(GraphQLString)
    },
    subCategory: {
      type: GraphQLString
    },
    distanceDiff: {
      type: GraphQLNonNull(GraphQLFloat),
      description: `This difference is in miles`
    }
  })
});

// This is response fields of the nearest vehicle queries
export const nearestVehicleFields = {
  data: {
    type: GraphQLList(vehicleResponse)
  }
};

// This is a query argument that will passed from the graphiql/front-end
export const nearestVehicleArgs = {
  lat: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'first name of the customer!'
  },
  long: {
    type: GraphQLNonNull(GraphQLFloat),
    description: 'Last name of customer!'
  }
};

export const nearestVehicleResponse = new GraphQLObjectType({
  name: 'nearestVehicleResponse',
  fields: () => ({
    ...nearestVehicleFields
  })
});

export const nearestVehicleQueries = {
  type: nearestVehicleResponse,
  args: {
    ...nearestVehicleArgs
  },
  async resolve(source, { lat, long }, { user, isAuthenticatedUser }, info) {
    try {
      await isAuthenticatedUser({ user, type: USER_TYPE.CUSTOMER });
      const allNearestVehicles = await getNearestAvailableCabs({ lat, long });

      return {
        data: allNearestVehicles
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'To get nearest devices available for customer'
};
