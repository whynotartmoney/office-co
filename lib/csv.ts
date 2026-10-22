export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      continue;
    }
    field += char;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length && rows[rows.length - 1].every((cell) => cell === "")) rows.pop();
  return rows;
}

export function csvToJson(csv: string): unknown[] {
  const rows = parseCsv(csv);
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).filter((cells) => cells.some((cell) => cell !== "")).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header || `column_${index + 1}`] = cells[index] ?? "";
    });
    return record;
  });
}

function escapeCell(value: unknown): string {
  const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function jsonToCsv(json: string): string {
  const data: unknown = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("array");
  const headers: string[] = [];
  const seen = new Set<string>();
  let primitive = false;
  for (const item of data) {
    if (!isRecord(item)) {
      primitive = true;
      continue;
    }
    for (const key of Object.keys(item)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  if (primitive && !seen.has("value")) headers.push("value");
  const lines = [headers.map((header) => escapeCell(header)).join(",")];
  for (const item of data) {
    lines.push(
      headers
        .map((header) => {
          if (isRecord(item)) return escapeCell(header === "value" ? item.value : item[header]);
          return header === "value" ? escapeCell(item) : "";
        })
        .join(","),
    );
  }
  return lines.join("\n");
}
