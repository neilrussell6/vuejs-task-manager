import createLogger from 'redux-logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

const reducer = combineReducers({});

let _middleware = [];

// process will be globally available because it's defined in webpack config
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {

    // redux-logger: logs actions (use after thunk)
    const loggerMiddleware = createLogger();
    _middleware = [ ..._middleware, loggerMiddleware ];
}

export const store = createStore(
    reducer,
    applyMiddleware(..._middleware)
);
