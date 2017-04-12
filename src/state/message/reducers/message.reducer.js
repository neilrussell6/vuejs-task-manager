// data
import { Message, MESSAGE_STYLE } from 'data/models/basic/message.model';
import * as message_settings from 'data/message.settings';

// state
import * as app_constants from 'state/app/app.constants';
import * as storage_constants from 'state/storage/storage.constants';
import * as user_constants from 'state/user/user.constants';

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

        // ---------------------------
        // API
        // ---------------------------

        case storage_constants.ACTION_STORAGE_ERROR_CONNECTION:
            _label = "could not connect to server";
            break;

        case storage_constants.ACTION_STORAGE_ERROR_STORAGE_SERVER_INTERNAL:
            _label = "there was an internal error on the server";
            break;

        case storage_constants.ACTION_STORAGE_ERROR_BAD_REQUEST:
            _label = action.error.detail;
            break;

        case storage_constants.ACTION_STORAGE_ERROR_UNKNOWN:
            _label = "an unknown error occurred";
            break;

        // ---------------------------
        // state
        // ---------------------------

        case message_constants.ACTION_REQUEST_DELETE_CONFIRMATION:

            switch (action.data.type) {
                case 'tasks': _label = "this task";
            }
            break;
    }

    // make message data

    switch (action.type) {

        // ---------------------------
        // app
        // ---------------------------

        case app_constants.ACTION_WILL_CONNECT:
            _data = {
                label: "reconnecting",
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

            case app_constants.ACTION_CONNECTED:
            _data = {
                label: "connection successful",
                style: MESSAGE_STYLE.SUCCESS
            };
            break;

        // ---------------------------
        // API
        // ---------------------------

        case storage_constants.ACTION_STORAGE_WILL_SYNC:
            _data = {   
                label: "syncing data",
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

        case storage_constants.ACTION_STORAGE_SYNCED:
            _data = {
                label: "sync complete",
                style: MESSAGE_STYLE.SUCCESS,
                expire: message_settings.MESSAGE_DEFAULT_EXPIRE
            };
            break;

        case storage_constants.ACTION_STORAGE_ERROR_CONNECTION:
        case storage_constants.ACTION_STORAGE_ERROR_STORAGE_SERVER_INTERNAL:
        case storage_constants.ACTION_STORAGE_ERROR_BAD_REQUEST:
        case storage_constants.ACTION_STORAGE_ERROR_UNKNOWN:
            _data = {
                label: _label,
                style: MESSAGE_STYLE.WARNING,
                icon: {
                    class: 'fa fa-exclamation-triangle fa-2x'
                },
                expire: message_settings.MESSAGE_DEFAULT_EXPIRE
            };
            break;

        // ---------------------------
        // user
        // ---------------------------

        case user_constants.ACTION_TOKEN_EXPIRED:
            _data = {
                action: action,
                label: "access to server is expired please login again",
                style: MESSAGE_STYLE.WARNING,
                icon: {
                    class: 'fa fa-exclamation-triangle fa-2x'
                },
                buttons: [ {label: 'WORK OFFLINE'} ]
            };
            break;

        case user_constants.ACTION_WILL_LOGIN_USER:
            _data = {
                label: "authenticating your credentials",
                style: MESSAGE_STYLE.INFO,
                icon: {
                    class: 'fa fa-cog fa-spin fa-2x fa-fw'
                }
            };
            break;

        case user_constants.ACTION_LOGGED_IN_USER:
            _data = {
                label: `successfully authenticated for ${action.user.first_name} ${action.user.last_name}`,
                style: MESSAGE_STYLE.SUCCESS,
                expire: message_settings.MESSAGE_DEFAULT_EXPIRE
            };
            break;

        // ---------------------------
        // state
        // ---------------------------

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

        case storage_constants.ACTION_STORAGE_LOCAL_DESTROYED:
        case message_constants.ACTION_CLEAR_MESSAGE:
        case message_constants.ACTION_CANCEL_DELETE:
            return null;
    }

    if (_data === null) {
        return state;
    }

    return new Message(_data);
}




