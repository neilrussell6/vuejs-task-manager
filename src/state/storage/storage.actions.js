// // data
// import { JsonApiModel } from 'data/models/jsonapi.model';
//
// // utils
// import * as StorageUtils from 'utils/storage/storage.utils';
//
// // local
// import * as storage_constants from './storage.constants';
//
// export function storeOrUpdate (resource, relationships) {
//     return function (dispatch) {
//
//         if (StorageUtils.isStored(resource)) {
//             console.log("UPDATE");
//         }
//
//         // will store
//         dispatch({ type: storage_constants.ACTION_LOCAL_STORAGE_WILL_STORE });
//
//         StorageUtils.store(resource, relationships).then((uuid) => {
//             dispatch({
//                 type: storage_constants.ACTION_LOCAL_STORAGE_STORED,
//                 resource_type: resource.type,
//                 uuid
//             });
//         })
//         .catch((message) => {
//
//             // store failed
//             console.error(message);
//             dispatch({ type: storage_constants.ACTION_LOCAL_STORAGE_STORE_FAILED });
//         });
//     };
// }
//
// export function indexRelated (primary_resource, relationship) {
//     return function (dispatch) {
//
//         const endpoint = StorageUtils.makeEndpoint(StorageUtils.ENDPOINT_TYPE_INDEX_RELATED, primary_resource, relationship);
//         const _request_data = { primary_resource, relationship, endpoint };
//
//         // will view
//         dispatch({ type: storage_constants.ACTION_LOCAL_STORAGE_WILL_VIEW });
//
//         // request data
//         StorageUtils.indexRelated(primary_resource, relationship)
//             .then((response) => {
//
//                 // viewed
//                 dispatch(Object.assign({}, _request_data, {
//                     type: storage_constants.ACTION_LOCAL_STORAGE_VIEWED,
//                     response
//                 }));
//
//             })
//             .catch((message) => {
//
//                 // view failed
//                 console.error(message);
//                 dispatch({ type: storage_constants.ACTION_LOCAL_STORAGE_VIEW_FAILED });
//             });
//
//
//     }
// }