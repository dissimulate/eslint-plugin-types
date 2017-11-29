const rule = require('../../../lib/rules/array-type');

const RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {},
  }
});

const ruleTester = new RuleTester();

ruleTester.run('array-type', rule, {
  valid: [
    {
      code: "let a = [1, 2];"
    },
    {
      code: "let a = [[], []];"
    },
    {
      code: "let a = [{}, {}];"
    },
    {
      code: "let a = [() => {}, () => {}];"
    },
    {
      code: "let a = [1]; a[0] = 2;"
    },
    {
      code: "let a = [1]; a.push(2);"
    }
  ],

  invalid: [
    {
      code: "let a = [1, '2'];",
      errors: [{
        message: "Array items must be of type {number}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = [[], 2];",
      errors: [{
        message: "Array items must be of type {array}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = [{}, 2];",
      errors: [{
        message: "Array items must be of type {object}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = [() => {}, 2];",
      errors: [{
        message: "Array items must be of type {function}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = [1]; a[0] = '2';",
      errors: [{
        message: "Can't assign type {string} to {number}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = [1]; a.push('2');",
      errors: [{
        message: "Array items must be of type {number}.",
        type: "Literal"
      }]
    }
  ]
});
