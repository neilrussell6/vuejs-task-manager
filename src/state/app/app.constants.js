import * as app_settings from 'data/app.settings';

// --------------------------
// actions
// --------------------------

export const ACTION_TOGGLE_ARTIFICIAL_DELAY = 'TOGGLE_ARTIFICIAL_DELAY';
export const ACTION_TOGGLE_MESSAGE_MINIMAL = 'TOGGLE_MESSAGE_MINIMAL';
export const ACTION_TOGGLE_SHOW_LOGIN = 'TOGGLE_SHOW_LOGIN';
export const ACTION_WORK_OFFLINE = 'WORK_OFFLINE';
export const ACTION_WILL_CONNECT = 'WILL_CONNECT';
export const ACTION_CONNECTED = 'CONNECTED';

// --------------------------
// default states
// --------------------------

export const DEFAULT_STATE = {
    is_disabled: false,
    is_offline: false,
    is_refreshing_projects: false,
    show_login: false,
    artificial_delay: app_settings.ARTIFICIAL_DELAY_DEFAULT ? app_settings.ARTIFICIAL_DELAY : 0,
    is_message_minimal: app_settings.MINIMAL_MESSAGE_DEFAULT
};
