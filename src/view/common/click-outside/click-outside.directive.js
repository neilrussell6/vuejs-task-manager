import Vue from 'vue';

let _el;
let _callback;

function bind () {
    Vue.util.on(document, 'click', clickHandler, true);
}

function clickHandler (e) {
    if (_el && _el.id.length && e.target.id.length) {
        if (_el.id !== e.target.id) {
            _callback();
        }
    } else if (_el && !_el.contains(e.target)) {
        _callback();
    }
}

function update (value) {
    _el = this.el;
    _callback = value;
    bind();
}

function unbind () {
    Vue.util.off(document, 'click', clickHandler, true);
}

export const clickOutside = {
    acceptStatement: true,
    priority: 700,
    bind: bind,
    update: update,
    unbind: unbind
};
