const Tag = require(TAG_CLASS_PATH);
const FormElement = require('./form-element');
const TextInput = require('./types/text');
const NumberInput = require('./types/number');
const EmailInput = require('./types/email');
const TextareaInput = require('./types/textarea');
const FileInput = require('./types/file');
const ImageInput = require('./types/image');
const CheckboxInput = require('./types/checkbox');
const RadioInput = require('./types/radio');
const SelectInput = require('./types/select');
const DatepickerInput = require('./types/datepicker');
const RequiredRule = require('./rules/required');
const DynamicRequiredRule = require('./rules/dynamic-required');
const LengthRule = require('./rules/length');
const MinLengthRule = require('./rules/min-length');
const MaxLengthRule = require('./rules/max-length');
const IsRule = require('./rules/is');
const PatternRule = require('./rules/pattern');
const MatchRule = require('./rules/match');

if (! global.currentFormVariable) {
    global.currentFormVariable = 'cfrmdlr';
}

class FormInput extends Tag {
    /**
     * Input types
     */
    types() {
        return {
            password: FormElement, // done
            text: TextInput, // done
            number: NumberInput, // done
            email: EmailInput,
            textarea: TextareaInput,
            file: FileInput,
            image: ImageInput,
            checkbox: CheckboxInput,
            radio: FormElement,
            select: SelectInput,
            datepicker: DatepickerInput,
        };
    }

    /**
     * Validation rules list
     */
    rules() {
        return {
            required: RequiredRule,
            '[required]': DynamicRequiredRule,
            length: LengthRule,
            minlength: MinLengthRule,
            maxlength: MaxLengthRule,
            pattern: PatternRule,
            match: MatchRule,
            is: IsRule,
        };
    }

    /**
     * {@inheritDoc}
     */
    init() {
        // disable the form input until we get rid of the control structures
        if (this.attrs().has('*if') || this.attrs().has('*for')) {
            return this.exit();
        }

        if (!this.attrs().has('type')) {
            echo(cli.redBright(`Type is required for form-input element in ` + this.htmlCompiler.viewName));
            return this.exit();
        }

        this.isFormGroup = false;

        this.setTagName();
        this.setInputNameAndId();
        this.prepareFormValidation();

        if (this.detectFormGroup()) {
            return this.exit();
        }

        // append the [options] to the options list
        if (this.type == 'select') {
            this.handleSelectInput();
        }

        this.handlePlugins();
    }

    /**
     * Handle plugins
     */
    handlePlugins() {
        if (this.isFormGroup) return;

        let plugin = this.getOption('using', `plugins.${this.type}`, null);

        // not ready yet!
        if (plugin) {
            const Plugin = require(`./plugins/${plugin}`);
            let pluginHandler = new Plugin(this);

            pluginHandler.render();
        }
    }

    /**
     * Prepare form validation info
     */
    prepareFormValidation() {
        let name;

        if (name = this.attrs().get('name')) {
            name = '`' + name + '`';
        } else {
            name = this.attrs().get('[name]');
        }

        this.errorProperty = `${global.currentFormVariable}.getError(${name})`;
    }

    /**
     * Handle select input
     */
    handleSelectInput() {
        let attributes = this.attrs();

        this.createDefaultOption();

        if (attributes.has('[options]')) {
            let options = attributes.forcePull('[options]');

            let optionAttributes = {
                '*for': `let option of ${options}`,
                '[value]': 'option.value',
                '[html]': 'option.text',
            };

            if (attributes.has('[value]')) {
                let value = attributes.get('[value]');
                let selectedValue = attributes.has('multiple') ? `${value}.includes(option.value)` : `${value} == option.value`;
                optionAttributes['[selected]'] = selectedValue;
            }

            let option = this.createElement('option', optionAttributes);

            this.originalElement.appendChild(option);
        }

        if (this.isFormGroup) return;

        this.attrs().forcePull('type');
    }

    /**
     * Create default option
     */
    createDefaultOption() {
        if (this.originalElement.parentNode && this.originalElement.parentNode.isFormGroupElement) return;

        // default select
        let defaultSelectOption = this.getOption('default-option', 'select.defaultOption', "${'please-select'}");

        if (defaultSelectOption) {
            let defaultOption = this.createElement('option', {
                value: '',
                disabled: true,
                selected: true,
            });

            defaultOption.innerHTML = "${trans('" + defaultSelectOption + "')}";

            this.originalElement.prepend(defaultOption);
        }
    }

    /**
     * {@inheritdoc}
     */
    build() {
        this.handleInput();

        super.build();
    }

