// local
import * as task_settings from '../task.settings';

export function tasks_text_filter (state = task_settings.DEFAULT_TEXT_FILTER_STATE, action) {

    switch (action.type) {

        case task_settings.ACTION_SET_TEXT_FILTER:
            return action.value;

        default:
            return state;
    }
}
