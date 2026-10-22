"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { csvToJson, jsonToCsv } from "@/lib/csv";

const SAMPLE = `name,city
Ada,Lisbon
Lin,"New York, NY"`;

export default function CsvJsonTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<"bad" | "array" | "">("");

  function convert(kind: "json" | "csv") {
    try {
      if (kind === "json") setOutput(JSON.stringify(csvToJson(input), null, 2));
      else setOutput(jsonToCsv(input));
      setError("");
    } catch (caught) {
      setOutput("");
      setError(caught instanceof Error && caught.message === "array" ? "array" : "bad");
    }
  }

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="csv.input" />
        </span>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={8} spellCheck={false} />
      </label>
      <div className="row">
        <button type="button" className="btn" onClick={() => convert("json")}>
          <Tx id="csv.toJson" />
        </button>
        <button type="button" className="btn ghost" onClick={() => convert("csv")}>
          <Tx id="csv.toCsv" />
        </button>
        <button type="button" className="btn ghost" onClick={() => setInput(SAMPLE)}>
          <Tx id="example" />
        </button>
        <CopyButton text={output} />
      </div>
      {error ? (
        <p className="msg bad" role="alert">
          {error === "array" ? <Tx id="csv.needArray" /> : <Tx id="csv.bad" />}
        </p>
      ) : null}
      <textarea readOnly value={output} rows={8} spellCheck={false} />
    </div>
  );
}
