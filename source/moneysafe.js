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
      }
    });
  }

  $.of = cents => $(undefined, { cents });
  $.cents = cents => $.of(round(cents));

  return $;
};

const $ = m$();
const in$ = n => $.cents(n).$;

module.exports = {
  m$,
  $,
  in$
};
