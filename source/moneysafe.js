const m$ = ({
  centsPerDollar = 100,
  decimals = 2,
  symbol = '$',
  round = Math.round
} = {}) => {
  function $ (dollars, {
    cents = round(dollars * centsPerDollar),
    in$ = round(cents) / centsPerDollar
  } = {}) {
    const add = a$ => $.of(cents + a$);
    const subtract = a$ => $.of(cents - a$);

    return Object.assign(add, {
      valueOf () {
        return cents;
      },
      get cents () {
        return round(cents);
      },
      get $ () {
        return in$;
      },
      round () {
        return $.of(round(cents));
      },
      add,
      subtract,
      constructor: $,
      toString () {
        return `${ symbol }${ this.$.toFixed(decimals) }`;
      },
      toJSON () {
        return this.toString();
      }
    });
  }

  $.of = cents => $(undefined, { cents });
  $.cents = cents => $.of(round(cents));
  $.parse = (str) => {
    try {
      const pattern = /^([^\d\s]{1,3})?(\d+(?:\.\d+)?)$/;
      const [ignore, symbol, amount] = str.match(pattern);
      return m$({symbol})(amount);
    } catch (err) {
      throw new Error(`Invalid money format: '${str}'`);
    }
  }

  return $;
};

const $ = m$();
const in$ = n => $.cents(n).$;

module.exports = {
  m$,
  $,
  in$
};
