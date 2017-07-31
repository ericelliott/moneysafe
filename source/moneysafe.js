const m$ = ({
  centsPerDollar = 100,
  decimals = 2,
  symbol = '$'
} = {}) => {
  function $ (dollars, {
    cents = dollars * centsPerDollar,
    in$ = Math.round(cents) / centsPerDollar
  } = {}) {
    const add = a$ => $.of(cents + a$);
    const subtract = a$ => $.of(cents - a$);

    return Object.assign(add, {
      get cents () {
        return cents;
      },
      valueOf () {
        return this.cents;
      },
      get $ () {
        return in$;
      },
      round () {
        return $.of(Math.round(cents));
      },
      add,
      subtract,
      constructor: $,
      toString () {
        return `${ symbol }${ this.$.toFixed(decimals) }`;
      }
    });
  }

  $.of = cents => $(undefined, { cents });
  $.cents = $.of;

  return $;
};

const $ = m$();
const in$ = n => $.cents(n).$;

module.exports = {
  m$,
  $,
  in$
};
