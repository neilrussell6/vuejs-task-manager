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
        return ['server_id', 'uuid', 'created_at', 'updated_at'];
    }

    get properties () {
        return Object.keys(this).reduce((result, key) => Object.assign(result, {[key]: this[key]}), {});
    }

    get resource_object () {

        if (this.type === null) {
            return null;
        }

        let result = {
            type: this.type,
            attributes: this.attributes
        };

        if (typeof this.server_id !== 'undefined' && this.server_id !== null) {
            Object.assign(result, { id: this.server_id });
        }

        return result;
    }

    get resource_identifier_object () {

        if (this.type === null) {
            return null;
        }

        let result = {
            type: this.type
        };

        if (typeof this.server_id !== 'undefined' && this.server_id !== null) {
            Object.assign(result, { id: this.server_id });
        }

        return result;
    }

    get type () {
        return null;
    }
}

