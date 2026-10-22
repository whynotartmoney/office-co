"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { runRegex } from "@/lib/regex";

const FLAGS = ["g", "i", "m", "s", "u"] as const;

export default function RegexTool() {
  const [pattern, setPattern] = useState("\\b[a-z]+\\b");
  const [flags, setFlags] = useState<string[]>(["g"]);
  const [text, setText] = useState("Office tools stay local.");
  const [replacement, setReplacement] = useState("[$&]");
  const [matches, setMatches] = useState<{ index: number; text: string; groups: string[] }[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [replaced, setReplaced] = useState("");
  const [error, setError] = useState(false);
  const [ran, setRan] = useState(false);

  function toggle(flag: string) {
    setFlags((current) => (current.includes(flag) ? current.filter((item) => item !== flag) : [...current, flag]));
  }

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="regex.pattern" />
        </span>
        <input value={pattern} onChange={(event) => setPattern(event.target.value)} spellCheck={false} />
      </label>
      <div className="chips" role="group">
        <span className="sr">
          <Tx id="regex.flags" />
        </span>
        {FLAGS.map((flag) => (
          <button key={flag} type="button" className="chip" aria-pressed={flags.includes(flag)} onClick={() => toggle(flag)}>
            {flag}
          </button>
        ))}
      </div>
      <label className="field">
        <span className="field-label">
          <Tx id="regex.text" />
        </span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} />
      </label>
      <label className="field">
        <span className="field-label">
          <Tx id="regex.replacement" />
        </span>
        <input value={replacement} onChange={(event) => setReplacement(event.target.value)} spellCheck={false} />
      </label>
      <button
        type="button"
        className="btn"
        onClick={() => {
          try {
            const result = runRegex(pattern, flags.join(""), text, replacement);
            setMatches(result.matches);
            setTruncated(result.truncated);
            setReplaced(result.replaced);
            setError(false);
            setRan(true);
          } catch {
            setMatches([]);
            setReplaced("");
            setTruncated(false);
            setError(true);
            setRan(true);
          }
        }}
      >
        <Tx id="regex.run" />
      </button>
      {error ? (
        <p className="msg bad" role="alert">
          <Tx id="regex.bad" />
        </p>
      ) : null}
      {ran && !error ? (
        <>
          <h2>
            <Tx id="regex.matches" /> {matches.length}
          </h2>
          {truncated ? (
            <p className="hint">
              <Tx id="regex.truncated" />
            </p>
          ) : null}
          {matches.length === 0 ? (
            <p className="hint">
              <Tx id="regex.none" />
            </p>
          ) : (
            <ul className="match-list">
              {matches.map((match, index) => (
                <li key={`${match.index}-${index}`}>
                  <span>{match.index}</span>
                  <code>{match.text}</code>
                  {match.groups.length > 0 ? <small>{match.groups.join(" · ")}</small> : null}
                </li>
              ))}
            </ul>
          )}
          <label className="field">
            <span className="field-label">
              <Tx id="regex.replaced" />
            </span>
            <textarea readOnly value={replaced} rows={5} />
          </label>
          <CopyButton text={replaced} />
        </>
      ) : null}
    </div>
  );
}
