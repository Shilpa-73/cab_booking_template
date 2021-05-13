import express from 'express';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { connect } from '@database';
import rTracer from 'cls-rtracer';

import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { logger } from '@utils/logger';
import { isAuthenticatedUser, useDummyToken, verifyJwt } from './server/middleware/auth';
const app = express();
const port = 3000;

dotenv.config();

// connect to database
connect();

const unUSedVar = {


};

// create the graphQL schema
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

app.use(rTracer.expressMiddleware());

app.use(
  '/graphql',
  useDummyToken,
  verifyJwt(),
  graphqlHTTP((req) => ({
    schema: schema,
    graphiql: true,
    context: {
      user: req.user || null,
      isAuthenticatedUser
    },
    customFormatErrorFn: (e) => {
      logger().info({ e });
      return e;
    }
  }))
);

app.get('/protected', useDummyToken, verifyJwt(), function (req, res) {
  if (!req.user) return res.sendStatus(401);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.status(200).send('Hello Welcome to the Cab-Booking API!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
