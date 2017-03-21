import { JsonApiModel } from '../../jsonapi.model';

export class Project extends JsonApiModel {

    get defaults () {
        return {
            server_id: null,
            uuid: null,
            user_uuid: null,
            name: ''
        };
    }

    get exclude_attributes () {
        return ['server_id', 'uuid', 'user_uuid', 'created_at', 'updated_at'];
    }

    get type () {
        return 'projects';
    }
}
