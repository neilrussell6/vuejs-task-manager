import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import sinon from 'sinon';

// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import { API_READ } from 'state/redux-json-api.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as Reducer from './projects.reducer';
import * as project_constants from '../project.constants';

describe("projects.reducer", () => {

    before(() => {
        sinon.stub(StorageUtils, 'makeUUID').returns(123456);
    });

    after(() => {
        StorageUtils.makeUUID.restore(); // Unwraps the spy
    });

    // ---------------------------
    // local storage
    // ---------------------------

    describe("state", () => {

    });

    // ---------------------------
    // state
    // ---------------------------

    describe("state", () => {

        it("should return before state by default", () => {

            const _state_before = 'AAA';
            const _action = {};

            deepFreeze(_action);

            let _result = Reducer.projects(_state_before, _action);

            expect(_result).to.equal(_state_before);
        });

        describe("ACTION_MAKE_PROJECT", () => {

            it("should add a project to the list", () => {

                const _state_before = [];
                const _action = {
                    type: project_constants.ACTION_MAKE_PROJECT
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.projects(_state_before, _action);

                expect(_result.length).to.equal(1);
            });
        });

        describe("ACTION_REMOVE_PROJECT", () => {

            it("should find project by uuid and remove it from array", () => {

                let _project1 = new Project({ server_id: 1, uuid: 1, text: 'AAAA' });
                let _project2 = new Project({ server_id: 2, uuid: 2, text: 'BBBB' });
                let _project3 = new Project({ server_id: 3, uuid: 3, text: 'CCCC' });

                const _state_before = [ _project1, _project2, _project3 ];
                const _expected = [ _project1, _project3 ];
                const _action = {
                    type: project_constants.ACTION_REMOVE_PROJECT, uuid: _project2.uuid
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.projects(_state_before, _action);

                expect(_result).to.deep.equal(_expected);
            });
        });

        // describe("ACTION_UPDATE_PROJECT_LOCALLY", () => {
        //
        //     it("should update project data using provided uuid and data", () => {
        //
        //         let _project1 = new Project({ server_id: 1, uuid: 1, text: 'AAAA' });
        //         let _project2 = new Project({ server_id: 2, uuid: 2, text: 'BBBB' });
        //
        //         const _state_before = [ _project1, _project2 ];
        //         const _action = {
        //             type: project_constants.ACTION_UPDATE_PROJECT_LOCALLY, project: _project2, data: {text: 'XXXX'}
        //         };
        //
        //         deepFreeze(_state_before);
        //         deepFreeze(_action);
        //         deepFreeze(_action.data);
        //
        //         let _result = Reducer.projects(_state_before, _action);
        //
        //         expect(_result[1].text).to.equal('XXXX');
        //     });
        // });
        //
        // describe("redux-json-api", () => {
        //
        //     describe("API_READ", () => {
        //
        //         it("should return array of Project model instances", () => {
        //
        //             const _state_before = [];
        //             const _action = {
        //                 type: API_READ,
        //                 payload: {
        //                     data: [
        //                         {
        //                             id: 101,
        //                             attributes: { name: 'AAA' },
        //                             type: 'projects'
        //                         }
        //                     ],
        //                     endpoint: 'users/1/projects'
        //                 }
        //             };
        //
        //             deepFreeze(_state_before);
        //             deepFreeze(_action);
        //
        //             let _result = Reducer.projects(_state_before, _action);
        //
        //             expect(_result.length).to.equal(1);
        //
        //             expect(_result[0] instanceof Project).to.equal(true, 'item should be instance of Project');
        //         });
        //
        //         it("should ignore data not of projects type", () => {
        //
        //             const _state_before = [];
        //             const _action = {
        //                 type: API_READ,
        //                 payload: {
        //                     data: [
        //                         {
        //                             id: 101,
        //                             attributes: { name: 'BBB' },
        //                             type: 'tasks'
        //                         },
        //                         {
        //                             id: 102,
        //                             attributes: { name: 'AAA' },
        //                             type: 'projects'
        //                         }
        //                     ],
        //                     endpoint: 'users/1/projects'
        //                 }
        //             };
        //
        //             deepFreeze(_state_before);
        //             deepFreeze(_action);
        //
        //             let _result = Reducer.projects(_state_before, _action);
        //
        //             expect(_result.length).to.equal(1);
        //
        //             expect(_result[0].name).to.equal('AAA');
        //         });
        //     });
        // });
    });
});
