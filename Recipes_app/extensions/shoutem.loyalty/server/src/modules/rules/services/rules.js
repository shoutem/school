import _ from 'lodash';

function parseNumericString(string) {
  return _.replace(string, ',', '.');
}

export function validateNumericRule(ruleValue) {
  const number = parseNumericString(ruleValue);

  if (_.isNumber(number)) {
    return true;
  }

  if (_.isEmpty(number)) {
    return false;
  }

  return !_.isNaN(_.toNumber(number));
}

export function transformNumericRule(ruleValue) {
  return _.toNumber(parseNumericString(ruleValue));
}

export function getRulesToCreate(rules) {
  return _.filter(rules, rule => !rule.id && rule.enabled);
}

export function getRulesToDelete(rules) {
  return _.filter(rules, rule => rule.id && !rule.enabled);
}

export function getRulesToUpdate(initialRules, newRules) {
  return _.filter(newRules, rule => {
    const { id, implementationData } = rule;
    const initialRule = _.find(initialRules, { id });

    return (
      initialRule && !_.isEqual(initialRule.implementationData, implementationData)
    );
  });
}
