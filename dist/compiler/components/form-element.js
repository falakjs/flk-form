const Tag = require(TAG_CLASS_PATH);

module.exports = class FormElement {
    /**
     * @param Tag tag
     */
    constructor(tag, type, rulesList) {
        this.tag = tag;
        this.type = type;
        this.hasErrors = false;
        this.rulesList = rulesList;
    }

    /**
     * Determine if the current input has any type of errors
     */
    isErrorable() {
        return this.hasErrors === true;
    }

    /**
     * A flag set to declare the current input may have errors
     */
    mayHaveErrors() {
        this.hasErrors = true;
        
        let inputName = this.tag.attrs().get('name');
        this.errorProperty = `${this.tag.htmlCompiler.objectName}.errors.${inputName}`;
    }

    /**
     * {@inheritDoc}
     */
    render() {}
}