const Attribute = require(ATTRIBUTE_CLASS_PATH);

/**
 * Usage example
 * 
 */
class List extends Attribute {
    /**
     * {@inheritdoc}
     */
    map() {
        return {
            '[autofocus]': this.dynamicName,
            'autofocus': this.staticName,
        };
    }

    /**
     * {@inheritdoc}
     */
    staticName(attribute) {
        this.forcePull(attribute);

        this.tag.onElementReady(`
            if (! ${ this.tag.variableName}.focused) {
                ${this.tag.variableName}.focused = true;
                ${ this.tag.variableName}.focus();
            }
            `);
    }

    /**
     * {@inheritdoc}
     */
    dynamicName(attribute) {
        let focus = this.forcePull(attribute);

        this.tag.onElementReady(`
            if (${focus} && ! ${ this.tag.variableName}.focused) {
                ${this.tag.variableName}.focused = true;
                ${ this.tag.variableName}.focus();
            }
            `);
    }
}

module.exports = List;