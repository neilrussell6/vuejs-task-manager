import { expect } from 'chai';

// data
import { JsonApiModel } from './jsonapi.model';

describe("json-api.model", () => {

    describe("properties (instance)", () => {

        describe("attributes", () => {

            it("should return all keys, excluding uuid by default", () => {

                class TestModel extends JsonApiModel {}

                const uuid = '1234';
                const _test_model = new TestModel({
                    uuid,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                const _result = _test_model.attributes;

                expect(_result).to.not.have.property('uuid');
                expect(_result).to.have.property('a', "A");
                expect(_result).to.have.property('b', "B");
                expect(_result).to.have.property('c', "C");
            });

            it("should return all keys, excluding only those defined", () => {

                class TestModel extends JsonApiModel {
                    get exclude_attributes() {
                        return ['a'];
                    }
                }

                const uuid = '1234';
                const _test_model = new TestModel({
                    uuid,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                const _result = _test_model.attributes;

                expect(_result).to.have.property('uuid', '1234');
                expect(_result).to.not.have.property('a');
                expect(_result).to.have.property('b', "B");
                expect(_result).to.have.property('c', "C");
            });
        });
    });
});
