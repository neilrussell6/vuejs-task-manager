// --------------------------
// actions
// --------------------------

export const ACTION_CANCEL_DELETE = 'ACTION_CANCEL_DELETE';
export const ACTION_CONFIRM_DELETE = 'ACTION_CONFIRM_DELETE';
export const ACTION_REQUEST_DELETE_CONFIRMATION = 'ACTION_REQUEST_DELETE_CONFIRMATION';

// --------------------------
// config
// --------------------------

export let default_label_field = 'name';
export let default_message_expire = 1000;
export let should_hide_ids = true; // TRUE: fetching project, FALSE: fetching project 5;
export let should_exclude_user = true; // TRUE: fetching project, FALSE: fetching project 7 for user 122;
export let should_replace_ids_with_template = true; // TRUE: fetching tasks for project {project}, FALSE: fetching tasks for project 33;

export const label_fields = {
    projects: 'name'
};
