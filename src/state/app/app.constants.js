import * as app_settings from 'data/app.settings';

// --------------------------
// actions
// --------------------------

export const ACTION_TOGGLE_ARTIFICIAL_DELAY = 'ACTION_TOGGLE_ARTIFICIAL_DELAY';
export const ACTION_TOGGLE_MESSAGE_MINIMAL = 'ACTION_TOGGLE_MESSAGE_MINIMAL';

// --------------------------
// default states
// --------------------------

export const DEFAULT_STATE = {
    is_disabled: false,
    artificial_delay: app_settings.ARTIFICIAL_DELAY_DEFAULT ? app_settings.ARTIFICIAL_DELAY : 0,
    is_message_minimal: app_settings.MINIMAL_MESSAGE_DEFAULT
};