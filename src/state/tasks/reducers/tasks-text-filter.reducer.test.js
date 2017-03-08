import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// local
import * as task_constants from '../task.constants';
import * as Reducer from './tasks-text-filter.reducer';

describe("tasks_text_filter reducer", () => {

    it("should return before state by default", () => {

        const _state_before = 'AAA';
        const _action = {};

        deepFreeze(_action);

        let _result = Reducer.tasks_text_filter(_state_before, _action);

        expect(_result).to.equal(_state_before);
    });

    it("should set text filter value", () => {

        const _state_before = '';
        const _expected = 'AAA';
        const _action = {
            type: task_constants.ACTION_SET_TEXT_FILTER,
            value: 'AAA'
        };

        deepFreeze(_action);

        let _result = Reducer.tasks_text_filter(_state_before, _action);

        expect(_result).to.equal(_expected);
    });
});
