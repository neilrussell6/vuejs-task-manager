export class BasicModel {

    constructor (data = {}) {
        let _defaults = typeof this.defaults !== 'undefined' ? this.defaults : {};
        Object.assign(this, _defaults, data);
    }
}
