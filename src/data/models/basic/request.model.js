import { BasicModel } from '../basic.model';

export const REQUEST_KEY = {
    REQUEST_STORE:    'store',
    REQUEST_UPDATE:   'update',
    REQUEST_DESTROY:  'destroy'
};

export class Request extends BasicModel {

    get defaults () {
        return {
            key: null,
            args: []
        };
    }

    get type () {
        return 'request-queue';
    }
}
