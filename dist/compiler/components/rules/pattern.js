const Rule = require('./../rule');
module.exports = class Pattern extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let pattern = this.tag.attrs().forcePull('pattern');
        return {
            rule: this.rule,
            priority: this.defaultPriority,
            condition: `value && ! value.match(${pattern})`,
            message: `trans('validation.pattern')`,
        };
    }
}