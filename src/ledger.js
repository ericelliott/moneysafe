const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const $$ = (...fns) => {
  const $ = fns[0].constructor;
  return pipe(...fns)($(0));
};

const percent = percent => a => {
  const of = a.constructor.of;
  return of(a.times(percent * 0.01));
};

const addPercent = p => a => {
  const of = a.constructor.of;
  const value = a.times(p * 0.01);
  return of(a.add(value.decimalPlaces(a.constructor.decimals)));
};

const subtractPercent = p => a => {
  const of = a.constructor.of;
  const value = a.times(p * 0.01);
  return of(a.minus(value.decimalPlaces(a.constructor.decimals)));
};

module.exports = {
  $$,
  percent,
  addPercent,
  subtractPercent
};
