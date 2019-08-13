class FormHandler {
    /**
    * Constructor
    *
    * @param mixed form
    */
    constructor(form, component) {
        this.component = component;
        this.form = form;

        this.errorsList = {};
        this.isValid = false;
        if (! this.component.errors) {
            this.component.errors = {};
        }
    }

    /**
     * Get error for the given name
     * 
     * @param  string name
     * @returns string
     */
    getError(name) {
        // return Object.get(this.errorsList, name);
        return this.errorsList[name];
    }

    /**
     * Add new error
     * 
     * @param   string inputName
     * @param   string errorType
     * @param   string errorMessage
     * @returns false
     */
    addError(inputName, errorType, errorMessage) {
        if (!this.errorsList[inputName]) {
            this.errorsList[inputName] = {};
        }

        // this.errorsList[inputName][errorType] = errorMessage;
        this.errorsList[inputName] = errorMessage;

        this.setError(inputName, errorMessage);

        this.validateForm();

        return false;
    }
    
    /**
     * Set error to component
     * 
     * @param  string inputName
     * @param  string errorMessage
     */
    setError(inputName, errorMessage) {
        Object.set(this.component.errors, inputName, errorMessage);
    }

    /**
     * Detect whether the form is valid or not based on the current errors list
     */
    validateForm(detectChanges = true) {
        // this.component.disableAutoDetection();

        this.component.isValidForm = this.isValid = Is.empty(this.errorsList);

        if (detectChanges) {
            this.component.detectChanges();
        }

        return true;
    }

    /**
     * Set object of errors
     * 
     * @param  object errors {input: ErrorMessage}
     */
    setErrors(errors) {
        this.component.disableAutoDetection();
        for (let input in errors) {
            this.addError(input, 'custom', errors[input]);
        }

        this.component.detectChanges();
    }

    /**
     * Get the value of the given name
     * 
     * @param  string name
     * @param  mixed defaultValue
     * @returns mixed
     */
    value(name, defaultValue = '') {
        name = name.toInputName();
        let inputs = this.form.querySelectorAll(`[name="${name}"]`);

        if (inputs.length == 0) return defaultValue;

        if (inputs.length == 1) return inputs[0].value.trim() || defaultValue;

        let values = [];

        for (let input of inputs) {
            values.push(input.value);
        }

        return values;
    }

    /**
     * Remove the given error from the errors list
     * 
     * @param   string inputName
     * @param   string errorType
     * @returns true
     */
    removeError(inputName, errorType = null) {
        if (!this.errorsList[inputName]) {
            this.setError(inputName, null);

            return this.validateForm();
        }

        if (errorType) {
            delete this.errorsList[inputName][errorType];
            if (Is.empty(this.errorsList[inputName])) {
                delete this.errorsList[inputName];
            }
        } else {
            delete this.errorsList[inputName];
            this.setError(inputName, null);
        }

        this.validateForm();

        return true;
    }
}

const Form = {};