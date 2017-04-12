import { JsonApiModel } from '../../jsonapi.model';

export class Project extends JsonApiModel {

    get defaults () {
        return {
            server_id: null,
            uuid: null,
            user_uuid: null,
            name: '',
            is_new: false
        };
    }

    get exclude_attributes () {
        return ['server_id', 'uuid', 'user_uuid', 'created_at', 'updated_at', 'is_new'];
    }

    get type () {
        return 'projects';
    }

    makeRelatedUuids (relationships) {

        let _result = {};

        if (relationships.hasOwnProperty('owner')) {
            _result['user_uuid'] = relationships['owner'].uuid;
        }

        return _result;
    }
}
