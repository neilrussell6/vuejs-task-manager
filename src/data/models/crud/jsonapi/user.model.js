import { JsonApiModel } from '../../jsonapi.model';

export class User extends JsonApiModel {

    get defaults () {
        return {
            email: null,
            first_name: null,
            last_name: null
        };
    }

    get type () {
        return 'users';
    }
}