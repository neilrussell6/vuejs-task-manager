import pluralize from 'pluralize';
import { API_WILL_READ, API_READ } from 'state/redux-json-api.settings';

// app
import { ACTION_DELETE_TASK } from 'state/tasks/task.settings';
import { Message, MESSAGE_STYLE } from 'data/models/basic/message.model';
import * as JsonApiUtils from 'utils/json-api/json-api.utils';

// local
import * as MessageUtils from '../message.utils';
import * as MessageConfig from '../message.settings';

// file
const DEFAULT_MESSAGE_STATE = null;

export function message (state = DEFAULT_MESSAGE_STATE, action) {

    let _data = null;
    let _label = '';
    let _endpoint;

    // get endpoint

    switch (action.type) {

        case API_WILL_READ:
            _endpoint = action.payload;
            break;

        case API_READ:
            _endpoint = action.payload.endpoint;
            break;
    }

    // make message label

    switch (action.type) {

        case API_WILL_READ:
        case API_READ:

            let _endpoint_type = JsonApiUtils.getEndpointType(_endpoint);
            let _endpoint_data = JsonApiUtils.splitEndpoint(_endpoint, _endpoint_type);
            _label = MessageUtils.makeMessageLabel(_endpoint_data, _endpoint_type, MessageConfig, pluralize.singular);
            break;
    }

    // make message data

    switch (action.type) {

        case API_WILL_READ:
            _data = {
                label: `fetching ${_label}`,
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

        case API_READ:
            _data = {
                label: `successfully fetched ${_label}`,
                style: MESSAGE_STYLE.SUCCESS,
                expire: MessageConfig.default_message_expire
            };
            break;

        case MessageConfig.ACTION_REQUEST_DELETE_CONFIRMATION:
            _data = {
                action: action,
                label: `are you sure you want to delete "${action.data.name}"?`,
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

        case MessageConfig.ACTION_CANCEL_DELETE:
        case ACTION_DELETE_TASK:
            return null;
    }

    if (_data === null) {
        return state;
    }

    return new Message(_data);
}

