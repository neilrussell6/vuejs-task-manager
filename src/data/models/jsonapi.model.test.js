import { expect } from 'chai';

// data
import { JsonApiModel } from './jsonapi.model';

describe("JsonApi model", () => {

    describe("properties (instance)", () => {

        describe("attributes", () => {

            it("should return all keys, excluding uuid by default", () => {

                class TestModel extends JsonApiModel {}

                let uuid = '1234';
                let _test_model = new TestModel({
                    uuid,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.attributes;

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

                let uuid = '1234';
                let _test_model = new TestModel({
                    uuid,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.attributes;

                expect(_result).to.have.property('uuid', '1234');
                expect(_result).to.not.have.property('a');
                expect(_result).to.have.property('b', "B");
                expect(_result).to.have.property('c', "C");
            });
        });

        describe("resource_object", () => {

            it("should return null, if model does not define type", () => {

                class TestModel extends JsonApiModel {}

                let _test_model = new TestModel({
                    uuid: '1234',
                    a: "A"
                });

                let _result = _test_model.resource_object;

                expect(_result).to.be.null;
            });

            it("should return a valid resource object including type, id and attributes", () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    uuid: '1234',
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_object;

                expect(_result).to.have.property('id', '1234');
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.have.property('attributes');
                expect(_result.attributes).to.not.have.property('uuid');
                expect(_result.attributes).to.have.property('a', "A");
                expect(_result.attributes).to.have.property('b', "B");
                expect(_result.attributes).to.have.property('c', "C");
            });

            it("should return a valid resource object including type and attributes, but excluding id if uuid is null", () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    uuid: null,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_object;

                expect(_result).to.not.have.property('id');
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.have.property('attributes');
                expect(_result.attributes).to.not.have.property('uuid');
                expect(_result.attributes).to.have.property('a', "A");
                expect(_result.attributes).to.have.property('b', "B");
                expect(_result.attributes).to.have.property('c', "C");
            });
        });

        describe("resource_identifier_object", () => {

            it("should return null, if model does not define type", () => {

                class TestModel extends JsonApiModel {}

                let _test_model = new TestModel({
                    uuid: '1234',
                    a: "A"
                });

                let _result = _test_model.resource_identifier_object;

                expect(_result).to.be.null;
            });

            it("should return a valid resource identifier object including type, id", () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    uuid: '1234',
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_identifier_object;

                expect(_result).to.have.property('id', '1234');
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.not.have.property('attributes');
            });

            it("should return a valid resource identifier object including type, but excluding id if uuid is null", () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    uuid: null,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_identifier_object;

                expect(_result).to.not.have.property('id');
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.not.have.property('attributes');
            });
        });
    });
});
