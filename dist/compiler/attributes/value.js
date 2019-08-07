const Attribute = require(ATTRIBUTE_CLASS_PATH);

class ValueAttribute extends Attribute {
    /**
     * {@inheritDoc}
     */
    init() {
        // example 
        // <input type="text" name="username" [value]="this.username" />
        let variableName = this.pull(this.attribute); // i.e this.username
        this.tag.variableNameWillBeUsed();

        if (this.tag.tagName() == 'select') {
            return this.handleInputSelect(variableName);
        }

        this.returnedAttribute = 'value';
        this.returnedValue = this.tag.var(`fval(${variableName})`);

        let event = ['select', 'option'].includes(this.tag.tagName()) ? 'change' : 'input';

        // echo(variableName);

        if (event == 'input') {
            this.tag.onBuild(tag => {
                tag.appendLine(`${tag.variableName}.value = fval(${variableName})`);
            });
            this.tag.on(event, `${variableName} = this.value;`);
        }
    }

    /**
     * Handle input select
     */
    handleInputSelect(value) {
        for (let child of this.tag.originalElement.children) {
            let optionValue;
            if (child.hasAttribute('[value]')) {
                optionValue = child.getAttribute('[value]');
            } else {
                optionValue = child.getAttribute('value');
                if (!Is.numeric(optionValue)) {
                    optionValue = '`' + optionValue + '`';
                }
            }
            let selectValue = this.has('multiple') || this.has('[multiple]') ? `${value}.includes(${optionValue})` : `${value} == ${optionValue}`;
            child.setAttribute('[selected]', selectValue);
        }
        
        let valuePutter;

        if (this.has('multiple') || this.has('[multiple]')) {
            valuePutter = `
                let values = [];
                this.querySelectorAll('option').forEach(option => {
                    if (! option.selected) return;
                    values.push(option.value);
                });
                ${value} = values;
            `;
        } else {
            valuePutter = `${value} = this.value;`;
        }

        this.tag.on('change', valuePutter);
    }

    /**
     * {@inheritDoc}
     */
    // build() {
    //     this.tag.onBuild(tag => {
    //         // tag.appendLine(`${tag.variableName}.value = ${this.returnedValue}`);
    //     });
    // }
}

module.exports = {
    attr: '[value]',// it will be passed to the constructor
    handler: ValueAttribute,
};