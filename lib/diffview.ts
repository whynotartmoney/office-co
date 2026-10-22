import { diffLines } from "diff";

export type DiffRow = {
  left: string;
  right: string;
  kind: "same" | "del" | "add" | "change";
};

function splitLines(value: string): string[] {
  if (value.length === 0) return [];
  const parts = value.split("\n");
  if (parts[parts.length - 1] === "") parts.pop();
  return parts;
}

export function sideBySide(before: string, after: string): DiffRow[] {
  const changes = diffLines(before, after);
  const rows: DiffRow[] = [];
  for (let i = 0; i < changes.length; i += 1) {
    const change = changes[i];
    const next = changes[i + 1];
    if (change.removed && next?.added) {
      const left = splitLines(change.value);
      const right = splitLines(next.value);
      const count = Math.max(left.length, right.length);
      for (let line = 0; line < count; line += 1) {
        rows.push({ left: left[line] ?? "", right: right[line] ?? "", kind: "change" });
      }
      i += 1;
      continue;
    }
    for (const line of splitLines(change.value)) {
      if (change.added) rows.push({ left: "", right: line, kind: "add" });
      else if (change.removed) rows.push({ left: line, right: "", kind: "del" });
      else rows.push({ left: line, right: line, kind: "same" });
    }
  }
  return rows;
}

export function unifiedDiff(before: string, after: string): string {
  return diffLines(before, after)
    .map((change) => {
      const prefix = change.added ? "+" : change.removed ? "-" : " ";
      return splitLines(change.value)
        .map((line) => `${prefix} ${line}`)
        .join("\n");
    })
    .filter((block) => block.length > 0)
    .join("\n");
}

export function hasChanges(rows: DiffRow[]): boolean {
  return rows.some((row) => row.kind !== "same");
}
