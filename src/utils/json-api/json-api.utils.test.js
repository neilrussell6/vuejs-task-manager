import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import * as utils from './json-api.utils';
import { ENDPOINT_TYPES } from './json-api.constants';

describe("json-api.utils", () => {

    describe("getEndpointType", () => {

        it("given a 'projects' endpoint, should return PRIMARY endpoint type", () => {

            const _result = utils.getEndpointType('projects');

            expect(_result).to.equal(ENDPOINT_TYPES.PRIMARY);
        });

        it("given a 'projects/123' endpoint, should return PRIMARY_ID endpoint type", () => {

            const _result = utils.getEndpointType('projects/123');

            expect(_result).to.equal(ENDPOINT_TYPES.PRIMARY_ID);
        });

        it("given a 'projects/123/tasks' endpoint, should return RELATED endpoint type", () => {

            const _result = utils.getEndpointType('projects/123/tasks');

            expect(_result).to.equal(ENDPOINT_TYPES.RELATED);
        });

        it("given a 'access_tokens/owner' endpoint, should return RELATED_NO_ID endpoint type", () => {

            const _result = utils.getEndpointType('access_tokens/owner');

            expect(_result).to.equal(ENDPOINT_TYPES.RELATED_NO_ID);
        });

        it("given a 'projects/123/relationships/owner' endpoint, should return RELATIONSHIPS endpoint type", () => {

            const _result = utils.getEndpointType('projects/123/relationships/owner');

            expect(_result).to.equal(ENDPOINT_TYPES.RELATIONSHIPS);
        });

        it("given a 'access_tokens/relationships/owner' endpoint, should return RELATIONSHIPS_NO_ID endpoint type", () => {

            const _result = utils.getEndpointType('access_tokens/relationships/owner');

            expect(_result).to.equal(ENDPOINT_TYPES.RELATIONSHIPS_NO_ID);
        });
    });

    describe("splitEndpoint", () => {

        it("given a valid PRIMARY endpoint, should return an object containing only primary resource", () => {

            const _endpoint = 'projects';
            const _endpoint_type = ENDPOINT_TYPES.PRIMARY;
            const _result = utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('related');
            expect(_result).not.to.have.ownProperty('primary_id');

            expect(_result.primary).to.equal('projects');
        });

        it("given a valid PRIMARY_ID endpoint, should return an object containing primary resource & primary id", () => {

            const _endpoint = 'projects/123';
            const _endpoint_type = ENDPOINT_TYPES.PRIMARY_ID;
            const _result = utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('related');

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
        });

        it("given a valid RELATED endpoint, should return an object containing primary resource, primary id & related resource", () => {

            const _endpoint = 'projects/123/tasks';
            const _endpoint_type = ENDPOINT_TYPES.RELATED;
            const _result = utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
            expect(_result.related).to.equal('tasks');
        });

        it("given a valid RELATED_NO_ID endpoint, should return an object containing primary resource & related resource", () => {

            const _endpoint = 'access_tokens/owner';
            const _endpoint_type = ENDPOINT_TYPES.RELATED_NO_ID;
            const _result = utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('primary_id');

            expect(_result.primary).to.equal('access_tokens');
            expect(_result.related).to.equal('owner');
        });

        it("given a valid RELATIONSHIPS endpoint, should return an object containing primary resource, primary id & related resource", () => {

            const _endpoint = 'projects/123/relationships/owner';
            const _endpoint_type = ENDPOINT_TYPES.RELATIONSHIPS;
            const _result = utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
            expect(_result.related).to.equal('owner');
        });

        it("given a valid RELATIONSHIPS_NO_ID endpoint, should return an object containing primary resource & related resource", () => {

            const _endpoint = 'access_tokens/relationships/owner';
            const _endpoint_type = ENDPOINT_TYPES.RELATIONSHIPS_NO_ID;
            const _result = utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('primary_id');

            expect(_result.primary).to.equal('access_tokens');
            expect(_result.related).to.equal('owner');
        });
    });

    describe("makeResourceObject", () => {

        it("should return null, if no type", () => {

            const _resource = {
                uuid: '1234',
                a: "A"
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceObject(_resource);

            expect(_result).to.be.null;
        });

        it("should return null, if type is null", () => {

            const _resource = {
                uuid: '1234',
                type: null,
                attributes: {
                    a: "A"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceObject(_resource);

            expect(_result).to.be.null;
        });

        it("should return a valid resource object including type and attributes", () => {

            const _resource = {
                uuid: '1234',
                type: "TYPE1",
                attributes: {
                    a: "A",
                    b: "B",
                    c: "C"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceObject(_resource);

            expect(_result).to.not.have.property('uuid');
            expect(_result).to.have.property('type', 'TYPE1');
            expect(_result).to.have.property('attributes');
            expect(_result.attributes).to.have.property('a', "A");
            expect(_result.attributes).to.have.property('b', "B");
            expect(_result.attributes).to.have.property('c', "C");
        });

        it("should return a valid resource object including id if a server_id is provided", () => {

            const _resource = {
                uuid: '1234',
                server_id: '5678',
                type: "TYPE1",
                attributes: {
                    a: "A",
                    b: "B",
                    c: "C"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceObject(_resource);

            expect(_result).to.not.have.property('uuid');
            expect(_result).to.have.property('id', '5678');
            expect(_result).to.have.property('type', 'TYPE1');
            expect(_result).to.have.property('attributes');
            expect(_result.attributes).to.have.property('a', "A");
            expect(_result.attributes).to.have.property('b', "B");
            expect(_result.attributes).to.have.property('c', "C");
        });

        it("should return a valid resource object including relationships if provided", () => {

            const _resource = {
                type: "TYPE1",
                attributes: {
                    a: "A"
                }
            };

            const _relationships = {
                user: {
                    server_id: "1234",
                    type: 'TYPE2',
                    b: "B"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceObject(_resource, _relationships);

            expect(_result).to.have.property('relationships');
            expect(_result.relationships).to.have.property('user');
            expect(_result.relationships.user).to.have.property('data');
            expect(_result.relationships.user.data).to.have.property('type', 'TYPE2');
            expect(_result.relationships.user.data).to.have.property('id', '1234');
        });
    });

    describe("makeResourceIdentifierObject", () => {

        it("should return null, if no type", () => {

            const _resource = {
                uuid: '1234',
                a: "A"
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceIdentifierObject(_resource);

            expect(_result).to.be.null;
        });

        it("should return null, if type is null", () => {

            const _resource = {
                uuid: '1234',
                type: null,
                attributes: {
                    a: "A"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceIdentifierObject(_resource);

            expect(_result).to.be.null;
        });

        it("should return a valid resource object including type, but not attributes", () => {

            const _resource = {
                uuid: '1234',
                type: "TYPE1",
                attributes: {
                    a: "A",
                    b: "B",
                    c: "C"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceIdentifierObject(_resource);

            expect(_result).to.not.have.property('uuid');
            expect(_result).to.have.property('type', 'TYPE1');
            expect(_result).to.not.have.property('attributes');
        });

        it("should return a valid resource object including id if a server_id is provided", () => {

            const _resource = {
                uuid: '1234',
                server_id: '5678',
                type: "TYPE1",
                attributes: {
                    a: "A",
                    b: "B",
                    c: "C"
                }
            };

            deepFreeze(_resource);

            const _result = utils.makeResourceIdentifierObject(_resource);

            expect(_result).to.not.have.property('uuid');
            expect(_result).to.have.property('id', '5678');
            expect(_result).to.have.property('type', 'TYPE1');
        });
    });
});
