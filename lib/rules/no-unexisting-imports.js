'use strict';

let path = require('path');
let fs = require('fs');
let resolve = require('../resolve');
let match = require('../match');

function isGeneratedTypeScript(path) {
  let jsFileRE = /\.js$/;
  if (!jsFileRE.test(path)) {
    return false;
  }
  let tsPath = path.replace(jsFileRE, '.ts');
  let tsxPath = path.replace(jsFileRE, '.tsx');
  return fs.existsSync(tsPath) || fs.existsSync(tsxPath);
}

module.exports = {
  meta: {
  },

  create: function(context) {
    return {
      Program: function(node) {
        let define = match.define(node);

        if (!define) {
          return;
        }

        let modulePaths = define.modulePaths.filter(element => {
          return (
            element.type === 'Literal' &&
            (element.raw[0] === '\'' || element.raw[0] === '"')
          );
        });

        let basePath;

        let resolveContext = {
          currentDirectory: path.dirname(context.getFilename(node)),
          settings: context.settings['amd-imports'],

          getBasePath: function() {
            if (basePath === undefined) {
              basePath = resolve.getBasePath(context, node);
            }

            return basePath;
          }
        };

        modulePaths.forEach(modulePath => {
          let importPath = resolve.importPath(resolveContext, modulePath.value);

          if (importPath === '') {
            // Skip
            return;
          }

          let exists = false;

          if (fs.existsSync(importPath) || isGeneratedTypeScript(importPath)) {
            exists = true;
          }

          if (!exists) {
            let message;

            if (importPath) {
              message = 'file \'' + importPath + '\' not found';
            }
            else {
              message = 'file not found';
            }

            context.report({
              node: modulePath,
              message: message
            });
          }
        });
      }
    };
  }
};
