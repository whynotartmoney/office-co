"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";

const SAMPLE = `# office-co

A **quiet** desk.

- free tools
- pro tools

\`local only\``;

export default function MarkdownTool() {
  const [source, setSource] = useState(SAMPLE);
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancel = false;
    void Promise.all([import("marked"), import("dompurify")]).then(([markedMod, purifyMod]) => {
      if (cancel) return;
      const raw = markedMod.marked.parse(source, { async: false, gfm: true, breaks: true });
      const clean = purifyMod.default.sanitize(raw);
      setHtml(clean);
    });
    return () => {
      cancel = true;
    };
  }, [source]);

  return (
    <div className="stack">
      <div className="split">
        <label className="field">
          <span className="field-label">
            <Tx id="md.input" />
          </span>
          <textarea value={source} onChange={(event) => setSource(event.target.value)} rows={14} spellCheck={false} />
        </label>
        <div className="field">
          <span className="field-label">
            <Tx id="md.preview" />
          </span>
          <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      <CopyButton text={html} id="md.copyHtml" />
    </div>
  );
}
