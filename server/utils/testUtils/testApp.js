import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';

import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { client } from '@database';
import { useDummyToken } from '@server/middleware/auth';
import { isAuthenticatedUser } from '../../middleware/auth';
import { customersTable } from './mockData';

const connect = async () => {
  await client.authenticate();
};

dotenv.config();
connect();

// configure environment variables
dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

// create the graphQL schema
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

const testApp = express();
testApp.use(
  '/graphql',
  useDummyToken,
  (req, res, next) => {
    // return first customer always for a testing purpose
    req.user = customersTable[0];
    req.user.userId = req.user.id;
    return next();
  },
  graphqlHTTP((req) => ({
    schema: schema,
    graphiql: false,
    context: {
      user: req.user || null,
      isAuthenticatedUser
    },
    customFormatErrorFn: (e) => {
      console.log(e);
      if (process.env.ENVIRONMENT !== 'local') {
        return e.message;
      }
      console.log({ e });
      return e;
    }
  })),
  (request, response, next) => {
    next();
  }
);

testApp.use('/', (_, response) => {
  response.status(200).json({ message: 'OK' }).send();
});

export { testApp };
