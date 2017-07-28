const currencySymbols = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;

const strip$ = (currency = 0) => typeof currency === 'string' ?
  parseFloat(currency.replace(currencySymbols, '').trim()) :
  parseFloat(currency)
;

const m$ = ({
  symbol = '$',
  currency = 'USD',
  locale = 'en-US',
  centsPerDollar = 100,
  currencyStyle = 'currency',
  stringPrecision = 2
} = {}) => {
  function $ (
    inputDollars = 0, {
    dollars = strip$(inputDollars),
    cents = dollars * centsPerDollar
  } = {}) {
    cents = strip$(cents);

    if (Number.isNaN(cents) || !Number.isFinite(cents)) throw new Error("can't convert currency to number");

    return Object.assign(Object.create({ constructor: $ }), {
      get cents () {
        return cents;
      },
      get c () {
        return this.cents;
      },
      valueOf () {
        return this.cents;
      },
      get dollars () {
        return cents / centsPerDollar;
      },
      get $ () { // alias
        return this.dollars;
      },
      add$ (n) {
        return $.of(cents + $(n));
      },
      add (n) {
        return this.add$(n);
      } ,
      addc (n) {
        return $.of(cents + $.of(n));
      },
      mult (n) {
        return $.of($.of(cents) * $(n) / centsPerDollar);
      },
      multc (n) {
        return $.of($.of(cents) * $.of(n) / centsPerDollar);
      },
      div (n) {
        const $n = $(n);
        if ($n.cents === 0) throw new Error(`Can't divide currency by zero`);

        return $.of($.of(cents) / $n * centsPerDollar);
      },
      divc (n) {
        return this.div($.of(n).dollars);
      },
      sub (n) {
        return $.of(($.of(cents) - $(n)));
      },
      subc (n) {
        return $.of(($.of(cents) - $.of(n)));
      },
      toString: () => `${ symbol }${ dollars.toFixed(stringPrecision) }`
    });
  };
  $.of = (cents = 0) => $(undefined, { cents });
  $.is = (m$ = {}) => !!(m$.$ && m$.c && m$.add && m$.mult);

  return $;
};

const $ = m$();
const c = $.of;

const in$ = (cents = 0) => cents.c ? cents.c : c(cents).$;

const is$ = $.is;

const percent = p => ({
  of: am$ => $(am$.dollars * (p / 100))
});

module.exports = {
  $, c, in$, is$, percent
};
