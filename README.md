# eslint-plugin-types

A type checking plugin for eslint.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-types`:

```
$ npm install eslint-plugin-types --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-types` globally.

## Usage

Add `types` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "types"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "types/assign-type": 2,
        "types/array-type": 2
    }
}
```

## Supported Rules

### assign-type
Variables must not change type once declared.

Correct:
```javascript
let a = 'one';
a = 'two';

function example1 () {
    let a = 1;
    a = 2;
}

function example2 () {
    a = 'three';
}
```

Incorrect:
```javascript
let a = '1';
a = 2; // error
```

### array-type
Arrays items must be a consistent type.

Correct:
```javascript
let a = [1, 2];
a.push(3);
a[2] = 4;
```

Incorrect:
```javascript
let a = [1, 2, '3']; // error
a.push('4'); // error
a[3] = '5'; // error

let b = [];
b.push(1);
b.push('2'); // error
```





