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
