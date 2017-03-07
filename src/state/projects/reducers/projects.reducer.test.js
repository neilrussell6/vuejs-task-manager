import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// app
import { Project } from 'data/models/crud/jsonapi/project.model';
import { API_READ } from 'state/redux-json-api.settings';

// local
import * as Reducer from './projects.reducer';

describe('projects reducer', () => {

    it('should return before state by default', () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.projects(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    describe('redux-json-api', () => {

        describe('API_READ', () => {

            it('should return array of Project model instances', () => {

                const _state_before = [];
                const _action = {
                    type: API_READ,
                    payload: {
                        data: [
                            {
                                id: 101,
                                attributes: { name: 'AAA' },
                                type: 'projects'
                            }
                        ],
                        endpoint: 'users/1/projects'
                    }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.projects(_state_before, _action);

                expect(_result.length).to.equal(1);

                expect(_result[0] instanceof Project).to.equal(true, 'item should be instance of Project');
            });

            it('should ignore data not of projects type', () => {

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
                        endpoint: 'users/1/projects'
                    }
                };

                deepFreeze(_state_before);
                deepFreeze(_action);

                let _result = Reducer.projects(_state_before, _action);

                expect(_result.length).to.equal(1);

                expect(_result[0].name).to.equal('AAA');
            });
        });
    });
});
