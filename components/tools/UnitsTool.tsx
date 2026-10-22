"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import type { CopyKey } from "@/lib/i18n";
import { convertUnits, formatMeasure, UNIT_IDS, type UnitCategory } from "@/lib/units";

const CATEGORIES: { id: UnitCategory; label: CopyKey }[] = [
  { id: "length", label: "units.length" },
  { id: "weight", label: "units.weight" },
  { id: "temp", label: "units.temp" },
  { id: "area", label: "units.area" },
];

export default function UnitsTool() {
  const t = useCopy();
  const [category, setCategory] = useState<UnitCategory>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [raw, setRaw] = useState("1");
  const units = UNIT_IDS[category];
  const value = Number(raw);
  const result = useMemo(() => convertUnits(category, value, from, to), [category, from, to, value]);
  const formatted = formatMeasure(result);

  function changeCategory(next: UnitCategory) {
    setCategory(next);
    const ids = UNIT_IDS[next];
    setFrom(ids[0]);
    setTo(ids[Math.min(1, ids.length - 1)]);
  }

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="units.category" />
        </span>
        <select value={category} onChange={(event) => changeCategory(event.target.value as UnitCategory)}>
          {CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {t[item.label]}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field-label">
          <Tx id="units.value" />
        </span>
        <input inputMode="decimal" value={raw} onChange={(event) => setRaw(event.target.value)} />
      </label>
      <div className="split">
        <UnitSelect id="units.from" units={units} value={from} onChange={setFrom} />
        <UnitSelect id="units.to" units={units} value={to} onChange={setTo} />
      </div>
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          setFrom(to);
          setTo(from);
        }}
      >
        <Tx id="units.swap" />
      </button>
      <p className="result">
        <span className="field-label">
          <Tx id="units.result" />
        </span>
        {formatted}
      </p>
      <CopyButton text={formatted === "—" ? "" : formatted} />
    </div>
  );
}

function UnitSelect({
  id,
  units,
  value,
  onChange,
}: {
  id: "units.from" | "units.to";
  units: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useCopy();
  return (
    <label className="field">
      <span className="field-label">
        <Tx id={id} />
      </span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {t[`u.${unit}` as CopyKey]} ({unit})
          </option>
        ))}
      </select>
    </label>
  );
}
