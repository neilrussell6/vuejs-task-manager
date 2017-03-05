// models
import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';
import { TASK_STATUS } from 'data/models/basic/task.model';

// ---------------------------
// public
// ---------------------------

export function filterTasks (tasks, type) {
    return tasks.filter((task) => {
        return (
            (type === STATUS_FILTER_TYPE.ALL && task.status !== TASK_STATUS.TRASH) ||
            (type === STATUS_FILTER_TYPE.INCOMPLETE && task.status === TASK_STATUS.INCOMPLETE) ||
            (type === STATUS_FILTER_TYPE.COMPLETE && task.status === TASK_STATUS.COMPLETE) ||
            (type === STATUS_FILTER_TYPE.TRASH && task.status === TASK_STATUS.TRASH)
        );
    });
}
