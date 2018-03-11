import {
    SET_MOUSE_LOCATION, SET_TRENDLINE_METRICS
} from '../constants/actions';


export function handleMouseMoveAction(data) {

    return {
        type: SET_MOUSE_LOCATION,
        data
    };

}

export function setVisibleTrendLinesAction(data) {

    return {
        type: SET_TRENDLINE_METRICS,
        data
    };
}
