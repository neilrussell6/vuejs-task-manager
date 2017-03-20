import { JsonApiModel } from '../../jsonapi.model';

export class Project extends JsonApiModel {

    get defaults () {
        return {
            uuid: null,
            user_uuid: null,
            project_uuid: null,
            name: ''
        };
    }

    get exclude_attributes () {
        return ['uuid', 'user_uuid', 'created_at', 'updated_at'];
    }

    get type () {
        return 'projects';
    }
}
