const parseEligibilityRule = (rule) => {
  const rawValue = String(rule.value).toLowerCase();

  if (rule.label === "maxIncome") {
    return { type: "maxIncome", value: Number(rawValue) };
  }

  if (rule.label === "minAge") {
    return { type: "minAge", value: Number(rawValue) };
  }

  if (rule.label === "maxAge") {
    return { type: "maxAge", value: Number(rawValue) };
  }

  if (rule.label === "occupation") {
    return { type: "occupation", value: rawValue };
  }

  if (rule.label === "state") {
    return { type: "state", value: rawValue };
  }

  return { type: "text", value: rawValue };
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getAgeScore = (payloadAge, minAgeRule, maxAgeRule) => {
  const age = Number(payloadAge);
  const minAge = minAgeRule ? Number(minAgeRule.value) : null;
  const maxAge = maxAgeRule ? Number(maxAgeRule.value) : null;

  if (minAge !== null && age < minAge) {
    return clamp(8 - (minAge - age) * 1.5, 0, 8);
  }
  if (maxAge !== null && age > maxAge) {
    return clamp(8 - (age - maxAge) * 1.5, 0, 8);
  }

  if (minAge !== null && maxAge !== null) {
    const middle = (minAge + maxAge) / 2;
    const halfRange = Math.max((maxAge - minAge) / 2, 1);
    const distance = Math.abs(age - middle);
    return 8 + Math.max(0, 10 * (1 - distance / halfRange));
  }

  if (minAge !== null) {
    return clamp(12 - Math.max(0, age - minAge) * 0.2, 7, 12);
  }

  if (maxAge !== null) {
    return clamp(12 - Math.max(0, maxAge - age) * 0.2, 7, 12);
  }

  return 5;
};

const getIncomeScore = (payloadIncome, maxIncomeRule) => {
  if (!maxIncomeRule) return 4;

  const income = Number(payloadIncome);
  const maxIncome = Number(maxIncomeRule.value);

  if (income > maxIncome) {
    const overshootRatio = (income - maxIncome) / Math.max(maxIncome, 1);
    return clamp(8 - overshootRatio * 24, 0, 8);
  }

  const ratio = maxIncome > 0 ? income / maxIncome : 0;
  return clamp(8 + ratio * 12, 8, 20);
};

const getOccupationScore = (payloadOccupation, occupationRule) => {
  if (!occupationRule) return 3;

  return payloadOccupation.toLowerCase().includes(occupationRule.value) ? 18 : 2;
};

const getStateScore = (payloadState, stateRule) => {
  if (!stateRule) return 2;

  if (!payloadState) return 1;

  return payloadState.toLowerCase() === stateRule.value ? 14 : 1;
};

const getSpecificityBonus = (parsedRules) => {
  const weightedRules = parsedRules.reduce((total, rule) => {
    if (rule.type === "state" || rule.type === "occupation") return total + 6;
    if (rule.type === "maxIncome" || rule.type === "minAge" || rule.type === "maxAge") return total + 4;
    return total + 1;
  }, 0);

  return clamp(weightedRules, 2, 14);
};

export const evaluateSchemeMatch = (scheme, payload) => {
  const parsedRules = scheme.eligibility.map(parseEligibilityRule);
  const minAgeRule = parsedRules.find((rule) => rule.type === "minAge");
  const maxAgeRule = parsedRules.find((rule) => rule.type === "maxAge");
  const maxIncomeRule = parsedRules.find((rule) => rule.type === "maxIncome");
  const occupationRule = parsedRules.find((rule) => rule.type === "occupation");
  const stateRule = parsedRules.find((rule) => rule.type === "state");

  const isMatch = parsedRules.every((parsed) => {
    if (parsed.type === "maxIncome") return Number(payload.income) <= parsed.value;
    if (parsed.type === "minAge") return Number(payload.age) >= parsed.value;
    if (parsed.type === "maxAge") return Number(payload.age) <= parsed.value;
    if (parsed.type === "occupation")
      return payload.occupation.toLowerCase().includes(parsed.value);
    if (parsed.type === "state") return payload.state.toLowerCase() === parsed.value;
    return true;
  });

  const score =
    (isMatch ? 28 : 12) +
    getSpecificityBonus(parsedRules) +
    getAgeScore(payload.age, minAgeRule, maxAgeRule) +
    getIncomeScore(payload.income, maxIncomeRule) +
    getOccupationScore(payload.occupation, occupationRule) +
    getStateScore(payload.state, stateRule);

  const matchHighlights = [
    occupationRule ? `Occupation fit: ${occupationRule.value}` : "General occupation eligibility",
    maxIncomeRule ? `Income eligible up to ${maxIncomeRule.value}` : "No income ceiling restriction",
    stateRule ? `State-specific fit: ${stateRule.value}` : "Open across states"
  ];

  return {
    isMatch,
    matchScore: Math.min(100, Math.round(score)),
    matchHighlights
  };
};

export const matchesScheme = (scheme, payload) => evaluateSchemeMatch(scheme, payload).isMatch;
