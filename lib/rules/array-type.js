const { getType, getId, getScopeId, findType } = require('./helpers');

const meta = {
  docs: {
    description: 'enforce consistent array types',
    category: 'Best Practices',
    recommended: true
  },
  fixable: null,
  schema: []
};

const create = function (context) {
  const TYPE_MAP = {};

  return {
    CallExpression (node) {
      if (!node.callee.property ||
          !~['unshift', 'push'].indexOf(node.callee.property.name)) {
        return;
      }

      const id = getId(node, false);
      const scope = context.getScope();
      const declaredType = findType(TYPE_MAP, scope, id, node.type);

      node.arguments.forEach((argument) => {
        const newType = getType(argument);

        if (!declaredType) {
          const { block } = scope;

          if (!TYPE_MAP[getScopeId(block)]) {
            TYPE_MAP[getScopeId(block)] = {};
          }

          TYPE_MAP[getScopeId(block)][id] = newType;
        } else if (newType !== declaredType) {
          context.report({
            node: argument,
            message: `Array items must be of type {${declaredType}}.`
          });
        }
      });
    },

    AssignmentExpression (node) {
      const id = getId(node, false);
      const newType = getType(node.right);

      if (!id || !newType) return null;

      const scope = context.getScope();
      const declaredType = findType(TYPE_MAP, scope, id, node.left.type);

      if (!declaredType) {
        const { block } = scope;

        if (!TYPE_MAP[getScopeId(block)]) {
          TYPE_MAP[getScopeId(block)] = {};
        }

        TYPE_MAP[getScopeId(block)][id] = newType;

        return;
      }

      if (declaredType && declaredType !== newType) {
        context.report({
          node: node.right,
          message: `Can't assign type {${newType}} to {${declaredType}}.`,
        });
      }
    },

    ArrayExpression(node) {
      if (!~['AssignmentExpression', 'VariableDeclarator'].indexOf(node.parent.type)) {
        return;
      }

      const { block } = context.getScope();

      if (!TYPE_MAP[getScopeId(block)]) {
        TYPE_MAP[getScopeId(block)] = {};
      }

      const parent = node.parent.init || node.parent.right;
      const elements = parent.elements;
      const id = getId(node.parent);
      const newType = getType(elements[0]);

      if (!id || !newType) return;

      TYPE_MAP[getScopeId(block)][id] = newType;

      elements.forEach((element) => {
        if (getType(element) !== newType) {
          context.report({
            node: element,
            message: `Array items must be of type {${newType}}.`
          });
        }
      });
    }
  };
};

module.exports = {
  meta,
  create,
};
