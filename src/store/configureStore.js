import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import createDebounce from 'redux-debounced';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(

                createDebounce(),
                // debounced middleware should be applied before the thunk middleware

                thunkMiddleware,
                loggerMiddleware
            )
        )
    );
}
