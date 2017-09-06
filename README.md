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
However, this problem effectively goes away if you perform the same calculations in cents. Money$afe converts your dollar values into cents and then exposes them to the normal JavaScript math operators, so you can use `+`, `-`, `*`, `/` as you normally would.

With Money$afe:

```js
$(.1) + $(.2) === $(.3).cents;
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
).$; // 88
```

### Known Issues

This code was written in ES6, and no attempt has been made to compile it for older browsers. This should not be a problem in any modern evergreen browser, but it will likely throw errors in old IE and old versions of Safari. You have been warned.

This code scales money calculations to operate on cents automatically, but fractions of cents are still represented in IEEE 754 floating point, which means that `$.of(.1) + $.of(.2) !== $.of(.3).valueOf()`. IEEE 754 can't accurately represent the value, so it rounds to `0.30000000000000004`.

Values are stored with full floating point precision to give you more headroom for complex financial calculations which require more decimal digits.

That's intentional. By preserving the full floating point precision, you get roughly 16 digits of fractional cent precision for headroom, which minimizes the impact of cumulative rounding errors for more complex calculations.

When you use `$.of()` to directly lift cents into the money type, and `money.valueOf()` (or any of the native JS math operators) to get values out, you get the full range of precision, unrounded.

Usually, you will want those values rounded to the nearest cent, so when you use the convenient `$` and `cent` lifts and getters, rounding errors get rounded away:

```
$(.001) + $(.002) === $(.003).cents
```

To recap:

* By default, all math operations automatically use the full range of precision using `$.of()` and `money.valueOf()`.
* If you want to round to the nearest cent when you lift the initial value into the type, use `$(x)` or `$.cents(x)`.
* If you want to round the value to the nearest cent to display to users or charge accounts, use the `money.$` or `money.cents` getters.


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
).$; // 88
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

Takes a value in cents and lifts it into the money object type. **Not rounded.**

```js
$.of(cents: n) => Money
```

Example:

```js
$.of(20.2).valueOf(); // 20.2
$.of(1.635).valueOf(); // 1.635
$.of(.1 + .2).valueOf(); // 0.30000000000000004
```

#### $.cents()

Takes a value in cents and lifts it into the money object type. **Rounded to the nearest cent.**

```js
$.cents(cents: n) => Money
```

Example:

```js
$.cents(20.2).valueOf(); // 20
$.cents(1.635).valueOf(); // 2
$.cents(.1 + .2).valueOf(); // 0
```


## The Money Type

The Money type is a function object returned by the `$()` factory. The type itself is a function that takes money in cents and returns a new money object with the sum of the instance value + input:

```js
money(cents: n) => Money
```

Example:
```js
const a = $(20);
const b = $(10);

const c = a(b);
console.log(c.$); // 30
```

The result is that standard function composition acts like addition. The following are equivalent:

```js
import pipe from 'lodash.flow';
import { $, in$ } from 'moneysafe';

{
  const a = $(20);
  const b = $(10);

  const c = a(b);
  console.log(c.$); // 30
}

{
  const c = pipe(
    $(20),
    $(10)
  )($(0));

  console.log(c.$);
}
```

This is what makes the handy ledger syntax possible. `$$` is just a thin wrapper around a standard function composition:

```js
import { $$, subtractPercent, addPercent } from 'moneysafe/ledger';

$$(
  $(40),
  $(60),
  // subtract discount
  subtractPercent(20),
  // add tax
  addPercent(10)
).$; // 88
```

### money.$

Get the value in dollars. **Rounded to the nearest cent.**

```js
$.of(120.3).$; // 1.2
```

### money.cents

Get the value in cents. **Rounded to the nearest cent.**

```js
$.of(1/3).valueOf() // 0.3333333333333333
$.of(1/3).cents; // 0
$(1/3).cents; // 33
```

> Note: No decimal type can accurately represent all fractions, because some fractions would require an infinite number of decimal digits (e.g., `1/3`). `money.valueOf()` does not round by default in order to preserve full floating-point precision during calculations. For maximum accuracy, keep the value in unrounded cents using standard JS operators and/or `.valueOf()` until it's time to display the result.


### money.round()

Returns a new money object, **rounded to the nearest cent:**

```js
money.round() => Money
```

```js
$.of(100.6).valueOf() // 100.6
$.of(100.6).round().valueOf() // 101
```

> Tip: `money.$` and `money.cents` always rounded to the nearest cent. You should rarely need to manually call `.round()`.


### money.add()

Takes an amount in cents and returns a money instance with the sum of the stored value and the amount.

```js
money.add(cents: n) => Money
```

Example:

```js
$(10).add($(5)).$ // 15
$(10).add(500).$ // 15
```

### money.subtract()

Takes an amount in cents and returns a money instance with the difference between the stored value and the amount.

```js
money.subtract(cents: n) => Money
```

Example:

```js
$(10).subtract($(5)).$ // 5
$(10).subtract(500).$ // 5
$(0).subtract($(5)).$ // -5
```

### money.toString()

For debugging, you can easily see the value stored in a money safe using `.toString()`, **rounded to the cent using fixed precision.**

```js
money.toString() => String
```

Example:
```js
$(2000).toString(); // "$2000.00"
```

> Warning: This isn't a properly localized currency string suitable for display to users. Please use a good i18n library and/or exchange rate API to convert to localized currency.


## $$ Ledger

Takes any number of money objects (or functions of type `(cents: n) => Money`) and returns a money object containing the sum.

```js
$$(...(cents: n) => Money) => Money
```

Example:

```js
import { $ } from 'moneysafe';
import { $$ } from 'moneysafe/ledger';

$$(
  $(40),
  $(60),
  $(-5)
).$; // 95
```

### addPercent()

Takes a percent `x` as a number and the current value in cents (curried), and returns a new money object representing the sum of the current value and `x%` of the current value.

```js
addPercent(percent: n) => (cents: n) => Money
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
  total.$ // 110
);
```

### subtractPercent()

Takes a percent `x` as a number and the current value in cents (curried), and returns a new money object representing the difference between the current value and `x%` of the current value.

```js
subtractPercent(percent: n) => (cents: n) => Money
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
  total.$ // 90
);
```
