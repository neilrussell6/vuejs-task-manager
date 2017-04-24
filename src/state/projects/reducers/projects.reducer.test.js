import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import sinon from 'sinon';

// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as storage_constants from 'state/storage/storage.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as Reducer from './projects.reducer';
import * as project_constants from '../project.constants';

describe("projects.reducer", () => {

    before(() => {
        sinon.stub(StorageUtils, 'makeUUID').returns("123456");
    });

    after(() => {
        StorageUtils.makeUUID.restore(); // Unwraps the spy
    });

    // ---------------------------
    // local storage
    // ---------------------------

    describe("projects.reducer.storage.local", () => {

        describe("ACTION_STORAGE_LOCAL_DESTROYED", () => {

            it("should remove item from existing state", () => {


                const _project1 = new Project({ server_id: 1, uuid: 111, text: 'AAAA' });
                const _project2 = new Project({ server_id: 2, uuid: 222, text: 'BBBB' });
                const _project3 = new Project({ server_id: 3, uuid: 333, text: 'CCCC' });

                const _state_before = [
                    _project1,
                    _project2,
                    _project3
                ];
                const _action = {
                    type: storage_constants.ACTION_STORAGE_LOCAL_DESTROYED,
                    resource_type: 'projects',
                    resource: _project2
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                const _result = Reducer.projects(_state_before, _action);

                const _result_uuids = _result.map((item) => item.uuid);

                expect(_result_uuids).to.not.include(_project2.uuid);
                expect(_result_uuids).to.include(_project1.uuid);
                expect(_result_uuids).to.include(_project3.uuid);
            });
        });

        describe("ACTION_STORAGE_LOCAL_INDEXED", () => {

            it("should return a list of projects, ignoring existing state", () => {

                const _state_before = [
                    new Project({ server_id: 1, uuid: 111, text: 'AAAA' })
                ];
                const _action = {
                    type: storage_constants.ACTION_STORAGE_LOCAL_INDEXED,
                    resource_type: 'projects',
                    resources: [
                        new Project({ server_id: 2, uuid: 222, text: 'BBBB' }),
                        new Project({ server_id: 3, uuid: 333, text: 'CCCC' })
                    ]
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                const _result = Reducer.projects(_state_before, _action);

                const _result_uuids = _result.map((item) => item.uuid);

                expect(_result_uuids).to.not.include(111);
                expect(_result_uuids).to.include(222);
                expect(_result_uuids).to.include(333);
            });
        });

        describe("ACTION_STORAGE_LOCAL_STORED", () => {

            it("should update project data using provided project and state data", () => {

                let _project1 = new Project({ server_id: 1, uuid: 1, text: 'AAAA' });
                let _project2 = new Project({ server_id: 2, uuid: 2, text: 'BBBB' });

                const _state_before = [ _project1, _project2 ];
                const _action = {
                    type: storage_constants.ACTION_STORAGE_LOCAL_STORED,
                    resource_type: 'projects',
                    resource: _project2,
                    data: { text: 'XXXX' }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.projects(_state_before, _action);

                expect(_result).to.have.length(2);
                expect(_result[1].text).to.equal('XXXX');
            });
        });

        describe("ACTION_STORAGE_LOCAL_UPDATED", () => {

            it("should update project data using provided project and state data", () => {

                let _project1 = new Project({ server_id: 1, uuid: 1, text: 'AAAA' });
                let _project2 = new Project({ server_id: 2, uuid: 2, text: 'BBBB' });

                const _state_before = [ _project1, _project2 ];
                const _action = {
                    type: storage_constants.ACTION_STORAGE_LOCAL_UPDATED,
                    resource_type: 'projects',
                    resource: _project2,
                    data: { text: 'XXXX' }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.projects(_state_before, _action);

                expect(_result).to.have.length(2);
                expect(_result[1].text).to.equal('XXXX');
            });
        });
    });

    // ---------------------------
    // server
    // ---------------------------

    describe("projects.reducer.storage.server", () => {

        describe("ACTION_STORAGE_SERVER_INDEXED", () => {

            it("should return a list of projects, merging action data into state, updating local items with server data and assigning uuids to server items not already in state", () => {

                const _state_before = [
                    new Project({ server_id: 3, uuid: 111, name: 'AAAA' }),
                    new Project({ server_id: 2, uuid: 222, name: 'BBBB' })
                ];
                const _action = {
                    type: storage_constants.ACTION_STORAGE_SERVER_INDEXED,
                    resource_type: 'projects',
                    resources: [
                        { id: 2, attributes: { name: 'BBBB2222' }, type: 'projects'},
                        { id: 1, attributes: { name: 'CCCC' }, type: 'projects'}
                    ],
                    related: {
                        user: {
                            uuid: 123
                        }
                    }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                const _result = Reducer.projects(_state_before, _action);

                expect(_result).to.have.length(3);

                expect(_result[2]).to.have.property('server_id', 3);
                expect(_result[2]).to.have.property('uuid', 111);
                expect(_result[2]).to.have.property('name', 'AAAA');

                expect(_result[1]).to.have.property('server_id', 2);
                expect(_result[1]).to.have.property('uuid', 222);
                expect(_result[1]).to.have.property('name', 'BBBB2222');

                expect(_result[0]).to.have.property('server_id', 1);
                expect(_result[0]).to.have.property('uuid', '123456');
                expect(_result[0]).to.have.property('name', 'CCCC');
                expect(_result[0]).to.have.property('user_uuid', 123);
            });
        });
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
    });
});
