const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim",
  "id", "est", "laborum",
];

function sentence(count: number, offset: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i += 1) words.push(WORDS[(offset + i) % WORDS.length]);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function loremWords(count: number): string {
  const safe = clamp(count, 1, 500);
  const chunks: string[] = [];
  let used = 0;
  let offset = 0;
  while (used < safe) {
    const size = Math.min(12, safe - used);
    chunks.push(sentence(size, offset));
    used += size;
    offset += size;
  }
  return chunks.join(" ");
}

export function loremParagraphs(count: number): string {
  const safe = clamp(count, 1, 20);
  return Array.from({ length: safe }, (_, index) => loremWords(40 + (index % 5) * 8)).join("\n\n");
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}
