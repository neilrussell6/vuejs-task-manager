import { JsonApiModel } from '../../jsonapi.model';

export const TASK_STATUS = {
    INCOMPLETE:     1, // 'task-status-incomplete',
    COMPLETE:       2, // 'task-status-complete',
    TRASH:          3 // 'task-status-trash'
};

export class Task extends JsonApiModel {

    get defaults () {
        return {
            name: '',
            status: TASK_STATUS.INCOMPLETE
        };
    }

    get type () {
        return 'tasks';
    }
    
    toggleCompleteStatus () {

        if ([ TASK_STATUS.COMPLETE, TASK_STATUS.INCOMPLETE ].indexOf(parseInt(this.status)) === -1) {
            return this;
        }

        const _data = Object.assign({}, this.properties, { status: this.status === TASK_STATUS.COMPLETE ? TASK_STATUS.INCOMPLETE : TASK_STATUS.COMPLETE });

        return new Task(_data);
    }
}
