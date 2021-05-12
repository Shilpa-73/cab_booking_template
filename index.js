import express from 'express';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { connect } from '@database';
import rTracer from 'cls-rtracer';
import jwt from 'express-jwt';
import bodyParser from 'body-parser'

import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { logger } from '@utils/logger';
const app = express();
const port = 3000;

dotenv.config();

// connect to database
connect();

// create the graphQL schema
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

app.use(rTracer.expressMiddleware());

app.use(
  '/graphql',
    bodyParser.json(),
    jwt({
        secret: process.env.TOKEN_SECRET,
        credentialsRequired: false,
        algorithms: ['RS256']
    }),
  graphqlHTTP((req)=>({
      schema: schema,
      graphiql: true,
      customFormatErrorFn: (e) => {
          logger().info({ e });
          return e;
      }
  }))
);

app.get('/', (req, res) => {
  res.status(200).send('Hello Welcome to the Cab-Booking API!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
