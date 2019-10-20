# Money$afe

Convenient, safe money calculations in JS.

## Status - Developer Preview

Money$afe has not yet been tested in production at scale.

## What is it?

Writing software that deals with money is a bit of a pain in JavaScript. Money-safe calculations are harder than they should be.

Why? Because JavaScript Numbers are IEEE 754 64-bit floating point. The result is that we can't safely add money because the decimal will get skewered by floating point rounding errors.

```js
.2 + .1 === .3; // false
```
However, this problem effectively goes away if you perform the same calculations in arbitrary precision units. Money$afe converts your dollar values into BigNumbers and then exposes arithetic operations like add, multiply, and divide.

With Money$afe:

```js
add($(.1), $(.2)).toNumber() === $(.3).toNumber();
```

Even better. There's a convenient ledger form for common calculations like shopping carts:

```js
$$(
  $(40),
  $(60),
  // subtract discount
  subtractPercent(20),
  // add tax
  addPercent(10)
).toNumber(); // 88
```

### Known Issues

This code was written in ES6, and no attempt has been made to compile it for older browsers. This should not be a problem in any modern evergreen browser, but it will likely throw errors in old IE and old versions of Safari. You have been warned. If you want to run the code in other browsers, you'll need to compile to ES5 yourself.

Values are stored in arbitrary precision using BigNumber, so you can perform accurate calculations for cryptocurrencies such as Bitcoin or Ethereum which have 8 and 18 decimal precision, respectively. By way of contrast, JavaScript's native number type is IEEE 754 with 16 digits of decimal precision.

To recap:

* By default, all math operations automatically use arbitrary precision big numbers internally.
* You can get the value in a number type using `.toNumber()`.


## Getting Started

Install moneysafe:

```js
npm install --save moneysafe
```

Import the functions you need:

```js
import { $ } from 'moneysafe';
import { $$, subtractPercent, addPercent } from 'moneysafe/ledger';
```

OR:

```js
const { $ } = require('moneysafe');
const { $$, subtractPercent, addPercent } = require('moneysafe/ledger');
```

Enjoy:

```js
$$(
  $(40),
  $(60),
  // subtract discount
  subtractPercent(20),
  // add tax
  addPercent(10)
).toNumber(); // 88
```

## How does Money$afe work?

It works by storing and acting on the amounts in cents instead of dollars, which reduces the floating point rounding errors you get when you represent them as decimal dollars. Of course, you'll still get rounding errors with lots of multiplication and division, but errors are less common and less significant when scaled to cents.

## $(dollars) => Money

The `$()` factory takes a value in dollars and lifts it into the money object type.

```js
$(dollars: n) => Money
```

Example:

```js
$(20).cents; // 2000
```

Once a value is represented as money, you can operate on it using normal JavaScript operators. The resulting value will be in cents:

```js
$(20) / 2; // 1000 cents
```

## in$ Utility

Take a numerical value in cents and convert to a numerical value in dollars, rounded to the nearest cent.

```$
in$(cents: n) => dollars: Number
```

Since Money$afe allows you to use normal math operators, which work in cents, `in$()` is a convenient way to convert the result back to dollars:

```js
import { in$, $ } from 'moneysafe';

in$($(20) / 2) // 10
```

### $ Static Props

#### $.of()

Takes a value and lifts it into the `Money` object type. **Not rounded.**

```js
$.of(amount) => Money
```

Example:

```js
$.of(20.2).valueOf(); // 20.2
$.of(1.635).valueOf(); // 1.635
$.of(.1 + .2).valueOf(); // 0.30000000000000004
```


## The Money Type

The Money type is a function object returned by the `createCurrency` factory. The type itself is a function that takes an amount in number or string format and returns a new `Money` object.

```js
money(amount) => Money
```

Example:
```js
const a = $(20);
const b = $(10);

const c = a(b);
console.log(+c); // 30
```

The result is that standard function composition acts like addition. The following are equivalent:

```js
import pipe from 'lodash.flow';
import { $ } from 'moneysafe';

{
  const a = $(20);
  const b = $(10);

  const c = a(b);
  console.log(+c); // 30
}

{
  const c = pipe(
    $(20),
    $(10)
  )($(0));

  console.log(+c);
}
```

This is what makes the handy ledger syntax possible. `$$` is just a thin wrapper around a standard function composition:

```js
import { $$, subtractPercent, addPercent } from 'moneysafe/ledger';

+$$(
  $(40),
  $(60),
  // subtract discount
  subtractPercent(20),
  // add tax
  addPercent(10)
) // 88
```

### money.add()

Takes an amount and returns a money instance with the sum of the stored value and the amount.

```js
money.add(amount: Money) => Money
```

Example:

