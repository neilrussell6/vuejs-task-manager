// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// local
import * as project_constants from '../project.constants';

// ---------------------------
// private
// ---------------------------

function project (project, action) {

    switch (action.type) {

        case api_constants.API_READ:
            let _data = Object.assign({}, { id: project.id }, { local_id: project.local_id }, project.attributes);
            return new Project(_data);
    }
}

// ---------------------------
// public
// ---------------------------

export function projects (list = project_constants.DEFAULT_PROJECT_LIST_STATE, action) {

    switch (action.type) {

        case api_constants.API_READ:

            let _regex = new RegExp('projects$');

            if (!_regex.test(action.payload.endpoint)) {
                return list;
            }

            return action.payload.data.reduce((result, item, i) => {

                if (item.type !== 'projects') {
                    return result;
                }

                let local_id = i + 1;
                let _item = Object.assign({}, item, { local_id });

                result = [ ...result, project(_item, action) ];

                return result;
            }, []);

        default:
            return list;
    }
}
