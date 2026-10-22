"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import { chineseAmount, type AmountCode } from "@/lib/amount";

const errors: Record<Exclude<AmountCode, "empty">, "amount.bad" | "amount.decimals" | "amount.range"> = {
  invalid: "amount.bad",
  decimals: "amount.decimals",
  range: "amount.range",
};

export default function CnAmountTool() {
  const t = useCopy();
  const [raw, setRaw] = useState("12345.67");
  const result = chineseAmount(raw);
  const text = result.ok ? result.text : "";

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="amount.input" />
        </span>
        <input
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          placeholder={t["amount.placeholder"]}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <p className="hint">
        <Tx id="amount.hint" />
      </p>
      {!result.ok && result.code !== "empty" ? (
        <p className="msg bad" role="alert">
          <Tx id={errors[result.code]} />
        </p>
      ) : null}
      <div className="plate stack">
        <p className="amount-out">
          <span className="field-label">
            <Tx id="output" />
          </span>
          {text || "—"}
        </p>
        <CopyButton text={text} />
      </div>
    </div>
  );
}
