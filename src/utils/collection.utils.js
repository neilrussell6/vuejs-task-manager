export function indexOfKeyValue(arr, key, value) {
    let _values = arr.map(function(item) {
        return item[ key ];
    });
    return _values.indexOf(value);
}

export function lastIndexOfKeyValue(arr, key, value) {
    let _values = arr.map(function(item) { return item[ key ]; });
    return _values.lastIndexOf(value);
}
