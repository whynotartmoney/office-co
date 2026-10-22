"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { generatePassword, type PasswordSets } from "@/lib/password";

const INITIAL: PasswordSets = { upper: true, lower: true, digits: true, symbols: true };

export default function PasswordTool() {
  const [length, setLength] = useState(16);
  const [sets, setSets] = useState<PasswordSets>(INITIAL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function toggle(key: keyof PasswordSets) {
    setSets((current) => {
      const next = { ...current, [key]: !current[key] };
      if (!next.upper && !next.lower && !next.digits && !next.symbols) return current;
      return next;
    });
  }

  function make() {
    try {
      const size = Math.min(128, Math.max(4, Math.round(length) || 4));
      setLength(size);
      setPassword(generatePassword(size, sets));
      setError(false);
    } catch {
      setPassword("");
      setError(true);
    }
  }

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="pw.length" /> {length}
        </span>
        <input
          type="range"
          min={4}
          max={64}
          value={Math.min(64, Math.max(4, length))}
          onChange={(event) => setLength(Number(event.target.value))}
        />
      </label>
      <div className="chips" role="group">
        {(
          [
            ["upper", "pw.upper"],
            ["lower", "pw.lower"],
            ["digits", "pw.digits"],
            ["symbols", "pw.symbols"],
          ] as const
        ).map(([key, label]) => (
          <button key={key} type="button" className="chip" aria-pressed={sets[key]} onClick={() => toggle(key)}>
            <Tx id={label} />
          </button>
        ))}
      </div>
      <div className="row">
        <button type="button" className="btn" onClick={make}>
          <Tx id="pw.generate" />
        </button>
        <CopyButton text={password} />
      </div>
      {error ? (
        <p className="msg bad">
          <Tx id="pw.need" />
        </p>
      ) : null}
      <output className="password">{password || "—"}</output>
    </div>
  );
}
