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

This code scales money calculations to operate on cents automatically, but fractions of cents are still represented in IEEE 754 floating point, which means that `$(.001) + $(.002) !== $(.003).cents`.

The actual value is stored with full floating point precision to give you more headroom for complex financial calculations which require more decimal digits.

You can always round to the nearest cent whenever you need to: `$(.001) + $(.002) === $(.003).round().cents`.


## How does Money$afe work?

It works by storing and acting on the amounts in cents instead of dollars, which reduces the floating point rounding errors you get when you represent them as decimal dollars. Of course, you'll still get rounding errors with lots of multiplication and division, but errors are less common and less significant when scaled to cents.

The real value is stored inside an object, so you can't just compare it with `===`. The special `.cents` getter exposes the value in cents. There's also a convenient way to convert cents to `m$`, and a `.$` getter to get the value in dollars:

```js
$.cents(20).$; // 0.2
```

For debugging, you can easily see the value stored in a money safe using `.toString()`, rounded to the cent using fixed precision:

```js
$(20).toString(); // "$20.00"
```

> Warning: This isn't a properly localized currency string suitable for display to users. Please use a good i18n library and/or exchange rate API to convert to localized currency.

Since Money$afe allows you to use normal math operators, which work in cents, there's another convenient way to convert the result back to dollars:

```js
import { in$, $ } from 'moneysafe';

in$($(20) / 2) // 10
```

The API is also designed for configurability. Currently, you can change the currency symbol and the number of decimal places to display with the `.toString()` method.
