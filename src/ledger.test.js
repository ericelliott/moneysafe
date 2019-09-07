import describe from 'riteway';

import { ethereum as $ } from './index';
import { $$, addPercent, subtractPercent } from './ledger';

describe('$$', async assert => {
  const should = 'total $(x) amounts';
  // prettier ignore
  const actual = $$($('40'), $('60'), $('-5')).toString();

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

  const actual = $$($(50), addPercent(50)).toString();
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

  const actual = $$($(50), subtractPercent(50)).toString();
  const expected = $(25).toString();

  assert({
    given: 'subtract percent function',
    should,
    actual,
    expected
  });
});
