// import deepFreeze from 'deep-freeze';
// import { expect } from 'chai';
// import sinon from 'sinon';
//
// // data
// import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';
//
// // state
// import * as storage_constants from 'state/storage/storage.constants';
//
// // utils
// import * as StorageUtils from 'utils/storage/storage.utils';
//
// // local
// import * as task_constants from '../task.constants';
// import * as Reducer from './tasks.reducer';
//
// describe("tasks.reducer", () => {
//
//     before(() => {
//         sinon.stub(StorageUtils, 'makeUUID').returns(123456);
//     });
//
//     after(() => {
//         StorageUtils.makeUUID.restore(); // Unwraps the spy
//     });
//
//     it("should return before state by default", () => {
//
//         const _state_before = 'AAA';
//         const _action = {};
//
//         deepFreeze(_action);
//
//         let _result = Reducer.tasks(_state_before, _action);
//
//         expect(_result).to.equal(_state_before);
//     });
//
//     describe("ACTION_MAKE_TASK", () => {
//
//         it("should add a task to the list", () => {
//
//             const _state_before = [];
//             const _action = {
//                 type: task_constants.ACTION_MAKE_TASK, tasks: [], data: { text: 'AAAA' }
//             };
//
//             deepFreeze(_state_before);
//             deepFreeze(_action);
//
//             let _result = Reducer.tasks(_state_before, _action);
//
//             expect(_result.length).to.equal(1);
//         });
//     });
//
//     describe("ACTION_REMOVE_TASK", () => {
//
//         it("should find task by local_id and remove it from array", () => {
//
//             let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
//             let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.INCOMPLETE });
//             let _task3 = new Task({ server_id: 3, local_id: 3, text: 'CCCC', status: TASK_STATUS.INCOMPLETE });
//
//             const _state_before = [ _task1, _task2, _task3 ];
//             const _expected = [ _task1, _task3 ];
//             const _action = {
//                 type: task_constants.ACTION_REMOVE_TASK, task: _task2
//             };
//
//             deepFreeze(_state_before);
//             deepFreeze(_action);
//
//             let _result = Reducer.tasks(_state_before, _action);
//
//             expect(_result).to.deep.equal(_expected);
//         });
//     });
//
//     describe("ACTION_UPDATE_STORAGE_LOCAL_TASK", () => {
//
//         it("should update task data using provided local_id and data", () => {
//
//             let _task1 = new Task({ server_id: 1, local_id: 1, text: 'AAAA', status: TASK_STATUS.INCOMPLETE });
//             let _task2 = new Task({ server_id: 2, local_id: 2, text: 'BBBB', status: TASK_STATUS.INCOMPLETE });
//
//             const _state_before = [ _task1, _task2 ];
//             const _action = {
//                 type: task_constants.ACTION_UPDATE_STORAGE_LOCAL_TASKLY, task: _task2, data: {text: 'XXXX'}
//             };
//
//             deepFreeze(_state_before);
//             deepFreeze(_action);
//             deepFreeze(_action.data);
//
//             let _result = Reducer.tasks(_state_before, _action);
//
//             expect(_result[1].text).to.equal('XXXX');
//         });
//     });
// });
