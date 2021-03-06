// local
import * as task_constants from '../task.constants';

export function tasks_text_filter (state = task_constants.DEFAULT_TEXT_FILTER_STATE, action) {

    switch (action.type) {

        case task_constants.ACTION_SET_TEXT_FILTER:
            return action.value;

        case task_constants.ACTION_RESET_TEXT_FILTER:
            return task_constants.DEFAULT_TEXT_FILTER_STATE;

        default:
            return state;
    }
}
