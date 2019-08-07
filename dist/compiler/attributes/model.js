const Attribute = require(ATTRIBUTE_CLASS_PATH);

class ValueAttribute extends Attribute {
    /**
     * {@inheritDoc}
     */
    init() {
        // example 
        // when input value is changed, assign it to the given property
        // <input type="text" name="username" [model]="this.username" />
        let variableName = this.pull(this.attribute); // i.e this.username

        let event = ['select', 'option'].includes(this.tag.tagName()) ? 'change' : 'input';

        this.tag.on(event, `${variableName} = this.value;`);
    }

    /**
     * {@inheritDoc}
     */
    build() {}
}

module.exports = {
    attr: '[model]',// it will be passed to the constructor
    handler: ValueAttribute,
};