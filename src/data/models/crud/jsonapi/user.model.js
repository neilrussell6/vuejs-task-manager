import { JsonApiModel } from '../../jsonapi.model';

export class User extends JsonApiModel {

    get defaults () {
        return {
            server_id: null,
            uuid: null,
            email: null,
            first_name: null,
            last_name: null,
            is_authenticated: false,
            access_token: null
        };
    }

    get type () {
        return 'users';
    }
}
