import {
    FETCH_ACCOUNT_DETAILS_LOADING, FETCH_ACCOUNT_DETAILS_ERRORED, FETCH_ACCOUNT_DETAILS_SUCCESS
} from '../constants/actions';

export function accountDetailsReducer(state = {
    data: {},
    hasErrored: false,
    isLoading: false
}, action) {
    switch (action.type) {
        case FETCH_ACCOUNT_DETAILS_SUCCESS:
            return {
                ...state,
                data: action.data,
                hasErrored: false,
                isLoading: false
            };

        case FETCH_ACCOUNT_DETAILS_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case FETCH_ACCOUNT_DETAILS_ERRORED:
            return {
                ...state,
                hasErrored: true
            };

        default:
            return state;
    }
}
