import { CRUDModel } from '../crud.model';

export class Project extends CRUDModel {

    get defaults () {
        return {
            name: ''
        };
    }
}
