// local
import { BasicModel } from './basic.model';

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
}

