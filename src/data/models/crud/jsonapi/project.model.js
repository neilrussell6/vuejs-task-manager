import { JsonApiModel } from '../../jsonapi.model';

export class Project extends JsonApiModel {

    get defaults () {
        return {
            name: ''
        };
    }

    get type () {
        return 'projects';
    }
}
