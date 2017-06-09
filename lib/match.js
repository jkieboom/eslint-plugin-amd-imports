'use strict';

exports.define = function define(node) {
  let stmt = node.body.find(stmt => {
    return (
      stmt.type === 'ExpressionStatement' &&
      stmt.expression.type === 'CallExpression' &&
      stmt.expression.callee.type === 'Identifier' &&
      stmt.expression.callee.name === 'define' &&
      stmt.expression.arguments.length > 0 &&
      stmt.expression.arguments[0].type === 'ArrayExpression'
    );
  });

  if (!stmt) {
    return;
  }

  let args = stmt.expression.arguments;

  return {
    func: stmt.expression,
    modulePaths: args[0].elements,
    moduleNames: (args.length > 1 && args[1].params) || []
  };
};