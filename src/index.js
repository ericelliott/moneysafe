const BigNumber = require('bignumber.js');

const MoneySafe = Symbol('MoneySafe');

const createCurrency = ({ decimals }) => {
  const of = (input, value = new BigNumber(String(input))) => {
    const plus = b => of(value.plus(of(b)));
    const times = b => of(value.multipliedBy(of(b)));
    const div = b => of(value.dividedBy(of(b)));

    return Object.assign(plus, {
      [MoneySafe]: true,
      constructor: of,
      map: f => of(f(value)),
      valueOf: () => value.toNumber(),
      plus,
      add: plus,
      times,
      multipliedBy: times,
      div,
      dividedBy: div,
      minus: b => of(value.minus(of(b))),
      toFixed: (digits = decimals) => value.toFixed(digits),
      toNumber: () => value.toNumber,
      toString: () => value.toFixed(decimals)
    });
  };
  of.of = of;
  return of;
};

const ethereum = createCurrency({ decimals: 18 });
const add = (...ns) => ns.reduce((a, b) => a.plus(b));
const multiply = (...ns) => ns.reduce((a, b) => a.times(b));
const divide = (a, b) => a.div(b);

module.exports = {
  ethereum,
  add,
  multiply,
  divide
};
