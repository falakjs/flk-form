const Rule = require('./../rule');
module.exports = class MinLengthRule extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let length = this.tag.attrs().forcePull('minlength');
        return {
            rule: this.rule,
            priority: this.defaultPriority,
            condition: `value && value.length < ${length}`,
            message: `trans('validation.minLength', ${length})`,
        };
    }
}