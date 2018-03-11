const { Pool } = require('pg');
const assert = require('assert');

const { DATALOAD_URL } = process.env;

assert(DATALOAD_URL, 'Missing postgres connection string');

const pool = new Pool({
    connectionString: DATALOAD_URL,
    ssl: true
});

const parseAccounts = (res) => {
    if (res.rowCount === 0) {
        return [];
    }

    return res.rows.map((row) => {
        return {
            id: row.account_id,
            name: row.account_name
        };
    });
};

const parseScores = (res) => {
    if (res.rowCount === 0) {
        return [];
    }

    return res.rows.map((row) => {
        return {
            ts: row.snapshot_dt,
            ews: row.ews,
            lu: row.lu,
            tlp: row.tlp
        };
    });
};

const parseIntervals = (res) => {
    if (res.rowCount === 0) {
        return [];
    }

    return res.rows.map((row) => {
        return {
            dateOpen: row.date_opn,
            dateClosed: row.date_clsd,
            type: row.type,
            keyRiskCategory: row.key_risk_category,
            subject: row.subj
        };
    });
};

const parsePointEvents = (res) => {
    if (res.rowCount === 0) {
        return [];
    }

    return res.rows.map((row) => {
        return {
            ts: row.dt,
            type: row.type,
            amt: row.amt,
            productCloudName: row.product_cloud_nm
        };
    });
};

const constructQuery = (client, sql, ...args) => {
    return client.query(sql, args);
};

const pgEscapeQuery = (key) => {
    let escaped = key;

    const POSTGRES_SPECIAL_CHAR_LIST = ['\\\\', '_', '%'];
    // Order is important '\' should be the very first one.

    POSTGRES_SPECIAL_CHAR_LIST.forEach((char) => {
        // Eg: Replace Hello% => Hello\%
        escaped = escaped.replace(new RegExp(`${char}`, 'g'), `\\${char}`);
    });

    return escaped;
};

const searchAccounts = ({ key }) => {
    const selectAccounts = `
        SELECT account_id, account_name
        FROM account
        WHERE account_name ilike $1
        ORDER BY account_name
        LIMIT 10
    `;
    // Prevent SQL injection using parametrized queries

    return pool.connect()
        .then((client) => {
            // Prevent wildcards % and _ in the search query
            const cleanedKey = pgEscapeQuery(key);

            return constructQuery(client, selectAccounts, `${cleanedKey}%`)
                .then((res) => {
                    client.release();

                    return parseAccounts(res);
                })
                .catch((err) => {
                    client.release();
                    // eslint-disable-next-line no-console
                    console.error(err.stack);
                });
        });
};

const fetchAccountDetails = ({ id }) => {
    const selectScores = `
        SELECT snapshot_dt, ews, lu, tlp
        FROM score
        WHERE account_id=$1
        ORDER BY snapshot_dt
    `;

    const selectIntervals = `
        SELECT type, date_opn, date_clsd, account_id, key_risk_category, subj
        FROM event_interval
        WHERE account_id=$1
    `;

    const selectPointEvents = `
        SELECT type, dt, amt, product_cloud_nm
        FROM event_point
        WHERE account_id=$1
    `;

    return pool.connect()
        .then((client) => {

            const scoresQuery = constructQuery(client, selectScores, id)
                .then((res) => parseScores(res))
                .then((scores) => {
                    return { scores };
                });

            const intervalEventsQuery = constructQuery(client, selectIntervals, id)
                .then((res) => parseIntervals(res))
                .then((intervalEvents) => {
                    return { intervalEvents };
                });

            const pointEventsQuery = constructQuery(client, selectPointEvents, id)
                .then((res) => parsePointEvents(res))
                .then((pointEvents) => {
                    return { pointEvents };
                });

            return Promise.all([scoresQuery, intervalEventsQuery, pointEventsQuery])
                .then((results) => Object.assign({}, ...results))
                .then((allResults) => {
                    client.release();

                    return allResults;
                }).catch((err) => {
                    client.release();
                    // eslint-disable-next-line no-console
                    console.error(err.stack);
                });
        });
};


module.exports = {
    searchAccounts,
    fetchAccountDetails
};
