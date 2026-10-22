"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import { decodeBase64, encodeBase64 } from "@/lib/text";

export default function Base64Tool() {
  const t = useCopy();
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="b64.input" />
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t["b64.placeholder"]}
          rows={6}
        />
      </label>
      <div className="row">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setError(false);
            setOutput(encodeBase64(text));
          }}
        >
          <Tx id="b64.encode" />
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            try {
              setOutput(decodeBase64(text));
              setError(false);
            } catch {
              setOutput("");
              setError(true);
            }
          }}
        >
          <Tx id="b64.decode" />
        </button>
        <CopyButton text={output} />
      </div>
      {error ? (
        <p className="msg bad" role="alert">
          <Tx id="b64.bad" />
        </p>
      ) : null}
      <label className="field">
        <span className="field-label">
          <Tx id="output" />
        </span>
        <textarea readOnly value={output} rows={6} />
      </label>
    </div>
  );
}
