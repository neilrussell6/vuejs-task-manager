import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import sinon from 'sinon';

// app
import { API_READ } from 'state/redux-json-api.constants';
import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// local
import * as task_constants from '../task.constants';
import * as Reducer from './tasks.reducer';

describe("tasks reducer", () => {

    before(() => {
        sinon.stub(LocalStorageUtils, 'getUniqueLocalId').returns(123456);
    });

    after(() => {
        LocalStorageUtils.getUniqueLocalId.restore(); // Unwraps the spy
    });

    it("should return before state by default", () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.tasks(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    describe("ACTION_MAKE_TASK", () => {

        it("should add a task to the list", () => {

            const _state_before = [];
            const _action = {
                type: task_constants.ACTION_MAKE_TASK, tasks: [], data: { text: 'AAAA' }
            };

            deepFreeze(_state_before);
            deepFreeze(_action);

            let _result = Reducer.tasks(_state_before, _action);

            expect(_result.length).to.equal(1);
        });
    });

    describe("ACTION_REMOVE_TASK", () => {

        it("should find task by local_id and remove it from array", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.INCOMPLETE });
            let _task3 = new Task({ server_id: 3, local_id: 3, text: 'CCCC', status: TASK_STATUS.INCOMPLETE });

            const _state_before = [ _task1, _task2, _task3 ];
            const _expected = [ _task1, _task3 ];
            const _action = {
                type: task_constants.ACTION_REMOVE_TASK, task: _task2
            };

            deepFreeze(_state_before);
            deepFreeze(_action);

            let _result = Reducer.tasks(_state_before, _action);

            expect(_result).to.deep.equal(_expected);
        });
    });

    describe("ACTION_UPDATE_TASK_LOCALLY", () => {

        it("should update task data using provided local_id and data", () => {

            let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
            let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.INCOMPLETE });

            const _state_before = [ _task1, _task2 ];
            const _action = {
                type: task_constants.ACTION_UPDATE_TASK_LOCALLY, task: _task2, data: {text: 'XXXX'}
            };

            deepFreeze(_state_before);
            deepFreeze(_action);
            deepFreeze(_action.data);

            let _result = Reducer.tasks(_state_before, _action);

            expect(_result[1].text).to.equal('XXXX');
        });
    });

    describe("redux-json-api", () => {

        describe("API_READ", () => {

            it("should return array of Task model instances", () => {

                const _state_before = [];
                const _action = {
                    type: API_READ,
                    payload: {
                        data: [
                            {
                                id: 101,
                                attributes: { name: 'AAA' },
                                type: 'tasks'
                            }
                        ],
                        endpoint: 'users/1/tasks'
                    }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.tasks(_state_before, _action);

                expect(_result.length).to.equal(1);

                expect(_result[0] instanceof Task).to.equal(true, 'item should be instance of Task');
            });

            it("should ignore data not of tasks type", () => {

                const _state_before = [];
                const _action = {
                    type: API_READ,
                    payload: {
                        data: [
                            {
                                id: 101,
                                attributes: { name: 'BBB' },
                                type: 'tasks'
                            },
                            {
                                id: 102,
                                attributes: { name: 'AAA' },
                                type: 'projects'
                            }
                        ],
                        endpoint: 'users/1/tasks'
                    }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.tasks(_state_before, _action);

                expect(_result.length).to.equal(1);

                expect(_result[0].name).to.equal('BBB');
            });
        });
    });
});
