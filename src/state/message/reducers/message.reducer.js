// data
import { Message, MESSAGE_STYLE } from 'data/models/basic/message.model';

// state
import * as task_constants from 'state/tasks/task.constants';

// utils
import { ENDPOINT_TYPES } from 'utils/json-api/json-api.constants';

// local
import * as message_constants from '../message.constants';
const DEFAULT_MESSAGE_STATE = null;

export function message (state = DEFAULT_MESSAGE_STATE, action) {

    let _data = null;
    let _label = '';

    // make message label

    switch (action.type) {

        case message_constants.ACTION_REQUEST_DELETE_CONFIRMATION:

            switch (action.data.type) {
                case 'tasks': _label = "this task";
            }
            break;
    }

    // make message data

    switch (action.type) {

        case message_constants.ACTION_REQUEST_DELETE_CONFIRMATION:
            _data = {
                action: action,
                label: `are you sure you want to delete ${_label}?`,
                style: MESSAGE_STYLE.WARNING,
                icon: {
                    class: 'fa fa-exclamation-triangle fa-2x'
                },
                buttons: [
                    {label: 'YES', value: true},
                    {label: 'NO', value: false}
                ]
            };
            break;

        case message_constants.ACTION_SET_MESSAGE:
            _data = action.data;
            break;

        case task_constants.ACTION_DESTROYED_TASK:
        case message_constants.ACTION_CANCEL_DELETE:
            return null;
    }

    if (_data === null) {
        return state;
    }

    return new Message(_data);
}

