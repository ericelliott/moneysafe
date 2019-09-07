import describe from 'riteway';
import './ledger.test.js';
import { ethereum as $, add, multiply, divide } from './index.js';

describe('instance.map', async assert => {
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

describe('Arithmetic utilities: add, multiply, divide', async assert => {
  {
    const actual = add(
      $('0.000000000000000001'),
      $('0.000000000000000001')
    ).toString();
    const expected = '0.000000000000000002';

    assert({
      given: 'two 18-digit precision numbers',
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
});
