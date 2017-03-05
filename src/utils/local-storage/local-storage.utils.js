export function getUniqueLocalId (data) {
    return data.reduce((val, item) => {
        return item.local_id >= val ? item.local_id + 1 : val;
    }, 1);
}
