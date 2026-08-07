// Shared browser-local library of saved materials from any material-model
// calculator (CDP, Steel, future ones). Only the raw inputs are stored —
// each tool regenerates its own hardening/damage tables from them on demand,
// so the store stays a plain, tool-agnostic record.
const STORAGE_KEY = "jscr_material_library";

function readAll() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(materials) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
}

export function listMaterials() {
  return readAll().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function addMaterial(kind, name, inputs) {
  const materials = readAll();
  const entry = {
    id: `${kind}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    kind,
    name,
    inputs,
    savedAt: new Date().toISOString(),
  };
  writeAll([...materials, entry]);
  return entry;
}

export function removeMaterial(id) {
  writeAll(readAll().filter((m) => m.id !== id));
}

export function clearLibrary() {
  writeAll([]);
}
