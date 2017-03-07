// local
import { ENDPOINT_TYPES } from './json-api.settings';

export function getEndpointType (endpoint) {

    const ENDPOINT_TYPE_REGEX = {
        [ ENDPOINT_TYPES.PRIMARY ]:         /^\w+$/,
        [ ENDPOINT_TYPES.PRIMARY_ID ]:      /^\w+\/\d+$/,
        [ ENDPOINT_TYPES.RELATED ]:         /^\w+\/\d+\/\w+$/,
        [ ENDPOINT_TYPES.RELATIONSHIPS ]:   /^\w+\/\d+\/relationships\/\w+$/
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

            _regex = /(^\w+$)/;
            // _regex_result = endpoint.match(ENDPOINT_TYPE_REGEX[ endpoint_type ]);
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1]
            };

        // primary with id (eg. projects/123);
        case ENDPOINT_TYPES.PRIMARY_ID:

            _regex = /(^\w+)\/(\d+)$/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2]
            };

        // related (eg. projects/123/tasks);
        case ENDPOINT_TYPES.RELATED:

            _regex = /(^\w+)\/(\d+)\/(\w+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2],
                related:    _regex_result[3]
            };

        // relationships (eg. projects/123/relationships/owner);
        case ENDPOINT_TYPES.RELATIONSHIPS:

            _regex = /(^\w+)\/(\d+)\/relationships\/(\w+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2],
                related:    _regex_result[3]
            };

        default:
            return null;
    }
}
