const Rule = require('./../rule');
module.exports = class LengthRule extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let length = this.tag.attrs().forcePull('length');
        return {
            rule: this.rule,
            priority: this.defaultPriority,
            condition: `value && value.length != ${length}`,
            message: `trans('validation.length', ${length})`,
        };
    }
}