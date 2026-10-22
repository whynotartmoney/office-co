"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { formatLocal, formatUtc, interpretUnix, parseIso, type UnixMode } from "@/lib/time";

export default function TimestampTool() {
  const [unix, setUnix] = useState("");
  const [iso, setIso] = useState("");
  const [mode, setMode] = useState<UnixMode>("auto");
  const [source, setSource] = useState<"unix" | "iso" | "now">("unix");
  const [nowMs, setNowMs] = useState<number | null>(null);

  const parsed = useMemo(() => {
    if (source === "now") return null;
    if (source === "iso") {
      const ms = parseIso(iso);
      return ms === null ? { error: true as const } : { ms, unit: "ms" as const };
    }
    if (!unix.trim()) return null;
    const result = interpretUnix(unix, mode);
    return result ?? { error: true as const };
  }, [iso, mode, source, unix]);

  const ms = source === "now" ? nowMs : parsed && "ms" in parsed ? parsed.ms : null;
  const error = parsed && "error" in parsed;

  function stampNow() {
    const now = Date.now();
    setNowMs(now);
    setSource("now");
    setUnix(String(Math.floor(now / 1000)));
    setIso(new Date(now).toISOString());
    setMode("s");
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn" onClick={stampNow}>
          <Tx id="time.now" />
        </button>
      </div>
      <label className="field">
        <span className="field-label">
          <Tx id="time.unix" />
        </span>
        <input
          inputMode="decimal"
          value={unix}
          onChange={(event) => {
            setUnix(event.target.value);
            setSource("unix");
          }}
        />
      </label>
      <div className="chips" role="group">
        {(
          [
            ["auto", "time.auto"],
            ["s", "time.seconds"],
            ["ms", "time.millis"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="chip"
            aria-pressed={mode === id}
            onClick={() => {
              setMode(id);
              setSource("unix");
            }}
          >
            <Tx id={label} />
          </button>
        ))}
      </div>
      {source === "unix" && parsed && "unit" in parsed ? (
        <p className="hint">{parsed.unit === "s" ? <Tx id="time.asSeconds" /> : <Tx id="time.asMillis" />}</p>
      ) : null}
      <label className="field">
        <span className="field-label">
          <Tx id="time.iso" />
        </span>
        <input
          value={iso}
          onChange={(event) => {
            setIso(event.target.value);
            setSource("iso");
          }}
          placeholder="2026-10-22T00:00:00Z"
        />
      </label>
      {error ? (
        <p className="msg bad" role="alert">
          <Tx id="time.bad" />
        </p>
      ) : null}
      {ms !== null && !error ? (
        <dl className="stats">
          <Result label={<Tx id="time.local" />} value={formatLocal(ms)} />
          <Result label={<Tx id="time.utc" />} value={formatUtc(ms)} />
          <Result label={<Tx id="time.seconds" />} value={String(Math.floor(ms / 1000))} />
          <Result label={<Tx id="time.millis" />} value={String(Math.trunc(ms))} />
        </dl>
      ) : null}
    </div>
  );
}

function Result({ label, value }: { label: ReactNode; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <span className="break">{value}</span>
        <CopyButton text={value} />
      </dd>
    </div>
  );
}
