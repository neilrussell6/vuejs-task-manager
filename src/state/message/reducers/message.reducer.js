import pluralize from 'pluralize';

// data
import { Message, MESSAGE_STYLE } from 'data/models/basic/message.model';

// state
import * as api_settings from 'state/redux-json-api.settings';

// utils
import * as JsonApiUtils from 'utils/json-api/json-api.utils';
import { ENDPOINT_TYPES } from 'utils/json-api/json-api.settings';

// local
import * as MessageUtils from '../message.utils';
import * as message_settings from '../message.settings';

// file
const DEFAULT_MESSAGE_STATE = null;

export function message (state = DEFAULT_MESSAGE_STATE, action) {

    let _data = null;
    let _label = '';
    let _endpoint;

    // get endpoint

    switch (action.type) {

        case api_settings.API_WILL_READ:
            _endpoint = action.payload;
            break;

        case api_settings.API_READ:
            _endpoint = action.payload.endpoint;
            break;
    }

    // make message label

    let _endpoint_type;
    let _endpoint_data;

    switch (action.type) {

        case api_settings.API_CREATED:
        case api_settings.API_DELETED:
        case api_settings.API_WILL_CREATE:
        case api_settings.API_WILL_DELETE:
        case api_settings.API_WILL_UPDATE:

            _endpoint_data = {
                primary: action.payload.type,
                primary_id: action.payload.id
            };
            _label = MessageUtils.makeMessageLabel(_endpoint_data, ENDPOINT_TYPES.PRIMARY_ID, message_settings, pluralize.singular);
            break;

        case api_settings.API_UPDATED:

            _endpoint_data = {
                primary: action.payload.data.type,
                primary_id: action.payload.data.id
            };
            _label = MessageUtils.makeMessageLabel(_endpoint_data, ENDPOINT_TYPES.PRIMARY_ID, message_settings, pluralize.singular);

            break;

        case api_settings.API_READ:
        case api_settings.API_WILL_READ:

            _endpoint_type = JsonApiUtils.getEndpointType(_endpoint);
            _endpoint_data = JsonApiUtils.splitEndpoint(_endpoint, _endpoint_type);

            _label = MessageUtils.makeMessageLabel(_endpoint_data, _endpoint_type, message_settings, pluralize.singular);
            break;

        case message_settings.ACTION_REQUEST_DELETE_CONFIRMATION:
            _label = action.data.hasOwnProperty('name') ? action.data.name : "this record";
            break;
    }

    // make message data

    switch (action.type) {

        case api_settings.API_DELETE_FAILED:
            _data = {
                label: `could not delete data`,
                style: MESSAGE_STYLE.DANGER,
                expire: message_settings.default_message_expire
            };
            break;

        case api_settings.API_DELETED:
            _data = {
                label: `successfully deleted ${_label}`,
                style: MESSAGE_STYLE.SUCCESS,
                expire: message_settings.default_message_expire
            };
            break;

        case api_settings.API_READ:
            _data = {
                label: `successfully fetched ${_label}`,
                style: MESSAGE_STYLE.SUCCESS,
                expire: message_settings.default_message_expire
            };
            break;

        case api_settings.API_READ_FAILED:
            _data = {
                label: `could not fetch data`,
                style: MESSAGE_STYLE.DANGER,
                expire: message_settings.default_message_expire
            };
            break;

        case api_settings.API_UPDATE_FAILED:
            _data = {
                label: `could not update data`,
                style: MESSAGE_STYLE.DANGER,
                expire: message_settings.default_message_expire
            };
            break;

        case api_settings.API_UPDATED:
            _data = {
                label: `successfully updated ${_label}`,
                style: MESSAGE_STYLE.SUCCESS,
                expire: message_settings.default_message_expire
            };
            break;

        case api_settings.API_WILL_READ:
            _data = {
                label: `fetching ${_label}`,
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

        case api_settings.API_WILL_UPDATE:
            _data = {
                label: `updating ${_label}`,
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

        case api_settings.API_WILL_DELETE:
            _data = {
                label: `deleting ${_label}`,
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

        case message_settings.ACTION_REQUEST_DELETE_CONFIRMATION:
            _data = {
                action: action,
                label: `are you sure you want to delete "${_label}"?`,
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

        case message_settings.ACTION_CANCEL_DELETE:
            return null;
    }

    if (_data === null) {
        return state;
    }

    return new Message(_data);
}

