const { buildSchema } = require('graphql');
const { searchAccounts, fetchAccountDetails } = require('./db');

const schema = buildSchema(`
    type Account {
        id: ID!
        name: String!
    }

    type Scores {
        ts: String!,
        ews: Float,
        lu: Float,
        tlp: Float
    }

    type PointEvents {
        ts: String!
        type: String
        amt: Float
        productCloudName: String
    }

    type IntervalEvents {
        dateOpen: String!
        dateClosed: String
        type: String
        keyRiskCategory: String
        subject: String
    }

    type AccountDetails {
        scores: [Scores]
        pointEvents: [PointEvents]
        intervalEvents: [IntervalEvents]
    }

    type Query {
        Accounts(key: String!): [Account]
        AccountDetails(id: ID!): AccountDetails
    }
`);

const rootValue = {
    Accounts: searchAccounts,
    AccountDetails: fetchAccountDetails
};

module.exports = {
    schema,
    rootValue
};
