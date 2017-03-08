import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import * as Util from './collection.utils';

describe("Collection Util", () => {

    describe("indexOfKeyValue", () => {

        it("should return index 1", () => {

            let _arr = [
                {"id": 101},
                {"id": 102},
                {"id": 103},
                {"id": 104}
            ];

            deepFreeze(_arr);

            let _result = Util.indexOfKeyValue(_arr, "id", 102);

            expect(_result).to.equal(1);
        });
    });

    describe("lastIndexOfKeyValue", () => {

        it("should return index 2", () => {

            let _arr = [
                {"id": 101, type: "AAA"},
                {"id": 102, type: "BBB"},
                {"id": 103, type: "BBB"},
                {"id": 104, type: "AAA"}
            ];

            deepFreeze(_arr);

            let _result = Util.lastIndexOfKeyValue(_arr, "type", "BBB");

            expect(_result).to.equal(2);
        });
    });
});
