import { CRUDModel } from '../crud.model';

export const TASK_STATUS = {
    INCOMPLETE:     1, // 'task-status-incomplete',
    COMPLETE:       2, // 'task-status-complete',
    TRASH:          3 // 'task-status-trash'
};

export class Task extends CRUDModel {

    get defaults () {
        return {
            name: '',
            status: TASK_STATUS.INCOMPLETE,
            priority: 0,
            type: null
        };
    }
}
