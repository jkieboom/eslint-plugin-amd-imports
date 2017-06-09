'use strict';

let path = require('path');
let fs = require('fs');
let resolve = require('../resolve');
let match = require('../match');

let isWindows = (process.platform === 'win32');

module.exports = {
  meta: {
    fixable: 'code'
  },

  create: function(context) {
    return {
      Program: function(node) {
        let define = match.define(node);

        if (!define) {
          return;
        }

        let basePath = resolve.getBasePath(context, node);

        // Get our root
        let absImportPath = path.relative(basePath, path.dirname(context.getFilename(node)));
        let importRoot = pathRoot(absImportPath);

        define.modulePaths.forEach(modulePathNode => {
          let modulePath = modulePathNode.value;

          if (modulePath[0] === '.') {
            return;
          }

          // Check if root of import is same as our root, then error
          if (pathRoot(modulePath) === importRoot) {
            let relPath = path.relative(path.join(basePath, absImportPath), path.join(basePath, modulePath));

            if (relPath[0] !== '.') {
              relPath = './' + relPath;
            }

            if (isWindows) {
              relPath = relPath.replace(/\\/g, '/');
            }

            context.report({
              node: modulePathNode,
              message: 'Prefer relative (\'' + relPath + '\') over absolute import',

              fix: function(fixer) {
                return fixer.replaceText(modulePathNode, '"' + relPath + '"');
              }
            });
          }
        });
      }
    };
  }
};

function pathRoot(p) {
  let dirName = path.dirname(p);

  if (dirName === '.') {
    return p;
  }
  else {
    return pathRoot(dirName);
  }
}