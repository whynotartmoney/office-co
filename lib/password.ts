export type PasswordSets = {
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
};

const SETS: Record<keyof PasswordSets, string> = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

function randomIndex(max: number): number {
  if (max <= 0) throw new Error("range");
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

export function generatePassword(length: number, sets: PasswordSets): string {
  const pools = (Object.keys(SETS) as (keyof PasswordSets)[]).filter((key) => sets[key]).map((key) => SETS[key]);
  if (pools.length === 0) throw new Error("sets");
  const size = Math.min(128, Math.max(length, pools.length, 4));
  const all = pools.join("");
  const chars = pools.map((pool) => pool[randomIndex(pool.length)]);
  while (chars.length < size) chars.push(all[randomIndex(all.length)]);
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    const swap = chars[i];
    chars[i] = chars[j];
    chars[j] = swap;
  }
  return chars.join("");
}
