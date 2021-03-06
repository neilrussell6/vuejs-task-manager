import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// data
import { Task, TASK_STATUS } from './task.model';

describe("task.model", () => {

    describe("toggleStatusComplete", () => {

        it("should return a new Task instance with status set to complete, if the task is currently incomplete", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.INCOMPLETE });

            deepFreeze(_task1);
            deepFreeze(_task2);

            let _result = _task1.toggleStatusComplete();

            expect(_result).to.not.equal(_task1);
            expect(_result).to.be.instanceof(Task);
            expect(_result.status).to.equal(TASK_STATUS.COMPLETE);
        });

        it("should return a new Task instance with status set to incomplete, if the task is currently complete", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.COMPLETE });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.COMPLETE });

            deepFreeze(_task1);
            deepFreeze(_task2);

            let _result = _task2.toggleStatusComplete();

            expect(_result).to.not.equal(_task2);
            expect(_result).to.be.instanceof(Task);
            expect(_result.status).to.equal(TASK_STATUS.INCOMPLETE);
        });

        it("should return unchanged task if the task is currently trashed", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.TRASH });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.TRASH });

            deepFreeze(_task1);
            deepFreeze(_task2);

            let _result = _task1.toggleStatusComplete();

            expect(_result).to.equal(_task1);
            expect(_result.status).to.equal(TASK_STATUS.TRASH);
        });
    });

    describe("undoTrash", () => {

        it("should return a new Task instance with status set to incomplete, if the task is currently trashed", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.TRASH });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.TRASH });

            deepFreeze(_task1);
            deepFreeze(_task2);

            let _result = _task2.undoTrash();

            expect(_result.status).to.equal(TASK_STATUS.INCOMPLETE);
        });
    });

    describe("trash", () => {

        it("should return a new Task instance with status set to trashed, if the task is currently complete", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.COMPLETE });

            deepFreeze(_task1);
            deepFreeze(_task2);

            let _result = _task2.trash();
            expect(_result.status).to.equal(TASK_STATUS.TRASH);
        });

        it("should return a new Task instance with status set to trashed, if the task is currently incomplete", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.COMPLETE });

            deepFreeze(_task1);
            deepFreeze(_task2);

            let _result = _task1.trash();
            expect(_result.status).to.equal(TASK_STATUS.TRASH);
        });
    });
});
