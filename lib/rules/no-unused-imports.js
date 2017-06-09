'use strict';

let path = require('path');
let fs = require('fs');
let resolve = require('../resolve');
let match = require('../match');

module.exports = {
  meta: {
  },

  create: function(context) {
    return {
      'Program:exit': function(node) {
        let define = match.define(node);

        if (!define) {
          return;
        }

        let vars = context.getDeclaredVariables(define.func.arguments[1]);
        let varMap = {};

        vars.forEach(v => varMap[v.name] = v);

        define.moduleNames.forEach(importName => {
          if (importName.name[0] === '_' || importName.name[importName.name.length - 1] === '_') {
            return;
          }

          let v = varMap[importName.name];

          if (!v || v.references.length === 0) {
            context.report({
              node: importName,
              message: 'Unused import \'' + importName.name + '\''
            });
          }
        });
      }
    };
  }
};
