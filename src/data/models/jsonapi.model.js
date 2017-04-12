// local
import { CRUDModel } from './crud.model';

export class JsonApiModel extends CRUDModel {

    constructor (data) {
        super(data);
    }

    get attributes () {

        // filter excluded attributes from object's keys
        const _keys = Object.keys(this).filter(key => this.exclude_attributes.indexOf(key) < 0);
        return _keys.reduce((result, key) => Object.assign(result, {[key]: this[key]}), {});
    }

    get exclude_attributes () {
        return [ 'server_id', 'uuid', 'created_at', 'updated_at' ];
    }

    get properties () {
        return Object.keys(this).reduce((result, key) => Object.assign(result, {[key]: this[key]}), {});
    }

    get type () {
        return null;
    }
}

