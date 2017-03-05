// local
import {
    ACTION_SET_TEXT_FILTER,
    DEFAULT_TEXT_FILTER_STATE
} from '../task.settings';

export function tasks_text_filter (state = DEFAULT_TEXT_FILTER_STATE, action) {

    switch (action.type) {

        case ACTION_SET_TEXT_FILTER:
            return action.value;

        default:
            return state;
    }
}
