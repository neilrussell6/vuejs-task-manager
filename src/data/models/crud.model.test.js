import { expect } from 'chai';

// local
import {
    UNIQUE_ID_SERVER_KEY,
    UNIQUE_ID_LOCAL_KEY
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

        describe("unique_id", () => {

            it("should return a unique id key by combining server and local ids", () => {

                class TestModel extends CRUDModel {
                    static get name_plural() {
                        return 'AAA';
                    }
                }

                let server_id = 111;
                let local_id = 222;
                let _test_model = new TestModel({ server_id, local_id });

                let _result = _test_model.unique_id;

                expect(_result).to.equal(`${UNIQUE_ID_SERVER_KEY}${server_id}${UNIQUE_ID_LOCAL_KEY}${local_id}`);
            });
        });
    });
});
