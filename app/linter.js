const {TextLintEngine} = require('textlint')
const prh = require('textlint-rule-prh')
const engine = new TextLintEngine({})

module.exports = function(filepath) {
  return new Promise(function(resolve, reject) {
    const ruleConfig = {prh: {rulePaths: ['/path/to/cgmd-prevue/codegrid.yml']}}
    engine.config.rules = ['prh']
    engine.config.rulesConfig = ruleConfig
    engine.textlint.ruleCreatorSet.rawRulesObject = {prh}
    engine.textlint.ruleCreatorSet.rawRulesConfigObject = ruleConfig
    engine.textlint.ruleCreatorSet.rules = {prh}
    engine.textlint.ruleCreatorSet.ruleNames = ['prh']
    engine.textlint.ruleCreatorSet.rulesConfig = ruleConfig
    engine.ruleMap._store.prh = prh
    engine.executeOnFiles([filepath])
      .then((results) => {
        
//      results.forEach((result) => {
//        result.messages.forEach((message) => {
//          console.log(message)
//        })
//      })
      resolve({ results, filepath })
    })
  })



}
