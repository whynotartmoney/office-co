"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { hasChanges, sideBySide, unifiedDiff } from "@/lib/diffview";

const BEFORE = "The silver desk\nholds eight free tools.";
const AFTER = "The silver desk\nholds sixteen tools.";

export default function DiffTool() {
  const [before, setBefore] = useState(BEFORE);
  const [after, setAfter] = useState(AFTER);
  const [view, setView] = useState<"side" | "unified">("side");
  const rows = useMemo(() => sideBySide(before, after), [after, before]);
  const unified = useMemo(() => unifiedDiff(before, after), [after, before]);
  const changed = hasChanges(rows);

  return (
    <div className="stack">
      <div className="split">
        <label className="field">
          <span className="field-label">
            <Tx id="diff.before" />
          </span>
          <textarea value={before} onChange={(event) => setBefore(event.target.value)} rows={8} />
        </label>
        <label className="field">
          <span className="field-label">
            <Tx id="diff.after" />
          </span>
          <textarea value={after} onChange={(event) => setAfter(event.target.value)} rows={8} />
        </label>
      </div>
      <div className="row">
        <div className="chips" role="group">
          <button type="button" className="chip" aria-pressed={view === "side"} onClick={() => setView("side")}>
            <Tx id="diff.side" />
          </button>
          <button type="button" className="chip" aria-pressed={view === "unified"} onClick={() => setView("unified")}>
            <Tx id="diff.unified" />
          </button>
        </div>
        <CopyButton text={unified} />
      </div>
      {!changed ? (
        <p className="msg ok">
          <Tx id="diff.same" />
        </p>
      ) : null}
      {view === "unified" ? (
        <pre className="diff-unified">{unified}</pre>
      ) : (
        <div className="diff-table" role="table">
          {rows.map((row, index) => (
            <div key={`${row.kind}-${index}`} className={`diff-row ${row.kind}`} role="row">
              <pre role="cell">{row.left || " "}</pre>
              <pre role="cell">{row.right || " "}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
