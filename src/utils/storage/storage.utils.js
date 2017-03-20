import uuidV1 from 'uuid/v1';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import db from 'data/local.database';

export const ENDPOINT_DESTROY = 'ENDPOINT_DESTROY';
export const ENDPOINT_INDEX = 'ENDPOINT_INDEX';
export const ENDPOINT_INDEX_RELATED = 'ENDPOINT_INDEX_RELATED';
export const ENDPOINT_STORE = 'ENDPOINT_STORE';
export const ENDPOINT_UPDATE = 'ENDPOINT_UPDATE';
export const ENDPOINT_VIEW = 'ENDPOINT_VIEW';
export const ENDPOINT_VIEW_RELATED = 'ENDPOINT_VIEW_RELATED';

export const LOCAL = 'STORAGE_LOCAL';

export const DELETE = 'REQUEST_DELETE';
export const GET = 'REQUEST_GET';
export const PATCH = 'REQUEST_PATCH';
export const POST = 'REQUEST_POST';

const ERROR_MESSAGE_UNSUPPORTED_STORAGE = 'Storage is not supported by your browser';
const ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB = 'INDEXED_DB is not supported by your browser';
const ERROR_MESSAGE_INVALID_MODEL = 'Provided resource is invalid';
const ERROR_MESSAGE_USER_DENIED_INDEXED_DB = 'User denied the usage of INDEXED_DB';

// ---------------------------------
// misc
// ---------------------------------

export function isStored (resource) {
    return new Promise((resolve, reject) => {

        validate(resource).then(() => {

            view(resource.type, resource.uuid).then((response) => {
                resolve(typeof response !== 'undefined');
            }).catch(reject);

        }).catch(reject);
    });
}

export function makeEndpoint (request_type, primary_resource, relationship = null) {
    switch (request_type) {

        case ENDPOINT_DESTROY:
        case ENDPOINT_UPDATE:
        case ENDPOINT_VIEW:
            return `${primary_resource.type}/${primary_resource.uuid}`;

        case ENDPOINT_INDEX_RELATED:
            return `${primary_resource.type}/${primary_resource.uuid}/${relationship}`;

        case ENDPOINT_INDEX:
        case ENDPOINT_STORE:
            return `${primary_resource.type}`;
    }
}

export function makeUUID () {
    return uuidV1();
}

export function validate (resource = null) {

    if (resource !== null && (!(resource instanceof JsonApiModel) || resource.resource_object === null)) {
        return Promise.reject(ERROR_MESSAGE_INVALID_MODEL);
    }

    if (!indexedDB) {
        return Promise.reject(ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB);
    }

    return Promise.resolve();
}

// ---------------------------------
// CRUD
// ---------------------------------

export function index (resource_type) {
    return new Promise((resolve, reject) => {

        validate().then(() => {

            db[ resource_type ].toArray().then((response) => {
                resolve(response);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}

export function indexRelated (related_type, related_key, related_value) {
    return new Promise((resolve, reject) => {

        validate().then(() => {

            db[ related_type ]
                .where(related_key).equals(related_value)
                .toArray()
                .then((response) => {
                    resolve(response);
                })
                .catch(reject);
        })
        .catch(reject);
    });
}

export function store (resource) {
    return new Promise((resolve, reject) => {

        validate(resource).then(() => {

            const _resource_object = resource.resource_object;
            const _data = resource;

            db[ _resource_object.type ].add(_data).then((response) => {
                resolve(response);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}

export function update (resource, data = {}) {
    return new Promise((resolve, reject) => {

        validate(resource).then(() => {

            const _resource_object = resource.resource_object;
            const _data = Object.assign({}, _resource_object.attributes, { uuid: resource.uuid }, data);

            db[ _resource_object.type ].put(_data).then((response) => {
                resolve(response);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}

export function view (resource_type, resource_uuid) {
    return new Promise((resolve, reject) => {

        validate().then(() => {

            db[ resource_type ].get(resource_uuid).then((response) => {
                resolve(response);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}

export function destroy (resource_type, resource_uuid) {
    return new Promise((resolve, reject) => {

        validate().then(() => {

            db[ resource_type ].delete(resource_uuid).then((response) => {
                resolve(response);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}

export function destroyAll (resource_type) {
    return new Promise((resolve, reject) => {

        validate().then(() => {
            db[ resource_type ].clear().then(resolve).catch(reject);
        })
        .catch(reject);
    });
}

export function viewRelated (resource, relationship) {
    return view(resource, relationship, ENDPOINT_VIEW_RELATED);
}
