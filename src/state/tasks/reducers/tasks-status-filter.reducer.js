// local
import * as task_settings from '../task.settings';

export function tasks_status_filter (state = task_settings.DEFAULT_COMPLETE_FILTER_STATE, action) {

    switch (action.type) {

        case task_settings.ACTION_SET_COMPLETE_FILTER:
            return action.value;

        default:
            return state;
    }
}
