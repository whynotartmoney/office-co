export type TextStats = {
  words: number;
  chars: number;
  charsNoSpace: number;
  lines: number;
  minutes: number;
};

export function textStats(text: string): TextStats {
  const chars = Array.from(text).length;
  const charsNoSpace = Array.from(text.replace(/\s/g, "")).length;
  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
  const han = text.match(/[\u3400-\u9FFF]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-z0-9]+(?:['’][A-Za-z]+)?/g)?.length ?? 0;
  const words = han + latin;
  const minutes = latin / 200 + han / 400;
  return { words, chars, charsNoSpace, lines, minutes };
}

export function readingLabel(minutes: number): string {
  if (minutes <= 0) return "0";
  if (minutes < 1) return "< 1";
  return String(Math.ceil(minutes));
}

export function caseWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-./]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

export function toUpper(input: string): string {
  return input.toUpperCase();
}

export function toLower(input: string): string {
  return input.toLowerCase();
}

export function toTitle(input: string): string {
  return input.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function toSentence(input: string): string {
  const lower = input.toLowerCase();
  return lower.replace(/(^\s*[a-z0-9]|[.!?]\s+[a-z0-9])/g, (chunk) => chunk.toUpperCase());
}

export function toSnake(input: string): string {
  return caseWords(input).join("_");
}

export function toCamel(input: string): string {
  const words = caseWords(input);
  return words
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

export function toKebab(input: string): string {
  return caseWords(input).join("-");
}

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function decodeBase64(value: string): string {
  const clean = value.trim().replace(/\s/g, "");
  if (clean.length === 0) return "";
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean) || clean.length % 4 === 1) {
    throw new Error("invalid");
  }
  const padded = clean + "=".repeat((4 - (clean.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
