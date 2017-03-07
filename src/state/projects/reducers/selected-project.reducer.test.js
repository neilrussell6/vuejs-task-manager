import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// app
import { Project } from 'data/models/crud/jsonapi/project.model';

// local
import * as Reducer from './selected-project.reducer';
import { ACTION_SELECT_PROJECT } from '../project.settings';

describe('selected_project reducer', () => {

    it('should return before state by default', () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.selected_project(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    describe('ACTION_SELECT_PROJECT', () => {

        it('should return single Project model instance', () => {

            const _state_before = {};
            const _action = {
                type: ACTION_SELECT_PROJECT,
                data: {
                    id: 101,
                    name: 'AAA'
                }
            };

            deepFreeze(_state_before);
            deepFreeze(_action);

            let _result = Reducer.selected_project(_state_before, _action);

            expect(_result instanceof Project).to.equal(true, 'item should be instance of Project');
        });
    });
});
