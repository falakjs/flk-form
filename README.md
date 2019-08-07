# Forms

Most of web applications has may forms.

Falak JS handles `in out of the box way` web forms with a simple easy way to use.

## Creating new form

Let's create a simple form in our `hello-world.component.html` file.

`hello-world.component.html` 

```html
<form>
    <button>Login</button>
</form>
```

A simple normal form so far, now let's add some inputs

`hello-world.component.html` 

```html
<form>
    <input type="email" required class="form-control" placeholder="Email address" />
    <input type="password" required class="form-control" placeholder="Enter your password" /> 
    <button>Login</button>
</form>
```

So far so good a very normal form with some inputs and a `submission` button.


`hello-world.component.html` 

```html
<form (submit)="this.performLogin($el)">
    <form-input type="email" required class="form-control" placeholder="Email address"></form-input>
    <form-input type="password" required class="form-control" placeholder="Enter your password"></form-input>
    <button>Login</button>
</form>
```

All what we've done here is we changed the normal `input` tag to `form-input` component, which is part of this `flk-form`.

There are many differences between `form-input` and `input` tag as well like:

- All html5 validation attributes are same but with a different error message.
  - When there is an error like `required` an `error-msg` element is added after the input.
- You can call any input type from the `input` tag but also `select` and `textarea` as well.   
- If there is a `label` attribute is passed, the input will be in a `form-group` class with a label and input.   

Also we added `submit` event so when the user submits the form, we'll call `performLogin` method to send form data to some API.

## Name attribute
The `name` attribute is a very normal attribute except it has a simple advantage than the normal `name`.

Assume we have a name like this `name="description[ar]"` or `name="attributes[{{ index }}][name]"`

We can write it as follows:

`name="description[ar]"`

Change it to:

`name="description.ar"`

Also

`name="attributes[{{ index }}][name]"`

Change it to:
`name="attributes.{{ index }}.name"`

As we can see, we use the `dot.notation` syntax here to define the name.

## Value attribute
There are two types of `value` attribute:

`value="some-value"`

<form-input type="text" name="username" placeholder="Enter your username" value="hz"></form-input>

Using a dynamic value:

<form-input type="text" name="username" placeholder="Enter your username" value="{{ this.username }}"></form-input>
and

`[value]="this.attributeValue"`


```html
<form-input type="text" name="username" placeholder="Enter your username" [value]="this.username"></form-input>
```

The difference is the `value` attribute accept a static value.
> Also we can bind a value using the `{{ prop }}` syntax i.e `value="{{ this.attributeValue }}"`.

