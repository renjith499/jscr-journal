// Shared helpers for writing Abaqus 2020 CAE material-library files, which
// use a private Python pickle layout. Kept generic here so any material
// model (CDP, Steel, future ones) can build its own behavior dict and reuse
// the same primitives, targeting the layout verified against a CAE-created
// library supplied by JSCR.

export const clean = (value, fallback) =>
  String(value || fallback)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/^_+|_+$/g, "") || fallback;

export const number = (value) =>
  Number.isFinite(value) ? String(Number(value.toPrecision(12))) : "0.0";

export const tuple = (rows) =>
  `(${rows.map((row) => `(${row.map(number).join(", ")})`).join(", ")}${rows.length === 1 ? "," : ""})`;

export const pickleString = (value) =>
  `S'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, "\\n")}'\n`;

export function table(points, value) {
  return tuple(points.map((point) => [value(point), point.x]));
}
