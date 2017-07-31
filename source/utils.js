const currencySymbols = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/; // eslint-disable-line no-useless-escape

const strip$ = (currency = 0) => typeof currency === 'string' ?
  parseFloat(currency.replace(currencySymbols, '').trim()) :
  parseFloat(currency)
;

module.exports = {
  currencySymbols,
  strip$
};
