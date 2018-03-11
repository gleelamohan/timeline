import { createApolloFetch } from 'apollo-fetch';
import {
    SEARCH_ACCOUNTS_REQUEST, SEARCH_ACCOUNTS_ERRORED, SEARCH_ACCOUNTS_LOADING,
    SEARCH_ACCOUNTS_SUCCESS, ACCOUNT_SELECTED, INPUT_CHANGE
 } from '../constants/actions';

/* global URI_GRAPHQL */
const apolloFetch = createApolloFetch({ uri: URI_GRAPHQL });
// URI_GRAPHQL is defined from Webpack globals

// Search Accounts
function searchAccountsLoadingAction() {
    return {
        type: SEARCH_ACCOUNTS_LOADING
    };
}

function searchAccountsErroredAction() {
    return {
        type: SEARCH_ACCOUNTS_ERRORED
    };
}

function searchAccountsSuccessAction(data) {
    return {
        type: SEARCH_ACCOUNTS_SUCCESS,
        data
    };
}

// searchKey will be the prefix with which the account name search will be performed
export function searchAccountsAction(searchKey) {
    if (!searchKey) {
        return null;
    }

    const thunk = (dispatch) => {
        dispatch(searchAccountsLoadingAction());

        const query = `
        {
            Accounts(key: "${searchKey}") {
                id
                name
            }
        }`;

        apolloFetch({ query })
            .then((response) => {
                if (!response.data) {
                    throw Error('Invalid data format');
                }

                return response.data.Accounts;
            })
            .then((accounts) => dispatch(searchAccountsSuccessAction(accounts)))
            .catch(() => dispatch(searchAccountsErroredAction()));
    };

    thunk.meta = {
        debounce: {
            time: 300,
            key: SEARCH_ACCOUNTS_REQUEST
        }
    };

    return thunk;
}

export function accountSelectedAction(selected) {
    return {
        type: ACCOUNT_SELECTED,
        selected
    };
}

export function changeInputAction(id, value) {
    return (dispatch) => {
        if (id === 'accountInput' && value) {
            dispatch(searchAccountsAction(value));
        }

        return dispatch({
            type: INPUT_CHANGE,
            id,
            value
        });
    };
}
