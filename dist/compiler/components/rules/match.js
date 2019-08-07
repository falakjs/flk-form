const Rule = require('./../rule');
module.exports = class Match extends Rule {
    /**
     * {@inheritDoc}
     */
    options() {
        let matchingInput = this.tag.attrs().forcePull('match');

        let form = global.currentFormVariable;

        return {
            rule: this.rule,
            priority: this.defaultPriority,
            condition: `value !== ${form}.value('${matchingInput}')`,
            message: `trans('validation.match', trans('${matchingInput}'))`,
        };
    }
}