// Validated categorical palette (dataviz skill default), fixed hue order.
// Never cycle or re-sort this list — the order is the CVD-safety mechanism.
export const CATEGORICAL_PALETTE = [
  { name: "blue", light: "#2a78d6", dark: "#3987e5" },
  { name: "orange", light: "#eb6834", dark: "#d95926" },
  { name: "aqua", light: "#1baf7a", dark: "#199e70" },
  { name: "yellow", light: "#eda100", dark: "#c98500" },
  { name: "magenta", light: "#e87ba4", dark: "#d55181" },
  { name: "green", light: "#008300", dark: "#008300" },
  { name: "violet", light: "#4a3aa7", dark: "#9085e9" },
  { name: "red", light: "#e34948", dark: "#e66767" },
];

export function nextPaletteColor(usedCount) {
  return CATEGORICAL_PALETTE[usedCount % CATEGORICAL_PALETTE.length].light;
}

export const CHART_CHROME = {
  surfaceLight: "#fcfcfb",
  surfaceDark: "#1a1a19",
  textPrimaryLight: "#0b0b0b",
  textPrimaryDark: "#ffffff",
  textSecondaryLight: "#52514e",
  textSecondaryDark: "#c3c2b7",
  mutedLight: "#898781",
  mutedDark: "#898781",
  gridLight: "#e1e0d9",
  gridDark: "#2c2c2a",
  baselineLight: "#c3c2b7",
  baselineDark: "#383835",
};
