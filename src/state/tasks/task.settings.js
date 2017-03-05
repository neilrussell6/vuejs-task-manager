import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';

// --------------------------
// actions
// --------------------------

// text filter
export const ACTION_SET_TEXT_FILTER         = 'SET_TEXT_FILTER';

// visibility filter
export const ACTION_SET_COMPLETE_FILTER     = 'SET_COMPLETE_FILTER';

// task
// export const ACTION_MAKE_TASK               = 'MAKE_TASK';
// export const ACTION_ADD_TASK                = 'ADD_TASK';
export const ACTION_DELETE_TASK             = 'DELETE_TASK';
export const ACTION_TOGGLE_TASK_COMPLETE    = 'TOGGLE_TASK_COMPLETE';
export const ACTION_TRASH_TASK              = 'TRASH_TASK';
export const ACTION_UNDO_TRASH_TASK         = 'UNDO_TRASH_TASK';
export const ACTION_UPDATE_TASK             = 'UPDATE_TASK';

// tasks
export const ACTION_REFRESH_TASKS           = 'REFRESH_TASKS';
export const ACTION_FETCH_TASKS             = 'FETCH_TASKS';

// --------------------------
// default states
// --------------------------

export const DEFAULT_EDITING_TASK_STATE     = null;
export const DEFAULT_TASK_LIST_STATE        = [];
export const DEFAULT_COMPLETE_FILTER_STATE  = STATUS_FILTER_TYPE.ALL;
export const DEFAULT_TEXT_FILTER_STATE      = '';
