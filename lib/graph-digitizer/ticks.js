// Clean-number tick generation for chart axes (1/2/5 * 10^n steps).
export function niceTicks(min, max, targetCount = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    const base = Number.isFinite(min) ? min : 0;
    return { ticks: [base - 1, base, base + 1], min: base - 1, max: base + 1 };
  }

  const span = max - min;
  const rawStep = span / targetCount;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const step = (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude;

  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;

  const ticks = [];
  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  return { ticks, min: niceMin, max: niceMax };
}

export function formatTick(value) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.001 && value !== 0)) {
    return value.toExponential(2);
  }
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 3 });
}
