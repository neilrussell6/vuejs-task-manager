import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// app
import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';

// local
import { ACTION_SET_COMPLETE_FILTER } from '../task.settings';
import * as Reducer from './tasks-status-filter.reducer';

describe('tasks_status_filter reducer', () => {

    it('should return before state by default', () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.tasks_status_filter(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    it('should set tasks status filter to provided value', () => {

        const _state_before = STATUS_FILTER_TYPE.ALL;
        const _expected = STATUS_FILTER_TYPE.COMPLETE;
        const _action = {
            type: ACTION_SET_COMPLETE_FILTER,
            value: STATUS_FILTER_TYPE.COMPLETE
        };

        deepFreeze(_action);

        let _result = Reducer.tasks_status_filter(_state_before, _action);

        expect(_result).to.equal(_expected);
    });
});
