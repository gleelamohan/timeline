import { combineReducers } from 'redux';
import { accountsReducer } from './accountsReducer';
import { accountDetailsReducer } from './accountDetailsReducer';
import { timelineChartReducer } from './timelineChartReducer';

export default combineReducers({
    accounts: accountsReducer,
    accountDetails: accountDetailsReducer,
    timelineChart: timelineChartReducer
});
