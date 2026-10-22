"use client";

import { useState, type ReactNode } from "react";
import { Tx } from "@/components/Tx";
import { adjustByPercent, formatPercentResult, percentChange, percentOf, whatPercent } from "@/lib/percent";

function num(raw: string): number | null {
  if (raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export default function PercentageTool() {
  const [percent, setPercent] = useState("20");
  const [total, setTotal] = useState("80");
  const [part, setPart] = useState("20");
  const [whole, setWhole] = useState("80");
  const [from, setFrom] = useState("40");
  const [to, setTo] = useState("50");
  const [base, setBase] = useState("80");
  const [delta, setDelta] = useState("10");
  const [direction, setDirection] = useState<"add" | "sub">("add");

  const ofValue = percentOf(num(percent) ?? NaN, num(total) ?? NaN);
  const what = whatPercent(num(part) ?? NaN, num(whole) ?? NaN);
  const change = percentChange(num(from) ?? NaN, num(to) ?? NaN);
  const adjusted = adjustByPercent(num(base) ?? NaN, num(delta) ?? NaN, direction);

  return (
    <div className="stack">
      <section className="plate">
        <h2>
          <Tx id="percent.of" />
        </h2>
        <div className="split">
          <Num label={<Tx id="percent.x" />} value={percent} onChange={setPercent} />
          <Num label={<Tx id="percent.y" />} value={total} onChange={setTotal} />
        </div>
        <p className="result">{formatPercentResult(ofValue)}</p>
      </section>
      <section className="plate">
        <h2>
          <Tx id="percent.what" />
        </h2>
        <div className="split">
          <Num label={<Tx id="percent.part" />} value={part} onChange={setPart} />
          <Num label={<Tx id="percent.whole" />} value={whole} onChange={setWhole} />
        </div>
        <p className="result">{formatPercentResult(what)}%</p>
      </section>
      <section className="plate">
        <h2>
          <Tx id="percent.change" />
        </h2>
        <div className="split">
          <Num label={<Tx id="percent.from" />} value={from} onChange={setFrom} />
          <Num label={<Tx id="percent.to" />} value={to} onChange={setTo} />
        </div>
        <p className="result">{formatPercentResult(change)}%</p>
      </section>
      <section className="plate">
        <h2>
          <Tx id="percent.adjust" />
        </h2>
        <div className="split">
          <Num label={<Tx id="percent.base" />} value={base} onChange={setBase} />
          <Num label={<Tx id="percent.x" />} value={delta} onChange={setDelta} />
        </div>
        <div className="chips" role="group">
          <button type="button" className="chip" aria-pressed={direction === "add"} onClick={() => setDirection("add")}>
            <Tx id="percent.add" />
          </button>
          <button type="button" className="chip" aria-pressed={direction === "sub"} onClick={() => setDirection("sub")}>
            <Tx id="percent.sub" />
          </button>
        </div>
        <p className="result">{formatPercentResult(adjusted)}</p>
      </section>
    </div>
  );
}

function Num({ label, value, onChange }: { label: ReactNode; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
