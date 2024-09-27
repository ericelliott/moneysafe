const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const $$ = (...fns) => {
  const $ = fns[0].constructor;
  return pipe(...fns)($(0));
};

const percent = percent => a => {
  const of = a.constructor.of;
  return of(a.times(percent * 0.01));
};

const addPercent = p => a => a.add(percent(p)(a));

const subtractPercent = p => a => a.minus(percent(p)(a));

module.exports = {
  $$,
  percent,
  addPercent,
  subtractPercent
};
