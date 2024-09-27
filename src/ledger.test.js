import describe from 'riteway';

import { ethereum as $ } from './index';
import { $$, addPercent, subtractPercent } from './ledger';

describe('$$', async assert => {
  const should = 'total $(x) amounts';
  /* eslint-disable */
  const actual = $$(
    $('40'),
    $('60'),
    $('-5')
  ).toString();
  /* eslint-enable */

  const expected = $(95).toString();

  assert({
    given: 'some numbers to add',
    should,
    actual,
    expected
  });
});

describe('addPercent(percent)', async assert => {
  const should = 'add percents to the total';

  /* eslint-disable */
  const actual = $$(
    $(50),
    addPercent(50)
  ).toString();
  /* eslint-enable */
  const expected = $(75).toString();

  assert({
    given: 'add percent function',
    should,
    actual,
    expected
  });
});

describe('subtract(percent)', async assert => {
  const should = 'subtract percents from the total';

  /* eslint-disable */
  const actual = $$(
    $(50),
    subtractPercent(50)
  ).toString();
  /* eslint-enable */
  const expected = $(25).toString();

  assert({
    given: 'subtract percent function',
    should,
    actual,
    expected
  });
});

describe('addPercent with 0 decimals', async assert => {
  const money = createCurrency({ decimals: 0 });

  {
    const actual = $$(money(100), addPercent(13)).toNumber();
    const expected = 113;

    assert({
      given: 'a percentage added to a currency with zero decimals',
      should: 'add the percentage correctly',
      actual,
      expected
    });
  }
});

describe('subtractPercent with 0 decimals', async assert => {
  const money = createCurrency({ decimals: 0 });

  {
    const actual = $$(money(100), subtractPercent(13)).toNumber();
    const expected = 87;

    assert({
      given: 'a percentage subtracted from a currency with zero decimals',
      should: 'subtract the percentage correctly',
      actual,
      expected
    });
  }
});
