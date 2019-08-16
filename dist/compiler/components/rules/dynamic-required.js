const Rule = require('./../rule');

module.exports = class RequiredRule extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let mainCriteria = this.tag.attrs().forcePull('[required]');
        return {
            rule: this.rule,
            priority: 1,
            condition: `${mainCriteria} && Is.empty(value)`,
            message: `trans('validation.required')`,
        };
    }
}