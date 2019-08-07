const Tag = require(TAG_CLASS_PATH);

class Form extends Tag {
    /**
     * {@inheritDoc}
     */
    init() {
        // As some input options may be passed to the form element
        // so we want to make sure to remove it after all inputs are rendered 
        this.htmlFormAttributes = {};
        let inputValidationEvent = Object.get(htmlAppConfig, 'form.validateOn', 'input');
        this.on('submit', `e.preventDefault();e.stopImmediatePropagation(); if (typeof ${this.htmlCompiler.objectName}.isValidForm != 'undefined' && ! ${this.htmlCompiler.objectName}.isValidForm) return false;`, true);
        // document.activeElement.blur();
        this.on('submit', `
        for (let input of this.querySelectorAll('input, textarea')) {
            input.dispatchEvent(new Event("${inputValidationEvent}"));
        }
        for (let input of this.querySelectorAll('select')) {
            input.dispatchEvent(new Event("change"));
        }
        `, true);

        this.variableNameWillBeUsed();

        let variableName = this.variableName;

        // let formHandler = `frm` + random(4);

        let formHandler = 'cfrmdlr'; // current form handler

        // this is used when the developer set a global error message class for the entire form
        // so s/he doesn't need to set it to each class individually
        this.errorMsgClass = this.attrs().forcePull('error-msg-class', null);

        global.currentForm = this;
        global.currentFormVariable = formHandler;

        this.onBuild(tag => {
            this.append(`
                if (! ${variableName}.formHandler) {
                    window.${formHandler} = ${variableName}.formHandler = new FormHandler(${variableName}, ${this.htmlCompiler.objectName});
                } else {
                    window.${formHandler} = ${variableName}.formHandler;
                }
            `);
        });

        this.onTerminate(tag => {
            delete global.currentForm;
            delete global.currentFormVariable;
        });
    }

    /**
     * Get option from the form
     */
    getOption(attribute, htmlConfigAttribute, defaultValue) {
        if (this.htmlFormAttributes[attribute]) return this.htmlFormAttributes[attribute];

        let value = this.attrs().forcePull(attribute);

        if (! value) {
            value = Object.get(htmlAppConfig, htmlConfigAttribute, defaultValue);
        }

        return this.htmlFormAttributes[attribute] = value;
    }
    
}

module.exports = {
    selector: 'form',
    handler: Form,
};