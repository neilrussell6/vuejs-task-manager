import { expect } from 'chai';

import * as Utils from './local-storage.utils';

describe("local storage utils", () => {

    describe("getUniqueLocalId", () => {

        it("should return 1 if no data exists", () => {

            let _data = [];
            let _result = Utils.getUniqueLocalId(_data);

            expect(_result).to.equal(1);
        });

        it("should return 2 if single item exists with local_id 1", () => {

            let _data = [{ local_id: 1 }];
            let _result = Utils.getUniqueLocalId(_data);

            expect(_result).to.equal(2);
        });

        it("should return next highest id if data exists", () => {

            let _data = [
                { local_id: 3 },
                { local_id: 1 }
            ];
            let _result = Utils.getUniqueLocalId(_data);

            expect(_result).to.equal(4);
        });
    });
});
