import describe from 'riteway';
import './ledger.test.js';
import {
  ethereum as eth,
  createCurrency,
  $,
  add,
  multiply,
  divide,
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

describe('Arithmetic utilities: add, multiply, divide, equals', async assert => {
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
    const actual = equals($(0.3), $(0.3));
    const expected = true;

    assert({
      given: 'two equal values',
      should: 'return true',
      actual,
      expected
    });
  }

  {
    const actual = equals($(0.3), $(42));
    const expected = false;

    assert({
      given: 'two different values',
      should: 'return false',
      actual,
      expected
    });
  }
});
