import { expect } from 'chai';

// local
import {
    local_id_SERVER_KEY,
    local_id_LOCAL_KEY
} from './crud.model';

// SUT
import { CRUDModel } from './crud.model';

describe("CRUD model", () => {

    describe("properties (instance)", () => {

        describe("server_id", () => {

            it("should set server_id using id on data arg", () => {

                class TestModel extends CRUDModel {}

                let id = 222;
                let _test_model = new TestModel({ id });

                let _result = _test_model.server_id;

                expect(_result).to.equal(id);
            });

            it("should prefer server_id to id on data arg when setting server_id", () => {

                class TestModel extends CRUDModel {}

                let server_id = 111;
                let id = 222;
                let _test_model = new TestModel({ id, server_id });

                let _result = _test_model.server_id;

                expect(_result).to.equal(server_id);
            });
        });
    });
});
