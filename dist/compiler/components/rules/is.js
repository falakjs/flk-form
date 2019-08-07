const Rule = require('./../rule');
module.exports = class Is extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let isMethod = this.tag.attrs().forcePull('is');
        return {
            rule: this.rule,
            priority: this.defaultPriority,
            condition: `value && ! Is.${isMethod}(value)`,
            message: `trans('validation.is.${isMethod}')`,
        };
    }
}