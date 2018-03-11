import {
    SEARCH_ACCOUNTS_ERRORED, SEARCH_ACCOUNTS_LOADING, SEARCH_ACCOUNTS_SUCCESS, ACCOUNT_SELECTED, INPUT_CHANGE
} from '../constants/actions';

export function accountsReducer(state = {
    data: [],
    hasErrored: false,
    isLoading: false,
    selected: [],
    accountInput: ''
}, action) {
    switch (action.type) {
        case SEARCH_ACCOUNTS_SUCCESS:
            return {
                ...state,
                data: action.data,
                hasErrored: false,
                isLoading: false
            };

        case SEARCH_ACCOUNTS_LOADING:
            return {
                ...state,
                isLoading: true,
                data: []
            };

        case SEARCH_ACCOUNTS_ERRORED:
            return {
                ...state,
                hasErrored: true
            };

        case ACCOUNT_SELECTED:
            return {
                ...state,
                selected: action.selected
            };

        case INPUT_CHANGE:
            return {
                ...state,
                [action.id]: action.value
            };

        default:
            return state;
    }
}
