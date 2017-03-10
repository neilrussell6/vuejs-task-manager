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

// task
export const ACTION_MAKE_TASK               = 'MAKE_TASK';
export const ACTION_REMOVE_TASK             = 'ACTION_REMOVE_TASK';
export const ACTION_UPDATE_TASK_LOCALLY     = 'UPDATE_TASK_LOCALLY';

// --------------------------
// default states
// --------------------------

export const DEFAULT_EDITING_TASK_STATE     = null;
export const DEFAULT_TASK_LIST_STATE        = [];
export const DEFAULT_COMPLETE_FILTER_STATE  = STATUS_FILTER_TYPE.ALL;
export const DEFAULT_TEXT_FILTER_STATE      = '';
