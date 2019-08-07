const Attribute = require(ATTRIBUTE_CLASS_PATH);

/**
 * Usage example
 * 
 */
class List extends Attribute{
    /**
     * {@inheritdoc}
     */
    map() {
        return {
            '[placeholder]': this.dynamicPlaceholder,
            'placeholder': this.staticPlaceholder,
        };
    }

    /**
     * {@inheritdoc}
     */
    staticPlaceholder(attribute) {
        let words = this.get(attribute);

        this.tag.attributes.placeholder = '${trans(\`' + words +'\`)}';
    }

    /**
     * {@inheritdoc}
     */
    dynamicPlaceholder(attribute) {
        let words = this.get(attribute);

        this.tag.attributes.placeholder = '${' + words +'}';
    }
}

module.exports = List;