const {
  $, c, in$, is$, percent
} = require('./index');

console.log(
  percent(50).of($(20)).$
);

console.log(
  $(2.50).add(3.50).$
);

console.log(
  $(2.50).c
)

console.log(
  $(20.3333).toString()
);

/*
Math operators work, too. Just keep in mind, all calculations
opperate on cents. To get the value as a number in dollars, use the
in$() function:
*/

console.log(
  c(20).$
)

console.log(
  in$($(.2) + $(.1)),
  in$($(20) + $(40)),
  c(20) + c(20),
  in$($(20) / 2),
  in$($(100) * .05)
);

console.log(`
  + operator should work for cents: ${ $(.1) + $(.2) === $(.3).c }
  + operator should work for dollars: ${ $(10) + $(20) === $(30).cents }
  - operator should work for cents: ${ $(.2) - $(.1) === 10 }
  - operator should work for dollars: ${ $(20) - $(10) === $(10).cents }
  .add() should add dollars to given amount: ${ $(2.50).add(3.50).dollars === 6  }
  .add() should add dollars to given amount: ${ $(2.50).add(3.50).dollars === 6 }
  .addc() should add cents to given amount: ${ $(2.50).addc(350).cents === 600 }
  cents should convert to cents: ${ $(1.50).cents === 150 }
  dollars should return value in dollars: ${ $(1.50).dollars === 1.50 }
  dollars should return 0 if cents === 0: ${ c(0).dollars === 0 }
  .mult() should work for dollars: ${ $(2).mult(4).$ === $(8).$ }
  .mult() should work for bigger dollars: ${ $(20).mult(40).$ === $(800).$ }
  .multc() should work for cents: ${ $(2).multc(400).$ === $(8).$ }
  .multc() should work for bigger cents: ${ $(20).multc(4000).$ === $(800).$ }
  cents param should set amount correctly: ${ c(500).dollars === 5 }
  cents param with string: ${ c('23').cents === 23 }
  .constructor should not be an own property: ${ $(20).hasOwnProperty('constructor') === false }
  zero dollars should translate to zero cents: ${ $(0).cents === 0 }
  zero cents should translate to zero dollars: ${ c(0).dollars === 0 }
  .div() should work for dollars: ${ $(8).div(2).$ === $(4).$ }
  .div() should work for bigger dollars: ${ $(800).div(40).$ ===$(20).$ }
  .divc() should work for cents: ${ $(8).divc(200).$ === 4 }
  .divc() should work for bigger cents: ${ $(800).divc(4000).$ === 20 }
  .sub() should subtract dollars: ${ $(8).sub(4).$ === 4 }
  .sub() should subtract dollars: ${ $(8).sub(8).$ === 0 }
  .sub() should subtract 0 dollars: ${ $(8).sub(0).$ === 8 }
  .sub() should subtract dollars from 0: ${ $(0).sub(8).$ === -8 }
  .sub() should subtract negative dollars: ${ $(0).sub(-8).$ === 8 }
  .subc() should subtract cents: ${ $(8).subc(400).$ === 4 }
  with currency symbol strings, should parse numbers: ${ $('$5').dollars === 5 }
  static .is() should return true for money: ${ $.is($(5)) === true }
  static .is() should return false for not money: ${ $.is() === false }
  is$() should return true for money: ${ is$($(20)) }
`);


console.log(`with invalid dollars... should throw:`);

try {
  $('foo2').dollars
  console.log('NOT OK: invalid dollars should throw');
} catch (err) {
  console.log('OK')
}

console.log(`with invalid cents... should throw:`);

try {
  c('foo2').dollars
  console.log('NOT OK: invalid cents should throw');
} catch (err) {
  console.log('OK')
}

console.log(`.div() should not divide by 0`);

try {
  console.log($(8).div(0).$);
  console.log('NOT OK: divide by 0 should throw');
} catch (err) {
  console.log('OK');
}
