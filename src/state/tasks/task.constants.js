import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';

// --------------------------
// actions
// --------------------------

// text filter
export const ACTION_SET_TEXT_FILTER         = 'SET_TEXT_FILTER';
export const ACTION_RESET_TEXT_FILTER       = 'RESET_TEXT_FILTER';

// visibility filter
export const ACTION_SET_COMPLETE_FILTER     = 'SET_COMPLETE_FILTER';
export const ACTION_RESET_COMPLETE_FILTER   = 'RESET_COMPLETE_FILTER';

// tasks : local storage
export const ACTION_STORAGE_LOCAL_INDEXED_TASKS    = 'STORAGE_SERVER_INDEXED_TASKS';

// tasks : server
export const ACTION_STORAGE_SERVER_INDEXED_TASKS    = 'STORAGE_SERVER_INDEXED_TASKS';

// tasks : state
export const ACTION_DESELECT_TASK    = 'DESELECT_TASK';
export const ACTION_MAKE_TASK        = 'MAKE_TASK';
export const ACTION_REMOVE_TASK      = 'REMOVE_TASK';
export const ACTION_SELECT_TASK      = 'SELECT_TASK';

// --------------------------
// default states
// --------------------------

export const DEFAULT_EDITING_TASK_STATE     = null;
export const DEFAULT_TASK_LIST_STATE        = [];
export const DEFAULT_COMPLETE_FILTER_STATE  = STATUS_FILTER_TYPE.ALL;
export const DEFAULT_TEXT_FILTER_STATE      = '';
