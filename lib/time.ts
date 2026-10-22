export type UnixMode = "auto" | "s" | "ms";

export function interpretUnix(raw: string, mode: UnixMode): { ms: number; unit: "s" | "ms" } | null {
  const trimmed = raw.trim();
  if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return null;
  const unit = mode === "auto" ? (Math.abs(value) < 1e11 ? "s" : "ms") : mode;
  const ms = unit === "s" ? value * 1000 : value;
  if (!Number.isFinite(ms) || Math.abs(ms) > 8.64e15) return null;
  return { ms, unit };
}

export function parseIso(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const ms = Date.parse(trimmed);
  return Number.isNaN(ms) ? null : ms;
}

function pad(value: number): string {
  return String(Math.trunc(Math.abs(value))).padStart(2, "0");
}

/** offsetMinutes is minutes east of UTC (the inverse of Date#getTimezoneOffset). */
export function formatOffset(ms: number, offsetMinutes: number): string {
  const shifted = new Date(ms + offsetMinutes * 60_000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const year = shifted.getUTCFullYear();
  const month = pad(shifted.getUTCMonth() + 1);
  const day = pad(shifted.getUTCDate());
  const hours = pad(shifted.getUTCHours());
  const minutes = pad(shifted.getUTCMinutes());
  const seconds = pad(shifted.getUTCSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

export function formatLocal(ms: number): string {
  return formatOffset(ms, -new Date(ms).getTimezoneOffset());
}

export function formatUtc(ms: number): string {
  return new Date(ms).toISOString();
}
