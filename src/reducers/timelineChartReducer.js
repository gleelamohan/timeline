import {
    SET_MOUSE_LOCATION, SET_TRENDLINE_METRICS
} from '../constants/actions';
import { ewsMetrics } from '../constants/ewsMetrics';

export function timelineChartReducer(state = {
    metricsDetails: ewsMetrics
}, action) {
    switch (action.type) {
        case SET_MOUSE_LOCATION:
            return {
                ...state,
                mouseLocation: action.data
            };
        case SET_TRENDLINE_METRICS:
            return {
                ...state,
                trendLines: action.data
            };
        default:
            return state;
    }
}
