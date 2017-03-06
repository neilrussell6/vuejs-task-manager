import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
// import { reducer as api } from 'redux-json-api';
import { createStore, combineReducers, applyMiddleware } from 'redux';

// reducers
import { projects } from 'state/projects/reducers/projects.reducer';
import { selected_project } from 'state/projects/reducers/selected-project.reducer';
import { tasks } from 'state/tasks/reducers/tasks.reducer';
import { message } from 'state/message/reducers/message.reducer';
import { tasks_status_filter } from 'state/tasks/reducers/tasks-status-filter.reducer';
import { tasks_text_filter } from 'state/tasks/reducers/tasks-text-filter.reducer';
import { delayFetchMiddleware } from './delay-fetch/delay-fetch.middleware';

const reducer = combineReducers({
    // api,
    projects,
    message,
    selected_project,
    tasks,
    tasks_status_filter,
    tasks_text_filter
});

const loggerMiddleware = createLogger();
let _middleware = [
    delayFetchMiddleware, // delays API calls for dev (use before thunk)
    thunkMiddleware, // lets us dispatch () functions
    loggerMiddleware // neat middleware that logs actions (use after thunk)
];

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
