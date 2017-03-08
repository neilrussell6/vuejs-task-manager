import { expect } from 'chai';

// data
import { JsonApiModel } from './jsonapi.model';

describe('JsonApi model', () => {

    describe('properties (instance)', () => {

        describe('attributes', () => {

            it('should return all keys, excluding server_id and local_id by default', () => {

                class TestModel extends JsonApiModel {}

                let server_id = 111;
                let local_id = 222;
                let _test_model = new TestModel({
                    server_id,
                    local_id,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.attributes;

                expect(_result).to.not.have.property('server_id');
                expect(_result).to.not.have.property('local_id');
                expect(_result).to.have.property('a', "A");
                expect(_result).to.have.property('b', "B");
                expect(_result).to.have.property('c', "C");
            });

            it('should return all keys, excluding only those defined', () => {

                class TestModel extends JsonApiModel {
                    get exclude_attributes() {
                        return ['a'];
                    }
                }

                let server_id = 111;
                let local_id = 222;
                let _test_model = new TestModel({
                    server_id,
                    local_id,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.attributes;

                expect(_result).to.have.property('server_id', 111);
                expect(_result).to.have.property('local_id', 222);
                expect(_result).to.not.have.property('a');
                expect(_result).to.have.property('b', "B");
                expect(_result).to.have.property('c', "C");
            });
        });

        describe('resource_object', () => {

            it('should return null, if model does not define type', () => {

                class TestModel extends JsonApiModel {}

                let _test_model = new TestModel({
                    server_id: 111,
                    a: "A"
                });

                let _result = _test_model.resource_object;

                expect(_result).to.be.null;
            });

            it('should return a valid resource object including type, id and attributes', () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    server_id: 111,
                    local_id: 222,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_object;

                expect(_result).to.have.property('id', 111);
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.have.property('attributes');
                expect(_result.attributes).to.not.have.property('server_id');
                expect(_result.attributes).to.not.have.property('local_id');
                expect(_result.attributes).to.have.property('a', "A");
                expect(_result.attributes).to.have.property('b', "B");
                expect(_result.attributes).to.have.property('c', "C");
            });

            it('should return a valid resource object including type and attributes, but excluding id if server_id is null', () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    server_id: null,
                    local_id: 222,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_object;

                expect(_result).to.not.have.property('id');
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.have.property('attributes');
                expect(_result.attributes).to.not.have.property('server_id');
                expect(_result.attributes).to.not.have.property('local_id');
                expect(_result.attributes).to.have.property('a', "A");
                expect(_result.attributes).to.have.property('b', "B");
                expect(_result.attributes).to.have.property('c', "C");
            });
        });

        describe('resource_identifier_object', () => {

            it('should return null, if model does not define type', () => {

                class TestModel extends JsonApiModel {}

                let _test_model = new TestModel({
                    server_id: 111,
                    a: "A"
                });

                let _result = _test_model.resource_identifier_object;

                expect(_result).to.be.null;
            });

            it('should return a valid resource identifier object including type, id', () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    server_id: 111,
                    local_id: 222,
                    a: "A",
                    b: "B",
                    c: "C"
                });

                let _result = _test_model.resource_identifier_object;

                expect(_result).to.have.property('id', 111);
                expect(_result).to.have.property('type', 'tests');
                expect(_result).to.not.have.property('attributes');
            });

            it('should return a valid resource identifier object including type, but excluding id if server_id is null', () => {

                class TestModel extends JsonApiModel {
                    get type () {
                        return 'tests';
                    }
                }

                let _test_model = new TestModel({
                    server_id: null,
                    local_id: 222,
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
