const { getType, getId, getScopeId, findType } = require('./helpers');

const meta = {
  docs: {
    description: 'enforce consistent variable types',
    category: 'Best Practices',
    recommended: true
  },
  fixable: null,
  schema: []
};

const create = function (context) {
  const TYPE_MAP = {};

  return {
    AssignmentExpression(node) {
      const id = getId(node);
      const newType = getType(node.right);

      if (!id || !newType) return;

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

    VariableDeclaration(node) {
      const { block } = context.getScope();

      if (!TYPE_MAP[getScopeId(block)]) {
        TYPE_MAP[getScopeId(block)] = {};
      }

      node.declarations.forEach((declaration) => {
        const id = getId(declaration);
        TYPE_MAP[getScopeId(block)][id] = getType(declaration.init);
      });
    }
  };
};

module.exports = {
  meta,
  create,
};
