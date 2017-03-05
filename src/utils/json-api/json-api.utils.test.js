import { expect } from 'chai';

import * as Utils from './json-api.utils';
import { ENDPOINT_TYPES } from './json-api.settings';

describe('JSON API Utils', () => {

    describe('getEndpointType', () => {

        it('given a "projects" endpoint, should return INDEX endpoint type', () => {

            let _result = Utils.getEndpointType('projects');

            expect(_result).to.equal(ENDPOINT_TYPES.INDEX);
        });

        it('given a "projects/123" endpoint, should return VIEW endpoint type', () => {

            let _result = Utils.getEndpointType('projects/123');

            expect(_result).to.equal(ENDPOINT_TYPES.VIEW);
        });

        it('given a "projects/123/tasks" endpoint, should return INDEX_RELATED endpoint type', () => {

            let _result = Utils.getEndpointType('projects/123/tasks');

            expect(_result).to.equal(ENDPOINT_TYPES.INDEX_RELATED);
        });
    });

    describe('splitEndpoint', () => {

        it('given a valid INDEX endpoint, should return an object containing only primary resource', () => {

            let _endpoint = 'projects';
            let _endpoint_type = ENDPOINT_TYPES.INDEX;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('related');
            expect(_result).not.to.have.ownProperty('primary_id');

            expect(_result.primary).to.equal('projects');
        });

        it('given a valid VIEW endpoint, should return an object containing primary resource & primary id', () => {

            let _endpoint = 'projects/123';
            let _endpoint_type = ENDPOINT_TYPES.VIEW;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result).not.to.have.ownProperty('related');

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
        });

        it('given a valid INDEX_RELATED endpoint, should return an object containing primary resource, primary id & related resource', () => {

            let _endpoint = 'projects/123/tasks';
            let _endpoint_type = ENDPOINT_TYPES.INDEX_RELATED;
            let _result = Utils.splitEndpoint(_endpoint, _endpoint_type);

            expect(_result.primary).to.equal('projects');
            expect(_result.primary_id).to.equal('123');
            expect(_result.related).to.equal('tasks');
        });
    });
});
