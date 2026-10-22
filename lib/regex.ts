export type RegexMatch = {
  index: number;
  text: string;
  groups: string[];
};

export type RegexResult = {
  matches: RegexMatch[];
  truncated: boolean;
  replaced: string;
};

const FLAG_CHARS = ["g", "i", "m", "s", "u", "y"] as const;

export function cleanFlags(flags: string): string {
  const seen = new Set<string>();
  for (const flag of flags) {
    if ((FLAG_CHARS as readonly string[]).includes(flag)) seen.add(flag);
  }
  return FLAG_CHARS.filter((flag) => seen.has(flag)).join("");
}

export function runRegex(pattern: string, flags: string, text: string, replacement: string): RegexResult {
  if (pattern.length === 0) throw new Error("empty");
  if (pattern.length > 400) throw new Error("long");
  if (text.length > 20_000) throw new Error("text");
  const safeFlags = cleanFlags(flags);
  const expression = new RegExp(pattern, safeFlags);
  const listFlags = safeFlags.includes("g") ? safeFlags : `${safeFlags}g`;
  const globalExpression = new RegExp(pattern, listFlags);
  const matches: RegexMatch[] = [];
  let truncated = false;
  for (const match of text.matchAll(globalExpression)) {
    matches.push({
      index: match.index ?? 0,
      text: match[0],
      groups: match.slice(1).map((group) => group ?? ""),
    });
    if (matches.length >= 200) {
      truncated = true;
      break;
    }
  }
  const replaced = text.replace(expression, replacement);
  return { matches, truncated, replaced };
}
