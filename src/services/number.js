import { lowerCase } from 'lodash';
import {
  format as formatCurr,
  unformat as unformatCurr,
} from 'number-currency-format';

export const roundTo = (number, precision, type = 'round') => {
  const power = 10 ** precision;

  if (type === 'round') return Math.round(number * power) / power;
  if (type === 'down') return Math.floor(number * power) / power;
  if (type === 'up') return Math.ceil(number * power) / power;

  return Math.round(number * power) / power;
};

export const unformat = (str) => {
  return Number(String(str).split(',').join(''));
};

export const formatNumber = (v, opts = {}) => {
  return formatCurr(v, {
    spacing: false,
    decimalsDigits: 0,
    showDecimals: 'NEVER',
    ...opts,
  });
};
export const formatCurrency = (v, opts = {}) => {
  return formatCurr(v, {
    currency: '원',
    currencyPosition: 'RIGHT',
    spacing: false,
    decimalsDigits: 0,
    showDecimals: 'NEVER',
    ...opts,
  });
};

export const roundCurrency = (v = 0, others = {}, roundType = 'up', precision = 2) => {
  const rounded = roundTo(v, precision, roundType);
  return unformat(formatCurr(rounded, {
    decimalsDigits: 0,
    ...others,
  }));
};

export const convertUnit = (amount, unit, quantity, reverse = false) => {
  // eslint-disable-next-line no-nested-ternary
  const lowerCaseUnit = lowerCase(unit);
  let multiplier = 1;
  switch (lowerCaseUnit) {
    case 'kg':
      multiplier = 1000;
      break;
    case 'g':
      multiplier = 1;
      break;
    case 'l':
      multiplier = 1;
      break;
    default:
      multiplier = 1;
      break;
  }
  const result = (unformat(amount) * multiplier) * unformat(quantity);
  const reverseResult = (unformat(quantity) / multiplier) / unformat(amount);

  return reverse ? reverseResult : result;
};
