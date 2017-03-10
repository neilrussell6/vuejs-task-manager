import RFC4122 from 'rfc4122';

export function getUniqueLocalId () {
    const rfc4122 = new RFC4122();
    return rfc4122.v1();
}
