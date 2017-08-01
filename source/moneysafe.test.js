const test = require('tape');
const { m$, $, in$ } = require('./moneysafe');

test('$(dollars)', assert => {
  const msg = 'should return money with .valueOf() in cents';

  const actual = $(10).valueOf();
  const expected = 1000;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$.cents(x)', assert => {
  const msg = 'should return money with x cents';

  const actual = $.cents(10).cents;
  const expected = 10;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(.1) + $(.2)', assert => {
  const msg = 'should accurately add values that trip up IEE 754';

  const actual = $(.1) + $(.2);
  const expected = 30;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$.of(.1) + $.of(.2)', assert => {
  const msg = 'should retain floating point precision for cent fractions';

  const actual = $.of(.1) + $.of(.2);
  const expected = $.of(0.30000000000000004).cents;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(.006).round()', assert => {
  const msg = 'should return new money object, rounded to the cent.';

  const actual = $.of(.6).round().cents;
  const expected = 1;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(x).$', assert => {
  const msg = 'should return the amount in dollars, rounded to the penny';

  const actual = $.of($.of(.1) + $.of(.2)).$;
  const expected = 0;

  assert.same(actual, expected, msg);
  assert.same($(1).$, 1, msg);
  assert.same($(10.101).$, 10.10, msg);
  assert.same($(10.106).$, 10.11, msg);
  assert.same($(-5).$, -5, 'should return correct amounts for negative values.');
  assert.end();
});


test('$(0)', assert => {
  const msg = 'should return money with .cents === 0';

  const actual = $(0).cents;
  const expected = 0;

  assert.same(actual, expected, msg);
  assert.end();
});


test('$(a)(b)', assert => {
  const msg = 'should add a + b in cents';

  const actual = $(10)($(20)).cents;
  const expected = 3000;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(a)($(0))', assert => {
  const msg = 'should be ==== $(a)';

  const actual = $(10)($(0)).cents;
  const expected = $(10).cents;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(a)(b)', assert => {
  const msg = 'should sum a + -b in cents';

  const actual = $(10)($(-5)).cents;
  const expected = $(5).cents;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(a).add($(10))', assert => {
  const msg = 'should be ==== $(a)($(x))';

  const actual = $(10).add($(10)).$;
  const expected = 20;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(a).subtract($(x))', assert => {
  const msg = 'should be ==== $.of($(a) - $(b))';

  const actual = $(10).subtract($(5)).$;
  const expected = 5;

  assert.same(actual, expected, msg);
  assert.end();
});

test('$(x).constructor', assert => {
  const msg = 'should === $';

  const actual = $(10).constructor;
  const expected = $;

  assert.strictEqual(actual, expected, msg);
  assert.end();
});

test('$(x).constructor.of(nCents).cents', assert => {
  const msg = 'should === nCents';
  const nCents = 100;

  const actual = $(10).constructor.of(nCents).cents;
  const expected = nCents;

  assert.strictEqual(actual, expected, msg);
  assert.end();
});

test('$(x).toString()', assert => {
  const msg = 'should return string reperesenting the value';

  const actual = $(10.10).toString();
  const expected = '$10.10';

  assert.same(actual, expected, msg);
  assert.end();
});

test('m$({ symbol: \'#\' })(x).toString()', assert => {
  const msg = 'should return string with custom currency symbol';
  const p = m$({ symbol: '#' });

  const actual = p(10.10).toString();
  const expected = '#10.10';

  assert.same(actual, expected, msg);
  assert.end();
});

test('in$()', assert => {
  const msg = 'should convert cents to dollars';

  const actual = in$(1010);
  const expected = 10.10;

  assert.same(actual, expected, msg);
  assert.end();
});