    /**
     * If a label attribute is passed, then it will be injected into a form group container
     */
    detectFormGroup() {
        let attributes = this.attrs();

        if (attributes.has('label') || attributes.has('[label]')) {
            this.isFormGroup = true;
            let formGroupAttributes = this.getFormGroupAttributes();
            let formGroupTag = this.getOption('fg-tag', 'formGroup.tag', 'div');
            let formGroupElement = this.createElement(formGroupTag, formGroupAttributes);
            let currentElement = this.originalElement,
                parent = currentElement.parentNode;

            // replace the child node
            parent.insertBefore(formGroupElement, currentElement);

            parent.removeChild(currentElement);

            let label = this.getLabel();

            // the * that will be added inside the label
            // i.e <label>My text <span class="required">*</span></label>
            if (attributes.has('required') || attributes.has('[required]')) {
                let requiredElementTag = this.getOption('required-el-tag', 'formGroup.label.requiredElement.tag', 'span'),
                    requiredElementText = this.getOption('required-el-text', 'formGroup.label.requiredElement.text', '*'),
                    requiredElementTitle = this.getOption('required-el-title', 'formGroup.label.requiredElement.title', 'required'),
                    requiredElementClass = this.getOption('required-el-class', 'formGroup.label.requiredElement.className', 'required');

                if (requiredElementTag) {
                    let requiredElement;
                    if (attributes.has('required')) {
                        requiredElement = this.createElement(requiredElementTag, {
                            class: requiredElementClass,
                            title: requiredElementTitle,
                        }, [document.createTextNode(requiredElementText)]);
                    } else {
                        requiredElement = this.createElement(requiredElementTag, {
                            class: requiredElementClass,
                            title: requiredElementTitle,
                            '*if': attributes.get('[required]'),
                        }, [document.createTextNode(requiredElementText)]);
                    }
                    
                    label.appendChild(requiredElement);
                }
            }

            // this.resetAttributes('label', 'required-symbol', 'insert-label', '[label]');

            // insert-label="before|after"
            let labelPosition = this.getOption('label-position', 'formGroup.label.position', 'before');
            
            this.resetElementSpecialAttributes(currentElement);

            if (labelPosition === 'after') {
                formGroupElement.appendChild(currentElement);
                formGroupElement.appendChild(label);
            } else {
                formGroupElement.appendChild(label);
                formGroupElement.appendChild(currentElement);
            }

            // disable the build of the current tag as it will be built later
            this.build = () => { };

            formGroupElement.isFormGroupElement = true;

            this.htmlCompiler.extract(formGroupElement);
            return true;
        }

        return false;
    }

    /**
     * Reset element if it will be re-rendered again and add events and dynamic attributes again
     */
    resetElementSpecialAttributes(currentElement) {
        for (let attribute in this.originalAttributes) {
            if (['label', '[label]'].includes(attribute)) continue;

            currentElement.setAttribute(attribute, this.originalAttributes[attribute]);
        }
    }

    /**
     * Get form group attributes
     */
    getFormGroupAttributes() {
        let className = this.getOption('fg-class', 'formGroup.className', 'form-group'),
            errorClass = this.getOption('fg-error-class', 'formGroup.errorClass', 'group-error');

        return {
            class: className,
            '[class]': `{'${errorClass}': !!${this.errorProperty} }`,
        };
    }

    /**
     * Detect if the label attribute is passed
     */
    getLabel() {
        let label,
            attributeName = 'label',
            attributes = this.attrs();

        let attributesList = {
            for: attributes.get('id'),
        };

        // label="my-label" will be treated as trans('my-label')
        if (attributes.has('label')) {
            label = attributes.forcePull('label');
            attributeName = 'trans';
        } else if (attributes.has('[label]')) {
            label = attributes.forcePull('[label]');
            attributeName = '[trans]';
        }

        // set placeholder to be the label value if there is no placeholder if not exists
        if (!['radio', 'checkbox'].includes(attributes.get('type')) && !attributes.hasAny('placeholder', '[placeholder]')) {
            let placeholderType = attributeName == 'trans' ? 'placeholder' : '[placeholder]';
            this.originalElement.setAttribute(placeholderType, label);
        }

        let labelClass = this.getOption('label-class', 'formGroup.label.className', null);

        if (labelClass) {
            attributesList.class = labelClass;
        }

        attributesList[attributeName] = label;

        return this.createElement('label', attributesList);
    }

    /**
     * If the name is set and not the id, then set the id as the name and vice versa
     */
    setInputNameAndId() {
        let id = this.attrs().get('id'),
            name = this.attrs().get('name');

        if (id && !name) {
            name = id.toCamelCase();
            this.attrs().set('name', name);
        } else if (name && !id) {
            id = name.replace(/\./g, '-');
            this.attrs().set('id', id);
        }
    }

