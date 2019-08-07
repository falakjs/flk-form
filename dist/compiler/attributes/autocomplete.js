const Attribute = require(ATTRIBUTE_CLASS_PATH);

/**
 * Disable autocomplete from the browser
 */
class AutocompleteAttribute extends Attribute {
    /**
     * {@inheritDoc}
     */
    init() {
        this.tag.declareVariable();// make sure the variable name is assigned to the element
        this.forcePull(this.attribute); // Remove it as it is not needed
    }

    /**
     * {@inheritDoc}
     */
    build() {
        this.tag.onBuild(tag => {
            tag.appendLine(`${tag.variableName}.autocomplete = ${tag.variableName}.name == 'password' && Is.browser('chrome') ? 'new-password' : 'off'`);
        });
    }
}

module.exports = {
    attr: 'autocomplete',// it will be passed to the constructor
    handler: AutocompleteAttribute,
};