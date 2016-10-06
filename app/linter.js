const TextLintCore = require('textlint').TextLintCore
const prh = require('textlint-rule-prh')

module.exports = function linter(filepath, rulePaths) {
  const core = new TextLintCore()
  core.setupRules({prh}, {
    prh: {
      rulePaths: rulePaths
    }
  })

  return core.lintFile(filepath)
}
