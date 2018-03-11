import { createApolloFetch } from 'apollo-fetch';
import { format as formatTime } from 'date-and-time';
import { format } from 'd3-format';
import { extent } from 'd3-array';

import groupIntervals from '../utils/GroupIntervals';
import {
    FETCH_ACCOUNT_DETAILS_LOADING, FETCH_ACCOUNT_DETAILS_ERRORED, FETCH_ACCOUNT_DETAILS_SUCCESS
} from '../constants/actions';

const formatCurrency = format('($,.0f');

// For now, no formatting applied
const formatNumber = format(',.0f');

const EVENTS = {
    'aov-decrease': { title: 'AOV decreased', formatter: formatCurrency },
    'aov-increase': { title: 'AOV increased', formatter: formatCurrency },
    'attrition': { title: 'Attrition' },
    'lic-decrease': { title: 'Licenses decreased', formatter: formatNumber },
    'lic-increase': { title: 'Licenses increased', formatter: formatNumber },
    'release': { title: 'Release' },
    'renewal': { title: 'Renewal' },
    'red': {},
    'accelerator': {}
};

/* global URI_GRAPHQL */
const apolloFetch = createApolloFetch({ uri: URI_GRAPHQL });
// URI_GRAPHQL is defined from Webpack globals

// Fetch Account Details
function fetchAccountDetailsLoadingAction() {
    return {
        type: FETCH_ACCOUNT_DETAILS_LOADING
    };
}

function fetchAccountDetailsErroredAction() {
    return {
        type: FETCH_ACCOUNT_DETAILS_ERRORED
    };
}

function fetchAccountDetailsSuccessAction(data) {
    return {
        type: FETCH_ACCOUNT_DETAILS_SUCCESS,
        data
    };
}

function transformScores(data) {
    return data.map((entry) => {
        entry.ts = new Date(entry.ts);

        return entry;
    });
}

function transformIntervalEvents(data, domain) {
    const [MIN, MAX] = domain;

    const events = data.map((entry) => {
        // Extract interested fields. Clip end times to start or end
        const { type, dateOpen, dateClosed, subject, keyRiskCategory } = entry;

        let tsOpen = null;
        let tsClose = null;

        if (dateOpen) {
            tsOpen = new Date(dateOpen);
        } else {
            tsOpen = MIN;
        }

        if (dateClosed) {
            tsClose = new Date(dateClosed);
        } else {
            tsClose = MAX;
        }

        return {
            tsOpen,
            tsClose,
            type: type.trim().toLowerCase(),
            subject,
            keyRiskCategory
        };
    }).filter((entry) => {
        // Filter out data outside the scale
        return MIN <= entry.tsOpen && entry.tsOpen <= MAX &&
            // Open timestamp between MIN and MAX

            MIN <= entry.tsClose && entry.tsClose <= MAX &&
            // Close timestamp between MIN and MAX

            EVENTS[entry.type];
    });

    const uniqueEventTypes = {};
    events.forEach((event) => uniqueEventTypes[event.type] = null);
    // Create a map of event types

    Object.keys(uniqueEventTypes).forEach((type) => {
        const filteredEventsByType = events.filter((item) => item.type === type);
        uniqueEventTypes[type] = groupIntervals(filteredEventsByType)
            .map((item) => {
                const time = `${formatTime(item.tsOpen, 'MMM D')} - ${formatTime(item.tsClose, 'MMM D')}`;
                const details = new Set();

                if (type === 'red') {
                    // For red accounts show the keyRiskCategory as tooltip
                    item.items.map((entry) => entry.keyRiskCategory)
                        .forEach((entry) => {
                            details.add(entry);
                        });
                } else if (type === 'accelerator') {
                    // For accelerators show the subject as tooltip
                    item.items.map((entry) => entry.subject)
                        .forEach((entry) => {
                            details.add(entry);
                        });
                }

                return {
                    ...item,
                    tooltip: [time, ...details]
                };
            });
    });
    // Fill the map with grouped intervals

    return uniqueEventTypes;
}

function transformPointEvents(data, domain) {
    const [MIN, MAX] = domain;

    return data.map((entry) => {
        // Extract interested fields
        const { ts, type, amt, productCloudName } = entry;

        let amount = null;
        if (amt) {
            amount = Number(amt);
        }

        const cloud = productCloudName || null;

        return {
            ts: new Date(ts),
            type: type.trim()
                .replace(/[_ ]/g, '-')
                .toLowerCase(),
            amount,
            cloud
        };
    }).filter((entry) => {
        // Filter out data outside the scale
        return MIN <= entry.ts &&
            entry.ts <= MAX &&
            EVENTS[entry.type];
    }).map((entry) => {
        // Add tooltip
        const { type, amount, ts, cloud } = entry;

        const { formatter = formatNumber, title } = EVENTS[type];

        let tooltip = title;

        if (cloud) {
            tooltip = `${cloud} ${tooltip}`;
        }

        if (amount) {
            tooltip = `${tooltip} by ${formatter(amount)}`;
        }

        return {
            ...entry,
            tooltip: [`${formatTime(ts, 'MMM D')}`, tooltip]
        };

    });
}

function transform(accountDetails) {
    accountDetails.scores = transformScores(accountDetails.scores);

    const domain = extent(accountDetails.scores, (entry) => entry.ts);
    // [MIN_DATE, MAX_DATE] using d3 extent function

    accountDetails.pointEvents = transformPointEvents(accountDetails.pointEvents, domain);
    accountDetails.intervalEvents = transformIntervalEvents(accountDetails.intervalEvents, domain);

    return accountDetails;
}

export function fetchAccountDetailsAction(id) {
    const query = `
        {
            AccountDetails(id: "${id}") {
                scores {
                    ts
                    ews
                    lu
                    tlp
                }
                pointEvents {
                    ts
                    type
                    amt
                    productCloudName
                }
                intervalEvents {
                    dateOpen
                    dateClosed
                    type
                    keyRiskCategory
                    subject
                }
            }
        }`;

    return (dispatch) => {
        dispatch(fetchAccountDetailsLoadingAction());

        apolloFetch({ query })
            .then((response) => {
                if (!response.data) {
                    throw Error('Invalid data format');
                }

                return response.data.AccountDetails;
            })
            .then((details) => transform(details))
            .then((details) => dispatch(fetchAccountDetailsSuccessAction(details)))
            .catch(() => dispatch(fetchAccountDetailsErroredAction()));
    };
}

