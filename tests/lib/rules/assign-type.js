const rule = require('../../../lib/rules/assign-type');

const RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {},
  }
});

const ruleTester = new RuleTester();

ruleTester.run('assign-type', rule, {
  valid: [
    {
      code: "let a = 1; a = 2;"
    },
    {
      code: "let a = [1]; a = [2];"
    },
    {
      code: "let a = {}; a = {};"
    },
    {
      code: "let a = () => {}; a = () => {};"
    },
    {
      code: "let a = ['']; a[0] = '2';"
    },
    {
      code: "this.a = 1; function test () { this.a = '2'; }"
    },
    {
      code: "this.a = 1; this.b = '';"
    }
  ],

  invalid: [
    {
      code: "let a = 1; a = '2';",
      errors: [{
        message: "Can\'t assign type {string} to {number}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = [1]; a = 2;",
      errors: [{
        message: "Can\'t assign type {number} to {array}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = {}; a = 2;",
      errors: [{
        message: "Can\'t assign type {number} to {object}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = () => {}; a = 2;",
      errors: [{
        message: "Can\'t assign type {number} to {function}.",
        type: "Literal"
      }]
    },
    {
      code: "let a = 1; function test () { a = '2'; }",
      errors: [{
        message: "Can\'t assign type {string} to {number}.",
        type: "Literal"
      }]
    },
    {
      code: "this.a = 1; this.a = '2';",
      errors: [{
        message: "Can\'t assign type {string} to {number}.",
        type: "Literal"
      }]
    }
  ]
});
