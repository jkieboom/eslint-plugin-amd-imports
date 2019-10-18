'use strict';

let path = require('path');

let ConfigFile = require("eslint/lib/config/config-file");
let FileFinder = require("eslint/lib/util/file-finder");

let localConfigFinder = new FileFinder(ConfigFile.CONFIG_FILES);

let dojoTextRe = /^dojo\/text!(.*)/;
let isWindows = (process.platform === "win32");

function isAbsolute(p) {
  if (path.isAbsolute) {
    return path.isAbsolute(p);
  } else {
    if (isWindows) {
      // Taken more or less from nodejs sources
      return p.match(/^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)/);
    } else {
      return p[0] === '/';
    }
  }
}

function resolveRelativePath(context, importPath) {
  return path.normalize(path.join(context.currentDirectory, importPath));
}

exports.getBasePath = function getBasePath(context, node) {
  let configs = [...localConfigFinder.findAllInDirectoryAndParents(path.dirname(context.getFilename(node)))];
  let configBase = configs.filter(config => /\.eslintrc\.json$/.test(config))[0];

  if (!configBase) {
    return;
  }

  configBase = path.dirname(configBase);

  let amdImportsSettings = context.settings['amd-imports'];

  if (amdImportsSettings && amdImportsSettings.base) {
    return path.normalize(path.join(configBase, amdImportsSettings.base));
  }
  else {
    return configBase;
  }
};

exports.importPath = function importPath(context, importPath) {
  let m;

  if ((m = importPath.match(dojoTextRe))) {
    return exports.importPath(context, m[1]);
  }

  // Globally available imports from settings
  if (context.settings && context.settings.globals && context.settings.globals.indexOf(importPath) !== -1) {
    return '';
  }

  // Special AMD imports
  if (importPath === 'require' || importPath === 'define' || importPath === 'module' || importPath === 'exports') {
    return '';
  }

  if (importPath[0] === '.') {
    importPath = resolveRelativePath(context, importPath);
  }
  else {
    // Package mapping
    if (context.settings && context.settings.packages) {
      for (let pkg in context.settings.packages) {
        if (importPath.slice(0, pkg.length + 1) === pkg + '/') {
          let remainder = importPath.slice(pkg.length);
          let subst = context.settings.packages[pkg];

          importPath = path.join(subst, remainder);
          break;
        }
      }
    }
  }

  if (importPath.indexOf('!') !== -1) {
    // Skip, special import plugins
    return '';
  }

  if (!isAbsolute(importPath)) {
    let configBasePath = context.getBasePath();

    if (configBasePath) {
      importPath = path.join(configBasePath, importPath);
    }
    else {
      // Can't resolve config based relative imports if no base path is found
      return '';
    }
  }

  if (!/\.[a-z0-9_-]+$/i.test(importPath)) {
    importPath += '.js';
  }

  return path.normalize(importPath);
};
