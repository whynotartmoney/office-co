"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Tx } from "@/components/Tx";
import { gradeContrast, parseHex, toHex, type RGB } from "@/lib/contrast";

export default function ContrastTool() {
  const [fg, setFg] = useState("#1A1A17");
  const [bg, setBg] = useState("#E4E4E0");
  const foreground = useMemo(() => parseHex(fg), [fg]);
  const background = useMemo(() => parseHex(bg), [bg]);
  const grade = foreground && background ? gradeContrast(foreground, background) : null;

  return (
    <div className="stack">
      <div className="split">
        <ColorField id="contrast.fg" value={fg} rgb={foreground} onChange={setFg} />
        <ColorField id="contrast.bg" value={bg} rgb={background} onChange={setBg} />
      </div>
      <div className="row">
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            setFg(bg);
            setBg(fg);
          }}
        >
          <Tx id="contrast.swap" />
        </button>
      </div>
      {!foreground || !background || !grade ? (
        <p className="msg bad" role="alert">
          <Tx id="contrast.bad" />
        </p>
      ) : (
        <>
          <p className="result">
            <span className="field-label">
              <Tx id="contrast.ratio" />
            </span>
            {grade.ratio.toFixed(2)} : 1
          </p>
          <ul className="grades">
            <Grade ok={grade.aaNormal} label={<Tx id="contrast.aaN" />} />
            <Grade ok={grade.aaLarge} label={<Tx id="contrast.aaL" />} />
            <Grade ok={grade.aaaNormal} label={<Tx id="contrast.aaaN" />} />
            <Grade ok={grade.aaaLarge} label={<Tx id="contrast.aaaL" />} />
          </ul>
          <p className="hint">
            <Tx id="contrast.note" />
          </p>
          <div className="swatches">
            <p style={{ background: toHex(background), color: toHex(foreground) }}>
              <Tx id="contrast.sample" />
            </p>
            <p style={{ background: toHex(foreground), color: toHex(background) }}>
              <Tx id="contrast.sample" />
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ColorField({
  id,
  value,
  rgb,
  onChange,
}: {
  id: "contrast.fg" | "contrast.bg";
  value: string;
  rgb: RGB | null;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">
        <Tx id={id} />
      </span>
      <span className="color-row">
        <input
          type="color"
          value={rgb ? toHex(rgb) : "#000000"}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          />
        <input value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
      </span>
    </label>
  );
}

function Grade({ ok, label }: { ok: boolean; label: ReactNode }) {
  return (
    <li className={ok ? "pass" : "fail"}>
      {label}
      <strong>{ok ? <Tx id="contrast.pass" /> : <Tx id="contrast.fail" />}</strong>
    </li>
  );
}
