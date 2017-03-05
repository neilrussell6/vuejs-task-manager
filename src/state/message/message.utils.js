// app
import { ENDPOINT_TYPES } from 'utils/json-api/json-api.settings';

export function makeMessageLabel (endpoint_data, endpoint_type, config, singularize) {

    let _primary_singular = singularize(endpoint_data.primary);

    switch (endpoint_type) {

        // index (eg. projects)
        case ENDPOINT_TYPES.INDEX:
            return `${endpoint_data.primary}`;

        // view (eg. projects/123)
        case ENDPOINT_TYPES.VIEW:

            if (config.should_replace_ids_with_template) {
                return `${_primary_singular} {${endpoint_data.primary} ${endpoint_data.primary_id}}`;
            }
            else if (config.should_hide_ids) {
                return `${_primary_singular}`;
            }
            else {
                return `${_primary_singular} ${endpoint_data.primary_id}`;
            }

        // index related (eg. projects/123/tasks)
        case ENDPOINT_TYPES.INDEX_RELATED:

            if (config.should_exclude_user && endpoint_data.primary === 'users') {
                return `${endpoint_data.related}`;
            }
            else if (config.should_replace_ids_with_template) {
                return `${endpoint_data.related} for ${_primary_singular} {${endpoint_data.primary} ${endpoint_data.primary_id}}`;
            }
            else if (config.should_hide_ids) {
                return `${endpoint_data.related} for ${_primary_singular}`;
            }
            else {
                return `${endpoint_data.related} for ${_primary_singular} ${endpoint_data.primary_id}`;
            }

        default:
            return null;
    }
}

export function populateMessageLabelVars (message_label, data, config) {

    let _matches = message_label.match(/(\{\w+\s\d+\})/g);

    if (_matches === null) {
        return message_label;
    }

    return _matches.reduce((result, key) => {

        // get resource data
        let _key_matches = key.match(/\{(\w+)\s(\d+)\}/);
        let _resource = _key_matches[1];
        let _resource_id = _key_matches[2];

        // no data
        if (!data.hasOwnProperty(_resource)) {
            return result;
        }

        let _id_property = config.hasOwnProperty(_resource) && config[ _resource ].hasOwnProperty('id') ? config[ _resource ].id : 'server_id';
        let _name_property = config.hasOwnProperty(_resource) && config[ _resource ].hasOwnProperty('name') ? config[ _resource ].id : 'name';

        let _replacement = data[ _resource ].reduce((result, item) => {

            if (item.hasOwnProperty(_id_property) && item[ _id_property ].toString() === _resource_id && item.hasOwnProperty(_name_property)) {
                result = item[ _name_property ];
            }

            return result;
        }, null);

        let _result;

        if (_replacement === null) {
            _result = result.replace(' ' + key, '');
        } else {
            _result = result.replace(key, '"' + _replacement + '"');
        }

        return _result;
    }, message_label);
}
