const FormElement = require('./../form-element');

class EmailInput extends FormElement {
    /**
     * {@inheritDoc}
     */
    render() {
        this.mayHaveErrors();

        let eventName = `evt${random(5)}`;

        this.rulesList.push({
            rule: 'email',
            priority: 2,
            message: "trans('invalid-email-address')",
            condition: 'this.value && ! Is.email(this.value)',  
        });

        return;

        this.tag.append(`
            let ${eventName} = function () { 
                if (this.value && ! Is.email(this.value)) {
                    ${this.errorProperty} = trans('invalid-email-address');
                    return false;
                }
                ${this.errorProperty} = null;
                return true;
            };
        `);
        this.tag.on('change', `
            return ${eventName}.apply(this);
        `);
    }
}

module.exports = EmailInput;