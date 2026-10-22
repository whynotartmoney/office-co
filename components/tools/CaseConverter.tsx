"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import { toCamel, toKebab, toLower, toSentence, toSnake, toTitle, toUpper } from "@/lib/text";
import type { CopyKey } from "@/lib/i18n";

const MODES: { id: CopyKey; run: (value: string) => string }[] = [
  { id: "case.upper", run: toUpper },
  { id: "case.lower", run: toLower },
  { id: "case.title", run: toTitle },
  { id: "case.sentence", run: toSentence },
  { id: "case.snake", run: toSnake },
  { id: "case.camel", run: toCamel },
  { id: "case.kebab", run: toKebab },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const t = useCopy();
  const rows = useMemo(() => MODES.map((mode) => ({ ...mode, value: text ? mode.run(text) : "" })), [text]);

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="case.input" />
        </span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t["case.placeholder"]} rows={5} />
      </label>
      <ul className="case-list">
        {rows.map((row) => (
          <li key={row.id} className="case-row">
            <span className="case-label">
              <Tx id={row.id} />
            </span>
            <output>{row.value || "—"}</output>
            <CopyButton text={row.value} />
          </li>
        ))}
      </ul>
    </div>
  );
}
