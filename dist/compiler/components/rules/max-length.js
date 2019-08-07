const Rule = require('./../rule');
module.exports = class MaxLengthRule extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let length = this.tag.attrs().forcePull('maxlength');
        return {
            rule: this.rule,
            priority: this.defaultPriority,
            condition: `value && value.length > ${length}`,
            message: `trans('validation.maxLength', ${length})`,
        };
    }
}