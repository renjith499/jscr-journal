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

export function combinedLibraryFileName(projectName) {
  return `${clean(projectName, "Materials")}_combined.lib`;
}

// One material's entry inside a multi-material library: (I<seq>, 0, name, 1, {metadata}).
// `seq` is the material's 1-based position in the file — confirmed against a
// real CAE-exported multi-material library (materials indexed I1, I2, I3, ...
// inside one outer tuple, each entry shaped identically to the single-material
// export). `nextMemo` hands out fresh PUT-memo ids so nested dict/list/tuple
// opcodes stay unique across the whole file.
function materialEntry(seq, materialName, dataString, description, nextMemo) {
  const dictMemo = nextMemo();
  const listMemo = nextMemo();
  const tupleMemo = nextMemo();
  const now = Date.now() / 1000;
  return (
    `(I${seq}\nI0\n${pickleString(materialName)}I1\n(dp${dictMemo}\n` +
    `${pickleString("Data Source")}${pickleString(description)}s` +
    `${pickleString("Description")}${pickleString(description)}s` +
    `${pickleString("Time Stamp")}F${now}\ns` +
    `${pickleString("visible")}(lp${listMemo}\n${pickleString("Data Source")}a${pickleString("Description")}a${pickleString("Units")}a${pickleString("Vendor material name")}as` +
    `${pickleString("version")}${pickleString("2020")}s` +
    `${pickleString("Vendor material name")}${pickleString(materialName)}s` +
    `${pickleString("Units")}${pickleString("N, mm, MPa, tonne")}s` +
    `${pickleString("Data")}${pickleString(dataString)}s` +
    `tp${tupleMemo}\n`
  );
}

// materials: [{ name, dataString, description }]. Wraps N material entries
// (each built the same way as a single-material export) in one outer tuple —
// the same envelope shape a CAE-created multi-material library uses.
export function generateCombinedAbaqus2020Library(materials, fileName) {
  let memoCounter = 0;
  const nextMemo = () => memoCounter++;
  const headerDictMemo = nextMemo();
  const headerTupleMemo = nextMemo();
  let out = `((I0\nI-1\n${pickleString(fileName)}I0\n(dp${headerDictMemo}\ntp${headerTupleMemo}\n`;
  materials.forEach((material, index) => {
    out += materialEntry(index + 1, material.name, material.dataString, material.description, nextMemo);
  });
  const finalTupleMemo = nextMemo();
  out += `tp${finalTupleMemo}\n.`;
  return out;
}
