import { expect } from 'chai';

// app
import { ENDPOINT_TYPES } from 'utils/json-api/json-api.constants';

// local
import * as Utils from './message.utils';

describe("Message Utils", () => {

    describe("makeMessageLabel", () => {

        describe("PRIMARY endpoint", () => {

            it("given no config, should return label 'projects'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects'
                };
                let _endpoint_type = ENDPOINT_TYPES.PRIMARY;
                let _config = {};

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('projects');
            });
        });

        describe("PRIMARY_ID endpoint", () => {

            it("given config.MESSAGE_IDENTIFIER set to 'id', should return label 'project 123'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects',
                    primary_id: '123'
                };
                let _endpoint_type = ENDPOINT_TYPES.PRIMARY_ID;
                let _config = {
                    MESSAGE_IDENTIFIER: 'id'
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('project 123');
            });

            it("given config.MESSAGE_IDENTIFIER set to 'none', should return label 'project'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects',
                    primary_id: '123'
                };
                let _endpoint_type = ENDPOINT_TYPES.PRIMARY_ID;
                let _config = {
                    MESSAGE_IDENTIFIER: 'none'
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('project');
            });

            it("given config.MESSAGE_EXCLUDE_USER set to TRUE, should ignore config and still return label 'user 123'", () => {

                let _singularize = () => 'user';
                let _endpoint_data = {
                    primary: 'users',
                    primary_id: '123'
                };
                let _endpoint_type = ENDPOINT_TYPES.PRIMARY_ID;
                let _config = {
                    MESSAGE_IDENTIFIER: 'id',
                    MESSAGE_EXCLUDE_USER: true
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('user 123');
            });

            it("given config.MESSAGE_IDENTIFIER set to 'template', should return label 'project {project 123}'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects',
                    primary_id: '123'
                };
                let _endpoint_type = ENDPOINT_TYPES.PRIMARY_ID;
                let _config = {
                    MESSAGE_IDENTIFIER: 'template'
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('project {projects 123}');
            });
        });

        describe("RELATED/RELATIONSHIPS endpoint", () => {

            it("given config.MESSAGE_IDENTIFIER set to 'id', should return label 'tasks for project 123'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects',
                    primary_id: '123',
                    related: 'tasks'
                };
                let _endpoint_type = ENDPOINT_TYPES.RELATED;
                let _config = {
                    MESSAGE_IDENTIFIER: 'id'
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('tasks for project 123');
            });

            it("given config.MESSAGE_IDENTIFIER set to 'none', should return label 'tasks for project'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects',
                    primary_id: '123',
                    related: 'tasks'
                };
                let _endpoint_type = ENDPOINT_TYPES.RELATIONSHIPS;
                let _config = {
                    MESSAGE_IDENTIFIER: 'none'
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('tasks');
            });

            it("given config.MESSAGE_EXCLUDE_USER set to TRUE, should return label 'tasks'", () => {

                let _singularize = () => 'user';
                let _endpoint_data = {
                    primary: 'users',
                    primary_id: '123',
                    related: 'tasks'
                };
                let _endpoint_type = ENDPOINT_TYPES.RELATED;
                let _config = {
                    MESSAGE_IDENTIFIER: 'id',
                    MESSAGE_EXCLUDE_USER: true
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('tasks');
            });

            it("given config.MESSAGE_IDENTIFIER set to 'template', should return label 'tasks for project {project 123}'", () => {

                let _singularize = () => 'project';
                let _endpoint_data = {
                    primary: 'projects',
                    primary_id: '123',
                    related: 'tasks'
                };
                let _endpoint_type = ENDPOINT_TYPES.RELATIONSHIPS;
                let _config = {
                    MESSAGE_IDENTIFIER: 'template'
                };

                let _result = Utils.makeMessageLabel(_endpoint_data, _endpoint_type, _config, _singularize);

                expect(_result).to.equal('tasks for project {projects 123}');
            });
        });
    });

    describe("populateMessageLabelVars", () => {

        it("given label containing no valid vars should return label as is", () => {

            let _message_label = 'fetching tasks for project';
            let _data = {
                projects: [
                    {server_id: 11, name: 'My Project Eleven'},
                    {server_id: 22, name: 'My Project Twenty Two'}
                ]
            };
            let property = 'name';

            let _result = Utils.populateMessageLabelVars(_message_label, _data, property);

            expect(_result).to.equal('fetching tasks for project');
        });

        it("given label containing 1 valid vars, but no matching data, should remove var and should return updated label", () => {

            let _message_label = 'fetching tasks for project {projects 33}';
            let _data = {
                projects: [
                    {server_id: 11, name: 'My Project Eleven'},
                    {server_id: 22, name: 'My Project Twenty Two'}
                ]
            };
            let property = 'name';

            let _result = Utils.populateMessageLabelVars(_message_label, _data, property);

            expect(_result).to.equal('fetching tasks for project');
        });

        it("given label containing 1 valid var, with data & property, should populate var using data & property return updated label", () => {

            let _message_label = 'fetching tasks for project {projects 22}';
            let _data = {
                projects: [
                    {server_id: 11, name: 'My Project Eleven'},
                    {server_id: 22, name: 'My Project Twenty Two'}
                ]
            };
            let property = 'name';

            let _result = Utils.populateMessageLabelVars(_message_label, _data, property);

            expect(_result).to.equal('fetching tasks for project "My Project Twenty Two"');
        });

        it("given label containing 2 valid vars, with data & property, should populate both vars using data & property return updated label", () => {

            let _message_label = 'welcome {users 44}, fetching tasks for project {projects 11}';
            let _data = {
                projects: [
                    {server_id: 11, name: 'My Project Eleven'},
                    {server_id: 22, name: 'My Project Twenty Two'}
                ],
                users: [
                    {server_id: 44, name: 'Benny B'}
                ]
            };
            let property = 'name';

            let _result = Utils.populateMessageLabelVars(_message_label, _data, property);

            expect(_result).to.equal('welcome "Benny B", fetching tasks for project "My Project Eleven"');
        });
    });
});
