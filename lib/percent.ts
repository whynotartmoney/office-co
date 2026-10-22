export function percentOf(percent: number, total: number): number | null {
  if (!Number.isFinite(percent) || !Number.isFinite(total)) return null;
  return (percent / 100) * total;
}

export function whatPercent(part: number, total: number): number | null {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total === 0) return null;
  return (part / total) * 100;
}

export function percentChange(from: number, to: number): number | null {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return null;
  return ((to - from) / from) * 100;
}

export function adjustByPercent(base: number, percent: number, direction: "add" | "sub"): number | null {
  if (!Number.isFinite(base) || !Number.isFinite(percent)) return null;
  const sign = direction === "add" ? 1 : -1;
  return base * (1 + (sign * percent) / 100);
}

export function formatPercentResult(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.000001 || abs >= 1e10)) return value.toExponential(6);
  return String(Number(value.toPrecision(12)));
}
