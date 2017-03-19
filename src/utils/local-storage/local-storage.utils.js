import uuidV1 from 'uuid/v1';

export function getUniqueLocalId () {
    return uuidV1();
}

export function index (key) {

    if (typeof(Storage) === 'undefined') {
        return null;
    }

    return localStorage.getItem(key);
}

export function view (key) {

    if (typeof(Storage) === 'undefined') {
        return null;
    }

    return localStorage.getItem(key);
}

export function store (key, value) {

    if (typeof(Storage) === 'undefined') {
        return null;
    }

    const _value = typeof value === 'object' ? JSON.stringify(value) : value;

    localStorage.setItem(key, _value);
}
