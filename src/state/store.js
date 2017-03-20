import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { reducer as api } from 'redux-json-api';
import { createStore, combineReducers, applyMiddleware } from 'redux';

// reducers
import { app } from 'state/app/reducers/app.reducer';
import { projects } from 'state/projects/reducers/projects.reducer';
import { selected_project } from 'state/projects/reducers/selected-project.reducer';
import { tasks } from 'state/tasks/reducers/tasks.reducer';
import { message } from 'state/message/reducers/message.reducer';
import { tasks_status_filter } from 'state/tasks/reducers/tasks-status-filter.reducer';
import { tasks_text_filter } from 'state/tasks/reducers/tasks-text-filter.reducer';
import { user } from 'state/user/reducers/user.reducer';

// middleware
import { delayFetchMiddleware } from './delay-fetch/delay-fetch.middleware';

const reducer = combineReducers({
    api,
    app,
    projects,
    message,
    selected_project,
    tasks,
    tasks_status_filter,
    tasks_text_filter,
    user
});

const USE_LOGGER_MIDDLEWARE = false;

let _middleware = [
    // delayFetchMiddleware, // delays API calls for dev (use before thunk)
    thunkMiddleware // lets us dispatch () functions
];

// process will be globally available because it's defined in webpack config
if (process.env.NODE_ENV !== 'production' && USE_LOGGER_MIDDLEWARE) {

    // redux-logger: logs actions (use after thunk)
    const _logger_middleware = createLogger();
    _middleware = [ ..._middleware, _logger_middleware ];
}

export const store = createStore(
    reducer,
    applyMiddleware(..._middleware)
);
