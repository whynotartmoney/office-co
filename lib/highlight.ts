export type TextSpan = { text: string; match: boolean };

export function highlightSpans(text: string, query: string, caseSensitive: boolean): TextSpan[] {
  if (!query) return text ? [{ text, match: false }] : [];
  const source = caseSensitive ? text : text.toLowerCase();
  const needle = caseSensitive ? query : query.toLowerCase();
  const spans: TextSpan[] = [];
  let index = 0;
  while (index < text.length) {
    const found = source.indexOf(needle, index);
    if (found < 0) {
      spans.push({ text: text.slice(index), match: false });
      break;
    }
    if (found > index) spans.push({ text: text.slice(index, found), match: false });
    spans.push({ text: text.slice(found, found + needle.length), match: true });
    index = found + needle.length;
  }
  return spans;
}

export function matchCount(spans: readonly TextSpan[]): number {
  return spans.reduce((count, span) => count + (span.match ? 1 : 0), 0);
}
