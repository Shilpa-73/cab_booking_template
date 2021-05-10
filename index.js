import express from 'express';
import dotenv from 'dotenv';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
const app = express()
const port = 3000

// create the graphQL schema
const schema = new GraphQLSchema({ query: {}, mutation: {} });

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        customFormatErrorFn: e => {
            logger().info({ e });
            return e;
        }
    })
);

app.get('/', (req, res) => {
    res.status(200).send('Hello Welcome to the Cab-Booking API!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
