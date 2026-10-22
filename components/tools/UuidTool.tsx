"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";

function batch(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export default function UuidTool() {
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);

  return (
    <div className="stack">
      <div className="row">
        <label className="field inline">
          <span className="field-label">
            <Tx id="uuid.count" />
          </span>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const next = Math.min(50, Math.max(1, Math.round(count) || 1));
            setCount(next);
            setIds(batch(next));
          }}
        >
          <Tx id="uuid.generate" />
        </button>
        <CopyButton text={ids.join("\n")} id="uuid.copyAll" />
      </div>
      {ids.length === 0 ? (
        <p className="hint">
          <Tx id="uuid.empty" />
        </p>
      ) : (
        <ul className="uuid-list">
          {ids.map((id) => (
            <li key={id}>
              <code>{id}</code>
              <CopyButton text={id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
