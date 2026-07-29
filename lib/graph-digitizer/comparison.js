// Curve-vs-curve error comparison: linear interpolation onto a chosen
// reference curve's X grid, then point-wise and summary error metrics.
// Mirrors the desktop app's curve_error_comparison.py (linear method only).

function linearInterpolateAt(xSource, ySource, xTarget) {
  const n = xSource.length;
  if (n === 0 || xTarget < xSource[0] || xTarget > xSource[n - 1]) return null;
  for (let i = 0; i < n - 1; i++) {
    const x0 = xSource[i];
    const x1 = xSource[i + 1];
    if (xTarget >= x0 && xTarget <= x1) {
      if (x1 === x0) return ySource[i];
      const t = (xTarget - x0) / (x1 - x0);
      return ySource[i] + t * (ySource[i + 1] - ySource[i]);
    }
  }
  return null;
}

function trapezoidArea(xs, ys) {
  let area = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    area += ((ys[i] + ys[i + 1]) / 2) * (xs[i + 1] - xs[i]);
  }
  return area;
}

// One curve (reference) vs one other curve, interpolated onto the reference's X values.
export function compareCurves(reference, comparison) {
  const refSorted = [...reference.points].sort((a, b) => a.x - b.x);
  const cmpSorted = [...comparison.points].sort((a, b) => a.x - b.x);
  const cmpX = cmpSorted.map((p) => p.x);
  const cmpY = cmpSorted.map((p) => p.y);

  const rows = refSorted.map((refPoint) => {
    const yInterp = linearInterpolateAt(cmpX, cmpY, refPoint.x);
    let status = "OK";
    let error = null;
    let absError = null;
    let pctError = null;
    if (yInterp === null) {
      status = "Out of range";
    } else {
      error = refPoint.y - yInterp;
      absError = Math.abs(error);
      if (refPoint.y === 0) {
        status = "Division by zero";
      } else {
        pctError = (absError / Math.abs(refPoint.y)) * 100;
      }
    }
    return { x: refPoint.x, yRef: refPoint.y, yInterp, error, absError, pctError, status };
  });

  const valid = rows.filter((r) => r.error !== null);
  const pctValid = rows.filter((r) => r.pctError !== null);
  const n = valid.length;

  const rmse = n ? Math.sqrt(valid.reduce((sum, r) => sum + r.error ** 2, 0) / n) : null;
  const mae = n ? valid.reduce((sum, r) => sum + r.absError, 0) / n : null;
  const maxAbsError = n ? Math.max(...valid.map((r) => r.absError)) : null;
  const meanPctError = pctValid.length ? pctValid.reduce((sum, r) => sum + r.pctError, 0) / pctValid.length : null;
  const areaError = n > 1 ? trapezoidArea(valid.map((r) => r.x), valid.map((r) => r.absError)) : n === 1 ? 0 : null;

  const yValues = refSorted.map((p) => p.y);
  const yRange = yValues.length ? Math.max(...yValues) - Math.min(...yValues) : 0;
  let similarity = null;
  if (rmse !== null) {
    similarity = yRange === 0 ? (rmse === 0 ? 100 : 0) : Math.max(0, Math.min(100, 100 - (rmse / yRange) * 100));
  }

  return {
    rows,
    summary: { rmse, mae, maxAbsError, meanPctError, areaError, similarity, compared: n, skipped: rows.length - n },
  };
}

export const COMPARISON_METHOD_NOTES = [
  "Interpolation: linear, evaluated at each reference curve's X value using its two nearest neighbors on the comparison curve. Points outside the comparison curve's X range are marked \"Out of range\" and excluded from the metrics below (no extrapolation).",
  "Error = Y(reference) − Y(interpolated comparison)",
  "Absolute Error = |Error|",
  "Percentage Error = |Error| / |Y(reference)| × 100  (undefined where Y(reference) = 0)",
  "RMSE = √( mean( Error² ) )",
  "MAE (Mean Absolute Error) = mean( |Error| )",
  "Area Error = ∫ |Error| dx, via the trapezoidal rule over the reference X range",
  "Similarity % = 100 − (RMSE / (max Y(reference) − min Y(reference))) × 100, clamped to 0–100",
];
