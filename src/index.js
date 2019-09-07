const BigNumber = require('bignumber.js');

const MoneySafe = Symbol('MoneySafe');

const createCurrency = ({ decimals }) => {
  const of = (input, value = new BigNumber(String(input))) => {
    const plus = b => of(value.plus(of(b)));
    const times = b => of(value.multipliedBy(of(b)));
    const div = b => of(value.dividedBy(of(b)));

    const roundTo = (precision = 0.5, x) => {
      var y = x.plus(precision / 2);
      return y.minus(y.div(precision));
    };

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
      toFixed: decimals => value.toPrecision(decimals),
      toString: () => value.toFixed(decimals),
      get cents() {
        return roundTo(2, value).toNumber;
      }
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
