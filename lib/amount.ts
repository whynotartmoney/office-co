const DIGITS = ["零", "壹", "貳", "叁", "肆", "伍", "陸", "柒", "捌", "玖"] as const;
const SMALL = ["", "拾", "佰", "仟"] as const;
const BIG = ["", "萬", "億", "兆"] as const;

export type AmountCode = "empty" | "invalid" | "decimals" | "range";
export type AmountResult = { ok: true; text: string } | { ok: false; code: AmountCode };

function fourDigits(group: string): string {
  const padded = group.padStart(4, "0");
  let out = "";
  let pendingZero = false;
  for (let i = 0; i < 4; i += 1) {
    const digit = padded.charCodeAt(i) - 48;
    if (digit === 0) {
      if (out) pendingZero = true;
      continue;
    }
    if (pendingZero) {
      out += "零";
      pendingZero = false;
    }
    out += DIGITS[digit] + SMALL[3 - i];
  }
  return out;
}

function convertInteger(intRaw: string): string | "range" {
  const trimmed = intRaw.replace(/^0+/, "") || "0";
  if (trimmed === "0") return "零";
  if (trimmed.length > 16) return "range";
  const groups: string[] = [];
  for (let end = trimmed.length; end > 0; end -= 4) {
    groups.push(trimmed.slice(Math.max(0, end - 4), end));
  }
  let result = "";
  let skippedZero = false;
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const group = groups[i];
    if (/^0+$/.test(group)) {
      if (result) skippedZero = true;
      continue;
    }
    let section = fourDigits(group);
    if (result && (skippedZero || Number(group) < 1000)) section = `零${section}`;
    skippedZero = false;
    result += section + BIG[i];
  }
  return result;
}

function normalize(raw: string): string {
  return raw
    .trim()
    .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xff10 + 0x30))
    .replace(/[．。]/g, ".")
    .replace(/[，,\s]/g, "")
    .replace(/^[+＋]/, "");
}

export function chineseAmount(raw: string): AmountResult {
  const cleaned = normalize(raw);
  if (!cleaned) return { ok: false, code: "empty" };
  let negative = false;
  let body = cleaned;
  if (body.startsWith("-") || body.startsWith("−") || body.startsWith("－")) {
    negative = true;
    body = body.slice(1);
  }
  if (!/^\d+(\.\d+)?$/.test(body)) return { ok: false, code: "invalid" };
  const [intRaw, fracRaw = ""] = body.split(".");
  const frac = fracRaw.replace(/0+$/, "");
  if (frac.length > 2) return { ok: false, code: "decimals" };
  const jiao = frac.length > 0 ? frac.charCodeAt(0) - 48 : 0;
  const fen = frac.length > 1 ? frac.charCodeAt(1) - 48 : 0;
  const integer = convertInteger(intRaw);
  if (integer === "range") return { ok: false, code: "range" };
  let tail = "整";
  if (jiao !== 0 && fen !== 0) tail = `${DIGITS[jiao]}角${DIGITS[fen]}分`;
  else if (jiao !== 0) tail = `${DIGITS[jiao]}角整`;
  else if (fen !== 0) tail = `零${DIGITS[fen]}分`;
  const sign = negative && !(integer === "零" && jiao === 0 && fen === 0) ? "負" : "";
  return { ok: true, text: `${sign}${integer}元${tail}` };
}
