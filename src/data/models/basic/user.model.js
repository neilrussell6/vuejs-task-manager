import { BasicModel } from '../basic.model';

export const STATUS_FILTER_TYPE = {
    ALL:            'status-filter-type-all',
    INCOMPLETE:     'status-filter-type-incomplete',
    COMPLETE:       'status-filter-type-complete',
    TRASH:          'status-filter-type-trash'
};

export class User extends BasicModel {

    get defaults () {
        return {
            email: null,
            name: null
        };
    }
}
