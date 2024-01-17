const baseRulesetConfiguration = {
    "extends": [
        "https://api.dev.swaggerhub.com/standardization/spectral/system-rules",
        "https://api.dev.swaggerhub.com/standardization/spectral/styleguide/owasp-top-10.js"
    ],
    "documentationUrl": "https://support.smartbear.com/swaggerhub/docs/en/manage-resource-access/api-standardization.html#UUID-5425b1a0-27d3-677c-54f2-f2acab09a7a6_section-idm4667026578035233960922912739",
}

const basicRules = {
    "owasp:api1:2019-no-numeric-ids": "error",
    "custom-rule": {
        "description": "description",
        "message": "message",
        "formats": [
            "oas2",
            "oas3_0",
            "oas3_1"
        ],
        "severity": "off",
        "given": "$.info.title",
        "then": {
            "function": "pattern",
            "functionOptions": {
                "match": "some-title"
            }
        }
    }
}

const disabledRule ={
    "disabled-custom-rule": {
        "description": "description",
        "message": "message",
        "formats": [
            "oas2",
            "oas3_0",
            "oas3_1"
        ],
        "severity": "off",
        "given": "$.info.title",
        "then": {
            "function": "pattern",
            "functionOptions": {
                "match": "some-title"
            }
        }
    }
}

const systemRule ={
    "swaggerhub-asyncapi-tags-at-least-one": "error"
}

const ruleset = {...baseRulesetConfiguration, rules: basicRules}
const rulesetWithSystemRule = {...baseRulesetConfiguration, rules: {...basicRules, ...systemRule}}
const rulesetWithDisabledRule = {...baseRulesetConfiguration, rules: {...basicRules, ...disabledRule}}
const rulesetWithDisabledAndSystemRule = {...baseRulesetConfiguration, rules: {...basicRules, ...disabledRule, ...systemRule}}

module.exports = {
    ruleset,
    rulesetWithSystemRule,
    rulesetWithDisabledRule,
    rulesetWithDisabledAndSystemRule
}




