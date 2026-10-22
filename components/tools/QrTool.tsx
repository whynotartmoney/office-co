"use client";

import { useEffect, useState } from "react";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";

export default function QrTool() {
  const t = useCopy();
  const [text, setText] = useState("https://office-co.vercel.app");
  const [drawn, setDrawn] = useState<{ text: string; url: string; error: boolean } | null>(null);
  const trimmed = text.trim();

  useEffect(() => {
    if (!trimmed) return;
    let cancel = false;
    void import("qrcode")
      .then((QR) => QR.toDataURL(trimmed, { margin: 1, width: 480, errorCorrectionLevel: "M" }))
      .then((dataUrl) => {
        if (!cancel) setDrawn({ text: trimmed, url: dataUrl, error: false });
      })
      .catch(() => {
        if (!cancel) setDrawn({ text: trimmed, url: "", error: true });
      });
    return () => {
      cancel = true;
    };
  }, [trimmed]);

  const current = drawn?.text === trimmed ? drawn : null;

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="qr.input" />
        </span>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t["qr.hint"]} rows={4} />
      </label>
      {!text.trim() ? (
        <p className="hint">
          <Tx id="qr.hint" />
        </p>
      ) : null}
      {current?.error ? (
        <p className="msg bad" role="alert">
          <Tx id="qr.bad" />
        </p>
      ) : null}
      {current?.url ? (
        <div className="qr-plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.url} alt={trimmed} width={240} height={240} />
          <a className="btn" href={current.url} download="office-co-qr.png">
            <Tx id="qr.download" />
          </a>
        </div>
      ) : null}
    </div>
  );
}
