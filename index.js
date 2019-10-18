'use strict';

module.exports = {
  rules: {
    'no-restricted-imports': require('./lib/rules/no-restricted-imports'),
    'no-unexisting-imports': require('./lib/rules/no-unexisting-imports'),
    'no-unused-imports': require('./lib/rules/no-unused-imports'),
    'prefer-relative-imports': require('./lib/rules/prefer-relative-imports')
  },
  rulesConfig: {
    'no-restricted-imports': 2,
    'no-unexisting-imports': 2,
    'no-unused-imports': 2,
    'prefer-relative-imports': 2
  }
};
