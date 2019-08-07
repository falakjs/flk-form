const Rule = require('./../rule');
module.exports = class RequiredRule extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        this.tag.attrs().forcePull('required');
        return {
            rule: this.rule,
            priority: 1,
            condition: `Is.empty(value)`,
            message: `trans('validation.required')`,
        };
    }
}