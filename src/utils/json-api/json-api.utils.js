// local
import { ENDPOINT_TYPES } from './json-api.constants';

export function getEndpointType (endpoint) {

    const ENDPOINT_TYPE_REGEX = {
        [ ENDPOINT_TYPES.PRIMARY ]:             /^[a-zA-Z\-\_]+$/,
        [ ENDPOINT_TYPES.PRIMARY_ID ]:          /^[a-zA-Z\-\_]+\/\d+$/,
        [ ENDPOINT_TYPES.RELATED ]:             /^[a-zA-Z\-\_]+\/\d+\/[a-zA-Z\-\_]+$/,
        [ ENDPOINT_TYPES.RELATED_NO_ID ]:       /^[a-zA-Z\-\_]+\/[a-zA-Z\-\_]+$/,
        [ ENDPOINT_TYPES.RELATIONSHIPS ]:       /^[a-zA-Z\-\_]+\/\d+\/relationships\/[a-zA-Z\-\_]+$/,
        [ ENDPOINT_TYPES.RELATIONSHIPS_NO_ID ]: /^[a-zA-Z\-\_]+\/relationships\/[a-zA-Z\-\_]+$/
    };

    return Object.keys(ENDPOINT_TYPE_REGEX).reduce((result, key) => {

        if (ENDPOINT_TYPE_REGEX[ key ].test(endpoint)) {
            result = key;
        }

        return result;
    }, null);
}

export function splitEndpoint (endpoint, endpoint_type) {

    let _regex;
    let _regex_result;

    switch (endpoint_type) {

        // primary (eg. projects);
        case ENDPOINT_TYPES.PRIMARY:

            _regex = /(^[a-zA-Z\-\_]+$)/;
            // _regex_result = endpoint.match(ENDPOINT_TYPE_REGEX[ endpoint_type ]);
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1]
            };

        // primary with id (eg. projects/123);
        case ENDPOINT_TYPES.PRIMARY_ID:

            _regex = /(^[a-zA-Z\-\_]+)\/(\d+)$/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2]
            };

        // related (eg. projects/123/tasks);
        case ENDPOINT_TYPES.RELATED:

            _regex = /(^[a-zA-Z\-\_]+)\/(\d+)\/([a-zA-Z\-\_]+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2],
                related:    _regex_result[3]
            };

        // related with no id (eg. access_tokens/owner);
        case ENDPOINT_TYPES.RELATED_NO_ID:

            _regex = /(^[a-zA-Z\-\_]+)\/([a-zA-Z\-\_]+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                related:    _regex_result[2]
            };

        // relationships (eg. projects/123/relationships/owner);
        case ENDPOINT_TYPES.RELATIONSHIPS:

            _regex = /(^[a-zA-Z\-\_]+)\/(\d+)\/relationships\/([a-zA-Z\-\_]+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2],
                related:    _regex_result[3]
            };

        // relationships with no id (eg. access_tokens/relationships/owner);
        case ENDPOINT_TYPES.RELATIONSHIPS_NO_ID:

            _regex = /(^[a-zA-Z\-\_]+)\/relationships\/([a-zA-Z\-\_]+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                related:    _regex_result[2]
            };

        default:
            return null;
    }
}
