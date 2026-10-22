export type UnitCategory = "length" | "weight" | "temp" | "area";

export const UNIT_TABLES: Record<Exclude<UnitCategory, "temp">, Record<string, number>> = {
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  },
  weight: {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    oz: 0.028349523125,
    lb: 0.45359237,
  },
  area: {
    mm2: 0.000001,
    cm2: 0.0001,
    m2: 1,
    km2: 1_000_000,
    in2: 0.00064516,
    ft2: 0.09290304,
    acre: 4046.8564224,
    ha: 10000,
  },
};

export const UNIT_IDS: Record<UnitCategory, readonly string[]> = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
  weight: ["mg", "g", "kg", "oz", "lb"],
  temp: ["C", "F", "K"],
  area: ["mm2", "cm2", "m2", "km2", "in2", "ft2", "acre", "ha"],
};

export function convertUnits(category: UnitCategory, value: number, from: string, to: string): number | null {
  if (!Number.isFinite(value)) return null;
  if (category === "temp") return convertTemp(value, from, to);
  const table = UNIT_TABLES[category];
  if (!(from in table) || !(to in table)) return null;
  return (value * table[from]) / table[to];
}

function toCelsius(value: number, from: string): number | null {
  if (from === "C") return value;
  if (from === "F") return ((value - 32) * 5) / 9;
  if (from === "K") return value - 273.15;
  return null;
}

function fromCelsius(celsius: number, to: string): number | null {
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  if (to === "K") return celsius + 273.15;
  return null;
}

function convertTemp(value: number, from: string, to: string): number | null {
  const celsius = toCelsius(value, from);
  if (celsius === null) return null;
  return fromCelsius(celsius, to);
}

export function formatMeasure(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.000001 || abs >= 1e9)) return value.toExponential(6);
  return String(Number(value.toPrecision(10)));
}
