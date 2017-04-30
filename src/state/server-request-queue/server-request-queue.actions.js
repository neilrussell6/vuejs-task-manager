import {
    deleteResource
} from 'redux-json-api';

// data
import { Request, REQUEST_KEY } from 'data/models/basic/request.model';

// state
import * as storage_actions from 'state/storage/storage.actions';
import { Task } from 'data/models/crud/jsonapi/task.model';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

export function dequeueRequest (request) {
    return function (dispatch) {

        console.log("dequeueRequest");

        // destroy in local storage
        return dispatch(storage_actions.destroyLocal(request));
    };
}

export function enqueueRequest (request) {
    return function (dispatch) {

        // // add type to first arg (the resource)
        // // so when we process we don't have to re-instantiate the resource
        // const _request = new Request(Object.assign({}, request, {
        //     args: [
        //         new Task(Object.assign({}, request.args[0], { type: request.args[0].type }),
        //         ...request.args.slice(1)
        //     ]
        // }));
        //
        // console.log(_request);
        console.log("~~~ enqueue ~~~");

        return dispatch(indexQueue()).then((response) => {
            console.log("queue BEFORE ENQUEUE ::: ", response);
            console.log("queue ENQUEUE ::: ", request);
            // store in local storage
            return dispatch(storage_actions.storeLocal(request)).then((response) => {

                return dispatch(indexQueue()).then((response) => {
                    console.log("queue AFTER ENQUEUE ::: ", response);
                });
            });
        });
    };
}

export function indexQueue () {
    return function (dispatch) {

        // index from local storage
        return StorageUtils.index('request-queue');
    };
}

export function processQueue () {
    return function (dispatch) {
        console.log("server-request.actions.processQueue");
        return Promise.resolve();

        // index queue from local storage
        return dispatch(indexQueue()).then((response) => {
            console.log("queue BEFORE ::: ", response);

            const _requests = response.map((item) => new Request(item));

            // process requests in queue
            return Promise.all([
                ..._requests.map((request) => {

                    // convert first arg to instance of resource model
                    // so when we process we don't have to re-instantiate the resource
                    const _args = [
                        new Task(request.args[0]),
                        ...request.args.slice(1)
                    ];

                    switch (request.key) {

                        case REQUEST_KEY.REQUEST_DESTROY:

                            const qry = {type: 'tasks', id: _args[0].server_id};
                            console.log(qry);
                            return dispatch(deleteResource(qry)).then((response) => {
                                console.log("XXXXXXXXXXXXXXXXXXXXXXXXXX");
                            }).catch(message => console.error(message));
                            //
                            // return dispatch(storage_actions.destroyServer(..._args))
                            //     .then((response) => dispatch(dequeueRequest(request)))
                            //     .catch(message => {
                            //         console.log("REQUEST_DESTROY ERROR", message);
                            //         Promise.resolve()
                            //     });

                        default:
                            return Promise.resolve();
                    }
                })
            ]).then((response) => {
                return dispatch(indexQueue()).then((response) => {

                    console.log("queue AFTER ::: ", response);

                    return Promise.resolve();
                });
            }).catch(message => Promise.resolve());
        });
    };
}
