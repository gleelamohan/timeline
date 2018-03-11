const express = require('express');

// morgan - logger for express
const morgan = require('morgan');
const json = require('morgan-json');

const graphqlHTTP = require('express-graphql');
const path = require('path');

const { schema, rootValue } = require('./schema');

const DEFAULT_PORT = 3000;

const app = express();

const format = json({
    short: ':method :url :status',
    length: ':res[content-length]',
    'response-time': ':response-time ms'
});
app.use(morgan(format));

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist/')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || DEFAULT_PORT;
app.listen(port);

// eslint-disable-next-line no-console
console.log(`EWS app listening on ${port}`);
