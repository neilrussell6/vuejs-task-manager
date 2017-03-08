// local
import * as task_constants from '../task.constants';

export function tasks_status_filter (state = task_constants.DEFAULT_COMPLETE_FILTER_STATE, action) {

    switch (action.type) {

        case task_constants.ACTION_SET_COMPLETE_FILTER:
            return action.value;

        default:
            return state;
    }
}
