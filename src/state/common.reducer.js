// // state
// import * as common_constants from 'state/common.constants';
//
// // utils
// import * as StorageUtils from 'utils/storage/storage.utils';
//
// export function item (state, action) {
//
//     switch (action.type) {
//
//         // ---------------------------
//         // common actions
//         // ---------------------------
//
//         case common_constants.ACTION_MAKE:
//             return new action.model(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID() }));
//
//         // ---------------------------
//         // storage actions
//         // ---------------------------
//
//     }
// }
//
// // ---------------------------
// // public
// // ---------------------------
//
// export function collection (state, action) {
//
//     let _index;
//     let _item;
//
//     switch (action.type) {
//
//         // ---------------------------
//         // common actions
//         // ---------------------------
//
//         case common_constants.ACTION_MAKE:
//             return [
//                 ...state,
//                 item({}, Object.assign({}, action, { index: state.length }))
//             ];
//
//         default:
//             return state;
//     }
// }
