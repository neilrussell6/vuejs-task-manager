import { expect } from 'chai';

import * as Utils from './json-api.utils';
import { ENDPOINT_TYPES } from './json-api.constants';

describe("JSON API Utils", () => {

    describe("getEndpointType", () => {

        it("given a 'projects' endpoint, should return PRIMARY endpoint type", () => {

            let _result = Utils.getEndpointType('projects');

            expect(_result).to.equal(ENDPOINT_TYPES.PRIMARY);
        });

        it("given a 'projects/123' endpoint, should return PRIMARY_ID endpoint type", () => {

            let _result = Utils.getEndpointType('projects/123');

            expect(_result).to.equal(ENDPOINT_TYPES.PRIMARY_ID);
        });

        it("given a 'projects/123/tasks' endpoint, should return RELATED endpoint type", () => {

            let _result = Utils.getEndpointType('projects/123/tasks');

            expect(_result).to.equal(ENDPOINT_TYPES.RELATED);
        });

        it("given a 'projects/123/relationships/owner' endpoint, should return RELATIONSHIPS endpoint type", () => {

            let _result = Utils.getEndpointType('projects/123/relationships/owner');

            expect(_result).to.equal(ENDPOINT_TYPES.RELATIONSHIPS);
        });
    });

    describe("splitEndpoint", () => {

        it("given a valid PRIMARY endpoint, should return an object containing only primary resource", () => {

            let _endpoint = 'projects';
            let _endpoint_type = ENDPOINT_TYPES.PRIMARY;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('related');
            expect(_result).not.to.have.ownProperty('primary_id');

            expect(_result.primary).to.equal('projects');
        });

        it("given a valid PRIMARY_ID endpoint, should return an object containing primary resource & primary id", () => {

            let _endpoint = 'projects/123';
            let _endpoint_type = ENDPOINT_TYPES.PRIMARY_ID;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('related');

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
        });

        it("given a valid RELATED endpoint, should return an object containing primary resource, primary id & related resource", () => {

            let _endpoint = 'projects/123/tasks';
            let _endpoint_type = ENDPOINT_TYPES.RELATED;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
            expect(_result.related).to.equal('tasks');
        });

        it("given a valid RELATIONSHIPS endpoint, should return an object containing primary resource, primary id & related resource", () => {

            let _endpoint = 'projects/123/relationships/owner';
            let _endpoint_type = ENDPOINT_TYPES.RELATIONSHIPS;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
            expect(_result.related).to.equal('owner');
        });
    });
});
