import { BasicModel } from '../basic.model';

export const MESSAGE_STYLE = {
    DEFAULT:    'message-type-default',
    INFO:       'message-type-info',
    SUCCESS:    'message-type-success',
    WARNING:    'message-type-warning',
    DANGER:     'message-type-danger'
};

export const MESSAGE_LEVEL = {
    VERBOSE:    2,
    QUIET:      1,
    NONE:       0
};

export class Message extends BasicModel {

    get defaults () {
        return {
            label: null,
            expire: 0,
            style: MESSAGE_STYLE.DEFAULT,
            level: MESSAGE_LEVEL.VERBOSE
        };
    }
}
