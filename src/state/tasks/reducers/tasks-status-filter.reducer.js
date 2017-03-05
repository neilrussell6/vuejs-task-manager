// local
import {
    ACTION_SET_COMPLETE_FILTER,
    DEFAULT_COMPLETE_FILTER_STATE
} from '../task.settings';

export function tasks_status_filter (state = DEFAULT_COMPLETE_FILTER_STATE, action) {

    switch (action.type) {

        case ACTION_SET_COMPLETE_FILTER:
            return action.value;

        default:
            return state;
    }
}
