const test = require('tape');

const { m$ } = require('./moneysafe');
const { $$, addPercent, subtractPercent } = require('./ledger');

const $ = m$();

test('$$', assert => {
  const msg = 'should total $(x) amounts';

  const actual = $$(
    $(40),
    $(60),
    $(-5)
  ).$;

  const expected = $(95).$;

  assert.same(actual, expected, msg);
  assert.end();
});

test('addPercent(percent)', assert => {
  const msg = 'should add percents to the total';

  const actual = $$(
    $(50),
    addPercent(50)
  ).$;
  const expected = $(75).$;

  assert.same(actual, expected, msg);
  assert.end();
});

test('subtract(percent)', assert => {
  const msg = 'should subtract percents from the total';

  const actual = $$(
    $(50),
    subtractPercent(50)
  ).$;
  const expected = $(25).$;

  assert.same(actual, expected, msg);
  assert.end();
});