```js
$(10).add($(5)).toNumber() // 15
```

### money.minus()

Takes an amount and returns a money instance with the difference between the stored value and the amount.

```js
money.minus(amount: Money) => Money
```

Example:

```js
$(10).minus($(5)).toNumber() // 5
$(10).minus(500).toNumber() // 5
$(0).minus($(5)).toNumber() // -5
```

### money.toNumber(), money.valueOf()

Convert a `Money` object to JavaScript Number format (IEEE 754 floating point). *Note: JavaScript number precision is limited to 16 decimal digits.*

```js
money.toNumber() => Number
```

Example:
```js
$(2000).toNumber(); // 2000
```

### money.abs()

Returns a `Money` object which contains the absolute value.

```js
money.abs() => Money
```

Example:

```js
$('-8').abs().toString() === $('8').toString(); // true
```

### money.toString()

Convert a `Money` object to a `String`. *Warning: This isn't a properly localized currency string suitable for display to users. Please use a good i18n library and/or exchange rate API to convert to localized currency.*

```js
money.toString() => String
```

Example:
```js
$(2000).toString(); // "2000"
```

### money.map()

Apply a function of type `BigNumber => BigNumber` in the context of the Money object.
This allows you to implement arbitrary operations for Money objects, which you
can apply by mapping them. *Note: `money.map()` obeys the functor laws.*

```js
money.map(f: BigNumber => BigNumber) => Money
```

Example:

```js
const pow = exp => m => Array.from(
  { length: exp }, x => m
).reduce((a, b) => a.times(b));

+$(2).map(pow(2)); // 4
```


## Utility functions

## add()

Take any number of money objects and return the sum.

```js
add(...Money) => Money
```

Example:

```
add($('0.1'), $('0.2')).toString() === '0.30'; // true
```


## multiply()

Take any number of money objects and return the product.

```js
multiply(...Money) => Money
```

Example:

```js
multiply($(2), $(4)).toString() === '8.00'; // true
```

## Divide

Take a dividend and divisor and return the quotient.

```js
divide(dividend: Money, divisor: Money) => Money
```

Example:

```js
divide($(8), $(2)).toString() === '4.00'; // true
```

## Less Than

Take a base and a comparand and return whether the comparand is less than the base.

```js
lt(base: Money, comparand: Money) => boolean
```

Example:

```js
lt($(7), $(7.009)) === true; // true
lt($(7), $(7)) === false; // false
lt($(7), $(6.991)) === false; // false
```

## Greater Than

Take a base and a comparand and return whether the comparand is greater than the base.

```js
gt(base: Money, comparand: Money) => boolean
```

Example:

```js
gt($(7), $(7.009)) === false; // false
gt($(7), $(7)) === false; // false
gt($(7), $(6.991)) === true; // true
```

## Less Than or Equal to

Take a base and a comparand and return whether the comparand is less than or equal the base.

```js
lte(base: Money, comparand: Money) => boolean
```

Example:

```js
lte($(7), $(7.009)) === true; // true
lte($(7), $(7)) === true; // true
lte($(7), $(6.991)) === false; // false
```

## Greater Than or Equal to

Take a base and a comparand and return whether the comparand is greater than or equal the base.

```js
gte(base: Money, comparand: Money) => boolean
```

Example:

```js
gte($(7), $(7.009)) === false; // false
gte($(7), $(7)) === true; // true
gte($(7), $(6.991)) === true; // true
```


## $$ Ledger

Takes any number of money objects (or functions of type `Money => Money`) and returns a money object containing the sum.

```js
$$(...Money) => Money
```

Example:

```js
import { $ } from 'moneysafe';
import { $$ } from 'moneysafe/ledger';

$$(
  $(40),
  $(60),
  $(-5)
).toNumber(); // 95
```

### addPercent()

Takes a percent `x` as a number and the current value in cents (curried), and returns a new money object representing the sum of the current value and `x%` of the current value.

```js
addPercent(percent: n) => (amount: Money) => Money
```

Example:

```js
import { $ } from 'moneysafe';
import { $$, addPercent } from 'moneysafe/ledger';

const total = $$(
  $(40),
  $(60),
  addPercent(10)
);

console.log(
  total.toNumber() // 110
);
```

### subtractPercent()

Takes a percent `x` as a number and the current value in cents (curried), and returns a new money object representing the difference between the current value and `x%` of the current value.

```js
subtractPercent(percent: n) => (Money) => Money
```

Example:

```js
import { $ } from 'moneysafe';
import { $$, subtractPercent } from 'moneysafe/ledger';

const total = $$(
  $(40),
  $(60),
  subtractPercent(10)
);

console.log(
  total.toNumber() // 90
);
```
