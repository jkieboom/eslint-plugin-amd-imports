# eslint-plugin-amd-imports

ESLint plugin which verifies AMD style module imports.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-amd-imports`:

```
$ npm install eslint-plugin-amd-imports --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-amd-imports` globally.

## Usage

Add `amd-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "amd-imports"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "amd-imports/rule-name": 2
    }
}
```

## Supported Rules

| Rule                                  | Description |
|---------------------------------------|-------------|
| `amd-imports/no-restricted-imports`   | Restrict modules that can be imported. |
| `amd-imports/no-unexisting-imports`   | Verify that imported modules exist. See [Resolving Modules](#resolving-modules) for details. |
| `amd-imports/no-unused-imports`       | Verify that imported modules are used. If a module is imported because it has side effects, the imported module variable name may have the `_` prefix or suffix to skip this rule. |
| `amd-imports/prefer-relative-imports` | Prefer relative imports within a single package instead of top-level package absolute imports. |

## Plugin specific ESLint settings

```js
"settings": {
    "amd-imports": {
        // Path (relative to eslint config file) from which
        // absolute package imports are resolved
        "base": ".",

        // Map of package name to path (relative to base)
        // where to find the package sources
        "packages": {},

        // A list of modules assumed to be present globally.
        // This is in addition to the modules assumed always
        // to be global: require, define, module, exports
        "globals": [],

        // A list of modules restricted from use
        // Can be an array of strings for module names
        // or an object with the name and a custom message.
        "restricted": [
            "path/to/module",
            {
                "name": "path/to/module",
                "message": "Please use an alternative module"
            }
        ]
    }
}
```

## Resolving Modules

Modules are resolved in the following way:

1. If the module is a globally available module (`require`, `define`, `module`, `exports`) or a global specified in the settings, assume it exists.
1. If using a relative path (`../package/module`), then resolve relative to the current file.
1. If the import path starts with a package name configured in the settings, replace the package name with the mapped package path.
1. If using an absolute path (`package/module`), resolve it from the base path (relative to the eslint config file) specified in the settings.
