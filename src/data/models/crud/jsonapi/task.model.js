import { JsonApiModel } from '../../jsonapi.model';

export const TASK_STATUS = {
    INCOMPLETE:     1, // 'task-status-incomplete',
    COMPLETE:       2, // 'task-status-complete',
    TRASH:          3 // 'task-status-trash'
};

export class Task extends JsonApiModel {

    get defaults () {
        return {
            server_id: null,
            uuid: null,
            user_uuid: null,
            project_uuid: null,
            name: '',
            status: TASK_STATUS.INCOMPLETE,
            is_new: false
        };
    }

    get exclude_attributes () {
        return ['server_id', 'uuid', 'project_uuid', 'user_uuid', 'created_at', 'updated_at', 'is_new'];
    }

    get type () {
        return 'tasks';
    }

    makeRelatedUuids (relationships) {

        let _result = {};

        if (relationships.hasOwnProperty('owner')) {
            _result['user_uuid'] = relationships['owner'].uuid;
        }

        if (relationships.hasOwnProperty('project')) {
            _result['project_uuid'] = relationships['project'].uuid;
        }

        return _result;
    }
    
    toggleStatusComplete () {

        if ([ TASK_STATUS.COMPLETE, TASK_STATUS.INCOMPLETE ].indexOf(parseInt(this.status)) === -1) {
            return this;
        }

        const _data = Object.assign({}, this.properties, { status: this.status === TASK_STATUS.COMPLETE ? TASK_STATUS.INCOMPLETE : TASK_STATUS.COMPLETE });
        return new Task(_data);
    }

    trash () {
        const _data = Object.assign({}, this.properties, { status: TASK_STATUS.TRASH });
        return new Task(_data);
    }

    undoTrash () {
        const _data = Object.assign({}, this.properties, { status: TASK_STATUS.INCOMPLETE });
        return new Task(_data);
    }
}
