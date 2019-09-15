const BigNumber = require('bignumber.js');

const MoneySafe = Symbol('MoneySafe');

const createCurrency = ({ decimals }) => {
  const of = (input, value = new BigNumber(String(input))) => {
    const plus = b => of(value.plus(of(b)));
    const times = b => of(value.multipliedBy(of(b)));
    const div = b => of(value.dividedBy(of(b)));
    const toNumber = () => value.toNumber();

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
      equals: b => value.isEqualTo(of(b)),
      minus: b => of(value.minus(of(b))),
      toFixed: (digits = decimals) => value.toFixed(digits),

      /**
       * Convert a Money object to JavaScript Number format (IEEE 754 floating
       * point). *Note: JavaScript number precision is limited to 16 decimal
       * digits.*
       * @return {Number} [description]
       */
      toNumber: toNumber,
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
 * Takes two money objects and returns whether they are equals.
 * @param {Money} lhs
 * @param {Money} lhs
 * @returns { boolean }
 */
const equals = (lhs, rhs) => lhs.equals(rhs);

module.exports = {
  createCurrency,
  $,
  ethereum,
  add,
  multiply,
  divide,
  equals
};
