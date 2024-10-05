import describe from 'riteway';

import './ledger.test.js';
import {
  ethereum as eth,
  createCurrency,
  $,
  add,
  multiply,
  divide,
  lt,
  gt,
  lte,
  gte,
  equals
} from './index.js';

describe('money.map', async assert => {
  {
    const id = x => x;
    const a = $('20');
    const b = a.map(id);

    assert({
      given: 'identity',
      should: 'not alter the value',
      actual: a.toString(),
      expected: b.toString()
    });
  }
  {
    const y = $('20');
    const g = n => n.plus(1);
    const f = n => n.times(2);
    const a = y.map(g).map(f);
    const b = y.map(x => f(g(x)));
    assert({
      given: 'two functions to compose',
      should: 'obey the functor composition law',
      actual: a.toString(),
      expected: b.toString()
    });
  }
});

describe('money.toNumber', async assert => {
  assert({
    given: 'no arguments',
    should: 'return the value as a Number',
    actual: $(3).toNumber(),
    expected: 3
  });
});

describe('Arithmetic utilities: add, multiply, divide, abs', async assert => {
  {
    const actual = add($('0.1'), $('0.2')).toString();
    const expected = '0.30';

    assert({
      given: 'two 18-digit precision numbers',
      should: 'add them correctly',
      actual,
      expected
    });
  }

  {
    const $ = createCurrency({ decimals: 9 });

    const actual = add($('0.000000001'), $('0.000000001')).toString();
    const expected = '0.000000002';

    assert({
      given: 'two ethereum-precision numbers',
      should: 'add them correctly',
      actual,
      expected
    });
  }

  {
    const actual = add(
      eth('0.000000000000000001'),
      eth('0.000000000000000001')
    ).toString();
    const expected = '0.000000000000000002';

    assert({
      given: 'two ethereum-precision numbers',
      should: 'add them correctly',
      actual,
      expected
    });
  }

  {
    const actual = multiply($(2), $(4)).toString();
    const expected = $(8).toString();

    assert({
      given: 'two numbers to multiply',
      should: 'return the product of the inputs',
      actual,
      expected
    });
  }

  {
    const actual = divide($(8), $(2)).toString();
    const expected = $(4).toString();

    assert({
      given: 'a dividend and divisor',
      should: 'return the quotient',
      actual,
      expected
    });
  }

  {
    const actual = $('-8')
      .abs()
      .toString();
    const expected = $('8').toString();

    assert({
      given: 'abs used on a negative number',
      should: 'return the positive number',
      actual,
      expected
    });
  }

  {
    const money = createCurrency({ decimals: 0 });

    const actual = money(100)
      .multipliedBy(2.5)
      .toNumber();
    const expected = 250;

    assert({
      given:
        'a currency with zero decimals multiplied by a decimal number without a leading zero',
      should: 'multiply correctly',
      actual,
      expected
    });
  }

  {
    const money = createCurrency({ decimals: 0 });

    const actual = money(100)
      .multipliedBy(0.13)
      .toNumber();
    const expected = 13;

    assert({
      given:
        'a currency with zero decimals multiplied by a decimal number with a leading zero',
      should: 'multiply correctly',
      actual,
      expected
    });
  }
});

describe('Comparative utilities: less than', async assert => {
  {
    const actual = lt($(7), $(7.009));
    const expected = true;

    assert({
      given: 'a base compared to a higher comparand',
      should: 'return true',
      actual,
      expected
    });
  }

  {
    const actual = lt($(7), $(7));
    const expected = false;

    assert({
      given: 'a base compared to an equal comparand',
      should: 'return false',
      actual,
      expected
    });
  }

  {
    const actual = lt($(7), $(6.991));
    const expected = false;

    assert({
      given: 'a base compared to a lower comparand',
      should: 'return false',
      actual,
      expected
    });
  }
});

describe('Comparative utilities: greater than', async assert => {
  {
    const actual = gt($(7), $(7.009));
    const expected = false;

    assert({
      given: 'a base compared to a higher comparand',
      should: 'return false',
      actual,
      expected
    });
  }

  {
    const actual = gt($(7), $(7));
    const expected = false;

    assert({
      given: 'a base compared to an equal comparand',
      should: 'return false',
      actual,
      expected
    });
  }

  {
    const actual = gt($(7), $(6.991));
    const expected = true;

    assert({
      given: 'a base compared to a lower comparand',
      should: 'return true',
      actual,
      expected
    });
  }
});

describe('Comparative utilities: less than or equal to', async assert => {
  {
    const actual = lte($(7), $(7.009));
    const expected = true;

    assert({
      given: 'a base compared to a higher comparand',
      should: 'return true',
      actual,
      expected
    });
  }

  {
    const actual = lte($(7), $(7));
    const expected = true;

    assert({
      given: 'a base compared to an equal comparand',
      should: 'return true',
      actual,
      expected
    });
  }

  {
    const actual = lte($(7), $(6.991));
    const expected = false;

    assert({
      given: 'a base compared to a lower comparand',
      should: 'return false',
      actual,
      expected
    });
  }
});

describe('Comparative utilities: greater than or equal to', async assert => {
  {
    const actual = gte($(7), $(7.009));
    const expected = false;

    assert({
      given: 'a base compared to a higher comparand',
      should: 'return false',
      actual,
      expected
    });
  }

  {
    const actual = gte($(7), $(7));
    const expected = true;

    assert({
      given: 'a base compared to an equal comparand',
      should: 'return true',
      actual,
      expected
    });
  }

  {
    const actual = gte($(7), $(6.991));
    const expected = true;

    assert({
      given: 'a base compared to a lower comparand',
      should: 'return true',
      actual,
      expected
    });
  }
});

describe('Comparative utilities: equals', async assert => {
  {
    const actual = equals($(7), $(7));
    const expected = true;

    assert({
      given: 'two equal money objects',
      should: 'return true',
      actual,
      expected
    });
  }

  {
    const actual = equals($(7), $(7.009));
    const expected = false;

    assert({
      given: 'two unequal money objects',
      should: 'return false',
      actual,
      expected
    });
  }

  {
    const actual = $(7).equals($(6.991));
    const expected = false;

    assert({
      given: 'two unequal money objects using the equals method',
      should: 'return false',
      actual,
      expected
    });
  }
});
