"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import {
  jsonToYaml,
  minifyJson,
  minifyYaml,
  prettyJson,
  prettyYaml,
  validateJson,
  validateYaml,
  yamlToJson,
} from "@/lib/convert";

const SAMPLE = `{
  "desk": "office-co",
  "tools": 16
}`;

export default function JsonYamlTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  function run(action: () => string, validMessage = false) {
    try {
      const next = action();
      setOutput(next);
      setError("");
      setOk(validMessage);
    } catch (caught) {
      setOutput("");
      setOk(false);
      setError(caught instanceof Error ? caught.message : "error");
    }
  }

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="json.input" />
        </span>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={8} spellCheck={false} />
      </label>
      <div className="row wrap">
        <button type="button" className="btn" onClick={() => run(() => prettyJson(input))}>
          <Tx id="json.prettyJson" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => minifyJson(input))}>
          <Tx id="json.miniJson" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => prettyYaml(input))}>
          <Tx id="json.prettyYaml" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => minifyYaml(input))}>
          <Tx id="json.miniYaml" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => jsonToYaml(input))}>
          <Tx id="json.toYaml" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => yamlToJson(input))}>
          <Tx id="json.toJson" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => { validateJson(input); return input; }, true)}>
          <Tx id="json.validateJson" />
        </button>
        <button type="button" className="btn ghost" onClick={() => run(() => { validateYaml(input); return input; }, true)}>
          <Tx id="json.validateYaml" />
        </button>
        <button type="button" className="btn ghost" onClick={() => setInput(SAMPLE)}>
          <Tx id="example" />
        </button>
      </div>
      {ok ? (
        <p className="msg ok" role="status">
          <Tx id="json.valid" />
        </p>
      ) : null}
      {error ? (
        <p className="msg bad" role="alert">
          <Tx id="json.bad" /> <span className="break">{error}</span>
        </p>
      ) : null}
      <label className="field">
        <span className="field-label">
          <Tx id="output" />
        </span>
        <textarea readOnly value={output} rows={8} spellCheck={false} />
      </label>
      <CopyButton text={output} />
    </div>
  );
}
