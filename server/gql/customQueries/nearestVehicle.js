import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLFloat
} from 'graphql';
import db from '@database/models';
import { getNearestAvailableCabs } from '@daos/cabs';

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
      type: GraphQLNonNull(GraphQLFloat)
    }
  })
});

// This is response fields of the nearest vehicle queries
export const nearestVehicleFields = {
  flag: {
    type: GraphQLNonNull(GraphQLBoolean),
    description: 'This field state that the customer signup is done perfectly or not!'
  },
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
  async resolve(source, { lat, long }, context, info) {
    try {
      const allNearestVehicles = await getNearestAvailableCabs({ lat, long });

      return {
        flag: true,
        data: allNearestVehicles
      };
    } catch (e) {
      throw Error(`Internal Error: ${e}`);
    }
  },
  description: 'To get nearest devices available for customer'
};
