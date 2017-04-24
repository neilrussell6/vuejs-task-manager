import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

// models
import { Task } from 'data/models/crud/jsonapi/task.model';

// SUT
import * as utils from './text-filter.utils';

describe("text-filter.utils", () => {

    describe("filterTasks", () => {

        it("should return tasks whose text contain text term", () => {

            const _tasks = [
                new Task({ server_id: 11, name: 'aaa' }),
                new Task({ server_id: 22, name: 'aaab' }),
                new Task({ server_id: 33, name: 'baaa' }),
                new Task({ server_id: 44, name: 'bbbb' })
            ];
            const _text_term = 'aa';

            deepFreeze(_tasks);

            let _result = utils.filterTasks(_tasks, _text_term);
            let _ids = _result.map((item) => item.server_id );

            expect(_ids).to.include(11);
            expect(_ids).to.include(22);
            expect(_ids).to.include(33);
        });

        it("should be case insensitive", () => {

            const _tasks = [
                new Task({ server_id: 11, name: 'AAA' }),
                new Task({ server_id: 22, name: 'aaa' })
            ];
            const _text_term = 'aa';

            deepFreeze(_tasks);

            let _result = utils.filterTasks(_tasks, _text_term);
            let _ids = _result.map((item) => item.server_id );

            expect(_ids).to.include(11);
            expect(_ids).to.include(22);
        });
    });
});
