import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// constants
import { TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// models
import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';
import { Task } from 'data/models/crud/jsonapi/task.model';

// SUT
import * as Utils from './status-filter.utils';

describe('complete filter utils', () => {

    describe('filterTasks', () => {

        it('should return a list of completed tasks, when status filter is set to complete', () => {

            const _tasks = [
                new Task({ server_id: 111, name: 'DDD', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 555, name: 'AAA', status: TASK_STATUS.INCOMPLETE }),
                new Task({ server_id: 222, name: 'BBB', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 333, name: 'CCC', status: TASK_STATUS.TRASH })
            ];

            deepFreeze(_tasks);

            const _result = Utils.filterTasks(_tasks, STATUS_FILTER_TYPE.COMPLETE);
            const _filtered_task_ids = _result.map((task) => task.server_id);

            expect(_filtered_task_ids).to.include(111);
            expect(_filtered_task_ids).to.not.include(555);
            expect(_filtered_task_ids).to.include(222);
            expect(_filtered_task_ids).to.not.include(333);
        });

        it('should return a list of incomplete tasks, when status filter is set to incomplete', () => {

            const _tasks = [
                new Task({ server_id: 111, name: 'DDD', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 555, name: 'AAA', status: TASK_STATUS.INCOMPLETE }),
                new Task({ server_id: 222, name: 'BBB', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 333, name: 'CCC', status: TASK_STATUS.TRASH })
            ];

            deepFreeze(_tasks);

            const _result = Utils.filterTasks(_tasks, STATUS_FILTER_TYPE.INCOMPLETE);
            const _filtered_task_ids = _result.map((task) => task.server_id);

            expect(_filtered_task_ids).to.not.include(111);
            expect(_filtered_task_ids).to.include(555);
            expect(_filtered_task_ids).to.not.include(222);
            expect(_filtered_task_ids).to.not.include(333);
        });

        it('should return a list of trashed tasks, when status filter is set to trash', () => {

            const _tasks = [
                new Task({ server_id: 111, name: 'DDD', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 555, name: 'AAA', status: TASK_STATUS.INCOMPLETE }),
                new Task({ server_id: 222, name: 'BBB', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 333, name: 'CCC', status: TASK_STATUS.TRASH })
            ];

            deepFreeze(_tasks);

            const _result = Utils.filterTasks(_tasks, STATUS_FILTER_TYPE.TRASH);
            const _filtered_task_ids = _result.map((task) => task.server_id);

            expect(_filtered_task_ids).to.not.include(111);
            expect(_filtered_task_ids).to.not.include(555);
            expect(_filtered_task_ids).to.not.include(222);
            expect(_filtered_task_ids).to.include(333);
        });

        it('should return a list of al except trashed tasks, when status filter is set to all', () => {

            const _tasks = [
                new Task({ server_id: 111, name: 'DDD', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 555, name: 'AAA', status: TASK_STATUS.INCOMPLETE }),
                new Task({ server_id: 222, name: 'BBB', status: TASK_STATUS.COMPLETE }),
                new Task({ server_id: 333, name: 'CCC', status: TASK_STATUS.TRASH })
            ];

            deepFreeze(_tasks);

            const _result = Utils.filterTasks(_tasks, STATUS_FILTER_TYPE.ALL);
            const _filtered_task_ids = _result.map((task) => task.server_id);

            expect(_filtered_task_ids).to.include(111);
            expect(_filtered_task_ids).to.include(555);
            expect(_filtered_task_ids).to.include(222);
            expect(_filtered_task_ids).to.not.include(333);
        });
    });
});
