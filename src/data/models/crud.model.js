// local
import { BasicModel } from './basic.model';

// class
export const UNIQUE_ID_SERVER_KEY = 's';
export const UNIQUE_ID_LOCAL_KEY = 'l';

export class CRUDModel extends BasicModel {

    constructor (data) {

        super(data);

        // set server_id using id if it's available and server_id is not
        // ... and remove this.id
        if (data.hasOwnProperty('id')) {

            delete this.id;

            if (!data.hasOwnProperty('server_id')) {
                this.server_id = data.id;
            }
        }
    }

    get unique_id () {
        return `${UNIQUE_ID_SERVER_KEY}${this.server_id}${UNIQUE_ID_LOCAL_KEY}${this.local_id}`;
    }
}

