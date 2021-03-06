'use strict';

let match = require('../match');

module.exports = {
  meta: {
    fixable: "code"
  },

  create: function(context) {
    return {
      'Program:exit': function(node) {
        let define = match.define(node);

        if (!define) {
          return;
        }

        let restricted = context.settings['amd-imports'].restricted || [];

        let modulePaths = define.modulePaths.filter(element => {
          return (
            element.type === 'Literal' &&
            (element.raw[0] === '\'' || element.raw[0] === '"')
          );
        });

        modulePaths.forEach(modulePath => {
          let importPath = modulePath.value;
          if (importPath === '') {
            // Skip
            return;
          }

          restricted.forEach(restrictedModule => {
            let replaceWith = restrictedModule.replaceWith;
            if (typeof restrictedModule === 'string') {
              if (restrictedModule === importPath) {
                context.report({
                  node: modulePath,
                  message: 'Restricted import \'' + importPath + '\''
                });
              }
            }
            else if (typeof restrictedModule === 'object') {
              if (restrictedModule.name && restrictedModule.name === importPath) {
                let report = {
                  node: modulePath,
                  message: restrictedModule.message ?
                  'Restricted import \'' + importPath + '\'' + ' - ' + restrictedModule.message
                  :
                  'Restricted import \'' + importPath + '\''
                };
                if (replaceWith) {
                  report.fix = fixer => fixer.replaceText(modulePath, '"' + replaceWith + '"');
                }
                context.report(report);
              }
            }

          });
        });
      }
    };
  }
};
