const getType = (expression) => {
  if (!expression) return null;
  switch (expression.type) {
    case 'Literal': {
      if (expression.value === null) {
        return null
      }
      return typeof expression.value;
    }
    case 'ObjectExpression': return 'object';
    case 'ArrayExpression': return 'array';
    case 'FunctionExpression':
    case 'ArrowFunctionExpression': return 'function';
    default: return null;
  }
};

const getId = (item, full = true) => {
  if (item.type === 'VariableDeclarator') {
    return item.id.name;
  }

  const left = item.left || item.callee;

  if (left) {
    if (left.type === 'MemberExpression') {
      let name = '';
      let member = left;

      while (member.property && member.object) {
        name = `${(full || member !== left) ? (member.property.name || member.property.raw) : ''}${name && '.'}${name}`;
        member = member.object;
      }

      return `${member.name}${name && '.'}${name}`;
    }

    return left.name;
  }
};

const getScopeId = (block) =>
  `${block.type}-${block.start}`;

const findType = (TYPE_MAP, scope, id, type) => {
  if (!scope || !scope.block) {
    return null;
  }

  if (TYPE_MAP[getScopeId(scope.block)] && id in TYPE_MAP[getScopeId(scope.block)]) {
    return TYPE_MAP[getScopeId(scope.block)][id];
  }

  return type !== 'MemberExpression' && findType(TYPE_MAP, scope.upper, id, type);
};

module.exports = {
  getScopeId,
  findType,
  getType,
  getId,
};