Regarding the `[value]` attribute, it follows the [two-way data binding](https://medium.com/front-end-weekly/what-is-2-way-data-binding-44dd8082e48e) concept.

So when the input value is changed, the value of the `this.attributeValue` is also changed as well and vice versa.

Unlike the `value` attribute, it follows the `one-way data binding` for setting input value only.

## Model attribute

The `[model]` attribute is the reverse of `value` attribute, as this attribute stores the value of the input into a `property` but not the opposite.

```html
<form-input type="text" placeholder="Enter your username" [model]="this.username"></form-input>
```

## Autofocus attribute
To auto focus on any input when the form is rendered in the dom, use the `autofocus` attribute with no values.

```html
<form-input type="email" name="email" autofocus></form-input>
```

## Autocomplete off
To disable the input autocompletion use the `autocomplete="off"` attribute to do so.


```html
<form-input type="password" name="password" autocomplete="off"></form-input>
```

## Label attribute
If the `form-input` component has a `label` attribute it will create a `form-group` element instead of just normal input that will has a `label` tag as well.

If you defined the `label` tag, the `placeholder` will have the same value of the `label` unless you explicitly declare the `placeholder` attribute.

> `label`, `placeholder`, `id`, `name` attributes could be `static` or `[dynamic]` attributes. 

`hello-world.component.html` 

```html
<form (submit)="this.performLogin($el)">
    <form-input type="email" label="Email address" required class="form-control" placeholder="Email address"></form-input>
    <form-input type="password" label="Password" required class="form-control" placeholder="Enter your password"></form-input>
    <button>Login</button>
</form>
```

## Select 
As mentioned earlier, we can use the `form-input` component can handle the `type="select"` so how does it work?

First let's take an example of usage for it:

`hello-world.component.js`

```js
class helloWorld {
    init() {
        this.statusOptions = [{
            text: 'Enabled',
            value: 'enabled',
        }, {
            text: 'Disabled',
            value: 'disabled',
        }];

        this.data = {
            status: 'disabled',
        };
    }
}
```

```html
<form-input type="select" id="status" name="status" label="Status" [options]="this.statusOptions" [value]="this.data.status"></form-input>
```

This will be rendered to the following html:

```html
<div class="form-group">
    <label for="status">Status</label>
    <select name="status" id="status">
        <option value="enabled">Enabled</option>
        <option value="disabled" selected>Disabled</option>
    </select>
</div>
```

So the `[options]` attribute accepts `array of objects`, each object should have `text` and `value` properties to be set for each `option`.

When passing the `[value]` attribute, it will start checking the options, the matched value of any option will be set as `selected`.

### Multiple values

If we've a multiple values in our select, `[multiple]` attribute with `true` or `false` value to decide if this select input will have a multiple values.

```html
<form-input type="select" name="permissions[]" [multiple]="true" label="User permissions" [options]="this.permissions" [value]="this.data.permissions"></form-input>
```

> In this case the `[value]` attribute should be an array of values.

## Default option

By default, a `please-select` option is positioned at the top of the select options, if you want to change the text, use the `default-option` attribute to modify it.

```html
<form-input type="select" default-option="Please select user permissions" name="permissions[]" [multiple]="true" label="User permissions" [options]="this.permissions" [value]="this.data.permissions"></form-input>
```

> You can change the `please-select` text from the [compiled configurations file](#compiler-options). 

> The default option is using the `trans` method to translate the text, so you may just place in your locale file `please-select` as a key and set the translation.

## Textarea
Instead of using `textarea` tag, we can use same `form-input` component with `type="textarea"` instead.

> All textarea attributes are available here as well.

# Validation rules

As mentioned earlier, the validation rules here are same as the `html5` validation to make it easier. 

Here is full list of validation rules.

 `email`: The `email` type is used to validate the input as a valid email address.
  - i.e `<form-input type="email"></form-input>
- `number`: The `number` type is used to validate the input as a valid number.
  - i.e `<form-input type="number"></form-input>
- `required`: The input must have a value `non-whitespace`.
  - i.e `<form-input type="text" required></form-input>
 - `required-if`: The input must have a value 
  - i.e `<form-input type="text" [required-if]="this.name == 'hasan'"></form-input>
- `length`: The input must have a value with the exact given length.
  - i.e `<form-input type="text" length="12"></form-input>
- `minlength`: The input must have a value with at least the given length.
  - i.e `<form-input type="text" minlength="12"></form-input>
- `maxlength`: The input must have a value with at most the given length.
  - i.e `<form-input type="text" maxlength="12"></form-input>
- `min`: The input must have a value at least the given `min` number value.
  - i.e `<form-input type="text" min="12"></form-input>
- `max`: The input must have a value less than the given `max` number value.
  - i.e `<form-input type="text" max="12"></form-input>
- `pattern`: The input value must match the given pattern.
  - i.e `<form-input type="text" pattern="^[a-zA-Z]+$"></form-input>
- `match`: The input value must match the value of the given input.
  - i.e `<form-input type="password" name="confirmPassword" match="password"></form-input>
- `is`: Validate the input value With any of the `Supportive-is` package.
  - i.e `<form-input type="text" is="mobileNumber.eg" placeholder="Enter a mobile number (Egypt number)" name="mobileNumber"></form-input>


# Validation rules messages

All of validation rules are stored under `validation` namespace in the `locales`.

Here is the default validation rules translations:

```js
Locale.extend('en', 'validation', {
    'minLength': 'Minimum length is %d',
    'min': 'Minimum value is %d',
    'max': 'Maximum value is %d',
    'number': 'Invalid number',
    'length': 'This field length must be %d',
    'maxLength': 'Maximum length is %d',
    'invalid-value': 'Invalid value',
    'email': 'Invalid email address',
    'required': 'This field is required',
    'match': 'This field is not matched with %s',
    'is': {
        'mobileNumber': {
            'eg': 'Invalid mobile number',
        },
    },
});
```

You can override any validation rule message in your `locales/en.js` for example like this

`locales/en.js`
```js
Locale.extend('en', 'validation', {
    'match': 'This field is did not matched with %s input.',
});

// OR
Locale.extend('en', {
    'validation': {
        'match': 'This field is did not matched with %s input.',
    },
};
```

# Compiler options

Any app in `src` directory has a `compiled-config.json` to set some compile time options for forms and other packages.      

> The `common` app has the following compiler options by default, you may override it in the app compiler file itself i.e `blog/compiled-config.json` or edit the common compiled file. 

Here is the full list of the `form` options

```json
{
    "validateOn": "input",
    "formGroup": {
        "tag": "div",
        "className": "form-group",
        "errorClass": "group-error",
        "label": {
            "position": "before",
            "className": null,
            "requiredElement": {
                "tag": "span",
                "text": "*",
                "title": "required",
                "className": "required"
            }
        }
    },
    "errorElement": {
        "tag": "div",
        "className": "alert alert-danger",
        "position": "after"
    },
    "select": {
        "defaultOption": "please-select"
    }
}
```

# More packages

We didn't talk about `image`, `file` and `datepcker` inputs, here are more form packages. 

- [Dropdown list](https://github.com/falakjs/flk-dropdown-list).
- [Datepciker](https://github.com/falakjs/flk-datepicker).
- [File input](https://github.com/falakjs/flk-file-input).
- [Image input](https://github.com/falakjs/flk-image-input).
- [Checkbox/Radio](https://github.com/falakjs/flk-checkbox).
- [Audio recorder](https://github.com/falakjs/flk-audio-recorder).