    /**
     * Set tha tag name that will be returned
     */
    setTagName() {
        if (this._tagName) return;

        this.type = this.attrs().get('type', 'text');

        let inputTypes = ['text', 'email', 'number', 'password', 'checkbox', 'radio', 'date', 'color'];

        this._tagName = inputTypes.includes(this.type) ? 'input' : this.type;
    }

    /**
     * {@inheritdoc}
     */
    tagName() {
        if (this._tagName) return this._tagName;

        this.setTagName();

        return this.tagName();
    }

    /**
     * {@inheritDoc}
     */
    handleInput() {
        this.handleRules();

        if (this.types()[this.type]) {
            let input = this.newInput(this.type);

            input.render();
        }

        this.prepareRules();
    }

    /**
     * If there is any rules in this input, then it should be prepared
     */
    prepareRules() {
        if (Is.empty(this.rulesList)) return;

        // first order rules by priority
        this.rulesList = this.rulesList.sort((rule1, rule2) => rule1.priority - rule2.priority);
        // this.htmlCompiler.observe('errors');

        let event = `let value = this.value.trim();`;

        let formHandler = global.currentFormVariable;

        let name;

        if (name = this.attrs().get('name')) {
            name = '`' + name + '`';
        } else {
            name = this.attrs().get('[name]');
        }

        for (let i = 0; i < this.rulesList.length; i++) {
            let conditionType = i == 0 ? 'if' : 'else if';
            let rule = this.rulesList[i];

            event += `${conditionType} (${rule.condition}) {return ${formHandler}.addError(${name}, '${rule.rule}', ${rule.message});}`;
        }

        event += `return ${formHandler}.removeError(${name});`;

        let validationEvent = this.getOption('validate-on', 'validateOn', 'input');

        if (this.type == 'select') {
            validationEvent = 'change';
        }

        this.on(validationEvent, event);

        this.collectErrorElementAttributes();

        this.onTerminate(tag => {
            this.createErrorElement();
        });
    }

    /**
     * Create an element that handles the error
     */
    createErrorElement() {
        let errorElementTag = this.getOption('err-el-tag', 'errorElement.tag', 'div'),
            errorElementPosition = this.getOption('err-el-position', 'errorElement.position', 'after'),
            errorElementClass = this.getOption('err-el-class', 'errorElement.className', 'error-msg');

        let errorProperty = this.errorProperty;

        let name;

        if (name = this.attrs().get('name')) {
            name = '`' + name + '`';
        } else {
            name = this.attrs().get('[name]');
        }

        let htmlContent = `${global.currentFormVariable}.getError(${name})`;

        let attributes = {
            'class': errorElementClass,
            '*if': errorProperty,
            '[html]': htmlContent,
        };

        let errorElement = this.createElement(errorElementTag, attributes);

        if (errorElementPosition == 'before') {
            this.originalElement.parentNode.insertBefore(errorElement, this.originalElement);
        } else {
            this.originalElement.parentNode.insertBefore(errorElement, this.originalElement.nextSibling);
        }
    }


    /**
     * Get attribute value either from the input or from the html config file
     * 
     * @param   string attribute
     * @param   string htmlConfigAttribute
     * @param   string defaultValue
     */
    getOption(attribute, htmlConfigAttribute = attribute, defaultValue = null) {
        defaultValue = global.currentForm ? global.currentForm.getOption(attribute, htmlConfigAttribute, defaultValue) : defaultValue;
        let value = this.attrs().forcePull(attribute, defaultValue);

        if (value === 'false') return false;

        return value;
    }

    /**
     * Collect error element attributes list
     */
    collectErrorElementAttributes() {
        this.errorElementAttributes = {};
        this.errorElementAttributes.class = this.attrs().forcePull('error-msg-class');
    }

    /**
     * Handle input rules
     */
    handleRules() {
        this.rulesList = [];

        let rules = this.rules();

        for (let rule in rules) {
            if (!this.attrs().has(rule)) continue;

            let ruleHandler = new rules[rule](rule, this);

            let ruleOptions = ruleHandler.options();

            // static error messages
            // i.e errors-required="This field is required"
            if (this.attrs().has('errors-' + rule)) {
                ruleOptions.message = `'${this.attrs().forcePull('errors-' + rule)}'`;
            } else if (this.attrs().has(`[errors-${rule}]`)) {
                // dynamic error messages
                // i.e [errors-required]="this.requiredMessage"
                ruleOptions.message = this.attrs().forcePull(`[errors-${rule}]`);
            }

            this.rulesList.push(ruleOptions);
        }
    }

    /**
     * Get an object that handles the given input type
     * 
     * @param  string type
     * @return Input
     */
    newInput(inputType) {
        let inputClass = this.types()[inputType];

        return new inputClass(this, inputType, this.rulesList);
    }
}

module.exports = {
    selector: 'form-input',
    handler: FormInput,
}; 