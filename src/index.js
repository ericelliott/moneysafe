const BigNumber = require('bignumber.js');

const MoneySafe = Symbol('MoneySafe');

const createCurrency = ({ decimals }) => {
  const of = (input, value = new BigNumber(String(input))) => {
    const plus = b => of(value.plus(of(b)));
    const times = b => of(value.multipliedBy(of(b)));
    const div = b => of(value.dividedBy(of(b)));
    const toNumber = () => value.toNumber();
    const abs = () => of(value.abs());

    return Object.assign(plus, {
      [MoneySafe]: true,
      constructor: of,
      map: f => of(f(value)),
      valueOf: toNumber,
      plus,
      add: plus,
      times,
      multipliedBy: times,
      div,
      dividedBy: div,
      minus: b => of(value.minus(of(b))),
      lt: b => value.isLessThan(of(b)),
      gt: b => value.isGreaterThan(of(b)),
      lte: b => value.isLessThanOrEqualTo(of(b)),
      gte: b => value.isGreaterThanOrEqualTo(of(b)),
      toFixed: (digits = decimals) => value.toFixed(digits),

      /**
       * Convert a Money object to JavaScript Number format (IEEE 754 floating
       * point). *Note: JavaScript number precision is limited to 16 decimal
       * digits.*
       * @return {Number} [description]
       */
      toNumber: toNumber,
      abs,
      toString: () => value.toFixed(decimals)
    });
  };
  of.of = of;
  return of;
};

const ethereum = createCurrency({ decimals: 18 });
const $ = createCurrency({ decimals: 2 });

/**
 * Take any number of money objects and return the sum.
 * @param {...Money} ns
 * @returns { Money }
 */
const add = (...ns) => ns.reduce((a, b) => a.plus(b));

/**
 * Take any number of money objects and return the product.
 * @param {...Money} ns
 * @returns { Money }
 */
const multiply = (...ns) => ns.reduce((a, b) => a.times(b));

/**
 * Take a dividend and divisor and return the quotient.
 * @param {Money} dividend
 * @param {Money} divisor
 * @returns { Money }
 */
const divide = (dividend, divisor) => dividend.div(divisor);

/**
 * Take a base and a comparand and return whether the comparand is less than the base.
 * @param {Money} base
 * @param {Money} comparand
 * @returns { boolean }
 */
const lt = (base, comparand) => base.lt(comparand);

/**
 * Take a base and a comparand and return whether the comparand is greater than the base.
 * @param {Money} base
 * @param {Money} comparand
 * @returns { boolean }
 */
const gt = (base, comparand) => base.gt(comparand);

/**
 * Take a base and a comparand and return whether the comparand is less than or equal to the base.
 * @param {Money} base
 * @param {Money} comparand
 * @returns { boolean }
 */
const lte = (base, comparand) => base.lte(comparand);

/**
 * Take a base and a comparand and return whether the comparand is greater than or equal to the base.
 * @param {Money} base
 * @param {Money} comparand
 * @returns { boolean }
 */
const gte = (base, comparand) => base.gte(comparand);

module.exports = {
  createCurrency,
  $,
  ethereum,
  add,
  multiply,
  divide,
  lt,
  gt,
  lte,
  gte
};
