# Money$afe

Convenient, safe money calculations in JS.

## Status - Developer Preview

Money$afe has not yet been tested in production at scale.

### Known Issues

This code was written in ES6, and no attempt has been made to compile it for older browsers. This should not be a problem in any modern evergreen browser, but it will likely throw errors in old IE and old versions of Safari. You have been warned.

This code scales money calculations to operate on cents automatically. However, that may not solve all your financial precision problems, nor will it cover every use case for money calculations. There's a lot more to decimal precision issues than calculating in cents. This library was designed primarily to make simple money calculations easy, not to be the most precise money library in the world.

I'd trust it for a shopping cart. I'm not sure I'd trust it for a bank.

## What is it?

Writing software that deals with money is a bit of a pain in JavaScript. Money-safe calculations are harder than they should be. Why? Because JavaScript only has one number type: IEEE 754 64-bit floating point. The result is that we can't safely add money because the decimal will get skewered by floating point rounding errors.

```js
.2 + .1 === .3 // false
```

With Money$afe:

```js
$(.1) + $(.2) === $(.3).c
```

It works by storing and acting on the amounts in cents instead of dollars, which reduces the floating point rounding errors you get when you represent them as decimal dollars. Of course, you'll still get rounding errors with lots of multiplication and division, but errors are less common and less significant when scaling to cents.

The value is stored inside an object, so you can't just compare it with `===`. The special `.c` getter exposes the value in cents. There's also a convenient way to convert cents to a money safe, and a `.$` getter to get the value in dollars:

```js
c(20).$ // 0.2
```

For debugging, you can easily see the value stored in a money safe using `.toString()`, rounded to the cent using fixed precision:

```js
$(20).toString() // "$20.00"
```

Since Money$afe allows you to use normal math operators, which work in cents, there's another convenient way to convert the result back to dollars:

```js
in$($(20) / 2) // 10
```

The API is also designed for configurability. Currently, you can change the currency symbol and the number of decimal places to display with the `.toString()` method.
