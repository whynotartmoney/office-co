"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { loremParagraphs, loremWords } from "@/lib/lorem";

export default function LoremTool() {
  const [mode, setMode] = useState<"paragraphs" | "words">("paragraphs");
  const [count, setCount] = useState(2);
  const [output, setOutput] = useState("");

  return (
    <div className="stack">
      <div className="chips" role="group">
        <span className="sr">
          <Tx id="lorem.mode" />
        </span>
        <button type="button" className="chip" aria-pressed={mode === "paragraphs"} onClick={() => setMode("paragraphs")}>
          <Tx id="lorem.paragraphs" />
        </button>
        <button type="button" className="chip" aria-pressed={mode === "words"} onClick={() => setMode("words")}>
          <Tx id="lorem.words" />
        </button>
      </div>
      <div className="row">
        <label className="field inline">
          <span className="field-label">
            <Tx id="lorem.count" />
          </span>
          <input
            type="number"
            min={1}
            max={mode === "paragraphs" ? 20 : 500}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const next = Number.isFinite(count) ? count : 1;
            setOutput(mode === "paragraphs" ? loremParagraphs(next) : loremWords(next));
          }}
        >
          <Tx id="lorem.generate" />
        </button>
        <CopyButton text={output} />
      </div>
      <textarea readOnly value={output} rows={10} />
    </div>
  );
}
