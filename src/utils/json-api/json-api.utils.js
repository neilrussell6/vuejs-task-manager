// local
import { ENDPOINT_TYPES } from './json-api.settings';

export function getEndpointType (endpoint) {

    const ENDPOINT_TYPE_REGEX = {
        [ ENDPOINT_TYPES.INDEX ]:            /^\w+$/,
        [ ENDPOINT_TYPES.VIEW ]:             /^\w+\/\d+$/,
        [ ENDPOINT_TYPES.INDEX_RELATED ]:    /^\w+\/\d+\/\w+$/
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

        // index (eg. projects);
        case ENDPOINT_TYPES.INDEX:

            _regex = /(^\w+$)/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1]
            };

        // view (eg. projects/123);
        case ENDPOINT_TYPES.VIEW:

            _regex = /(^\w+)\/(\d+)$/;
            _regex_result = endpoint.match(_regex);
            return {
                primary:    _regex_result[1],
                primary_id: _regex_result[2]
            };

        // index related (eg. projects/123/tasks);
        case ENDPOINT_TYPES.INDEX_RELATED:

            _regex = /(^\w+)\/(\d+)\/(\w+$)/;
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
