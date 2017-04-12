import uuidV1 from 'uuid/v1';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import db from 'data/local.database';

// utils
import * as JsonApiUtils from 'utils/json-api/json-api.utils';

export const ENDPOINT_DESTROY = 'ENDPOINT_DESTROY';
export const ENDPOINT_INDEX = 'ENDPOINT_INDEX';
export const ENDPOINT_INDEX_RELATED = 'ENDPOINT_INDEX_RELATED';
export const ENDPOINT_STORE = 'ENDPOINT_STORE';
export const ENDPOINT_UPDATE = 'ENDPOINT_UPDATE';
export const ENDPOINT_VIEW = 'ENDPOINT_VIEW';
export const ENDPOINT_VIEW_RELATED = 'ENDPOINT_VIEW_RELATED';

export const DELETE = 'REQUEST_DELETE';
export const GET = 'REQUEST_GET';
export const PATCH = 'REQUEST_PATCH';
export const POST = 'REQUEST_POST';

const ERROR_MESSAGE_UNSUPPORTED_STORAGE = 'Storage is not supported by your browser';
const ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB = 'INDEXED_DB is not supported by your browser';
export const ERROR_MESSAGE_INVALID_MODEL = 'Provided resource is invalid';
const ERROR_MESSAGE_USER_DENIED_INDEXED_DB = 'User denied the usage of INDEXED_DB';

// ---------------------------------
// misc
// ---------------------------------

export function isStored (resource) {
    return new Promise((resolve, reject) => {

        view(resource.type, resource.uuid).then((response) => {
            resolve(typeof response !== 'undefined');
        }).catch(reject);
    });
}

export function isResourceValid (resource) {
    return resource !== null && resource.type !== null;
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

// ---------------------------------
// CRUD
// ---------------------------------

export function index (resource_type) {
    return db[ resource_type ].toArray();
}

export function indexRelated (related_type, related_key, related_value) {
    return db[ related_type ].where(related_key).equals(related_value).toArray();
}

export function store (resource) {
    return db[ resource.type ].add(resource);
}

export function updateOrStoreMany (collection = []) {
    return Promise.all(

        collection.map((resource) => {
            if (isStored(resource)) {
                return update(resource);
            }
            return store(resource);
        })
    );
}

export function update (resource, data = {}) {

    const _data = Object.assign({}, resource, data);
    return db[ resource.type ].put(_data);
}

export function view (resource_type, resource_uuid) {
    return db[ resource_type ].get(resource_uuid);
}

export function destroy (resource_type, resource_pk) {
    return db[ resource_type ].delete(resource_pk);
}

export function destroyAll (resource_type) {
    return db[ resource_type ].clear();
}

export function viewRelated (resource, relationship) {
    return view(resource, relationship, ENDPOINT_VIEW_RELATED);
}
