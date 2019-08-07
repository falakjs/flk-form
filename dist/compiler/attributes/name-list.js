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
            '[name]': this.dynamicName,
            'name': this.staticName,
        };
    }

    /**
     * {@inheritdoc}
     */
    staticName(attribute) {
        let words = this.get(attribute);

        this.tag.attributes.name = '${(`' + words + '`).toInputName()}';
    }

    /**
     * {@inheritdoc}
     */
    dynamicName(attribute) {
        let words = this.get(attribute);

        this.tag.attributes.name = '${(' + words + ').toInputName()}';
    }
}

module.exports = List;