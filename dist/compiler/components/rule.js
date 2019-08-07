module.exports = class Rule {
    constructor(rule, tag) {
        this.rule = rule;
        this.tag = tag;
        this.defaultPriority = 5;
    }    

    /**
     * Get the rule criteria options list
     */
    options() {
        return {
            priority: this.defaultPriority,
            message: '',
            condition: '',
            rule: '',
        };
    }
}