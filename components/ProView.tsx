"use client";

import { useState, type FormEvent } from "react";
import { useApp } from "@/components/Providers";
import { Tx } from "@/components/Tx";
import { validateProKey } from "@/lib/pro";

const BMC = "https://buymeacoffee.com/whynotartmoney";

type Phase = "idle" | "checking" | "invalid" | "empty" | "error" | "valid";

export function ProView() {
  const { pro, unlock, lock } = useApp();
  const [key, setKey] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [deviceNote, setDeviceNote] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function onUnlock(event: FormEvent) {
    event.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setPhase("empty");
      setDeviceNote(false);
      return;
    }
    setPhase("checking");
    setDeviceNote(false);
    setRemoved(false);
    const result = await validateProKey(trimmed);
    if (result === "valid") {
      unlock();
      setPhase("valid");
      return;
    }
    setPhase(result === "invalid" ? "invalid" : "error");
  }

  return (
    <div className="page narrow">
      <p className="kicker">
        <Tx id="filter.pro" />
      </p>
      <h1>
        <Tx id="pro.title" />
      </h1>
      <p className="lede">
        <Tx id="pro.lede" />
      </p>
      {pro ? (
        <p className="msg ok" role="status">
          <Tx id="pro.already" />
        </p>
      ) : null}
      <form className="stack" onSubmit={(event) => void onUnlock(event)}>
        <label className="field">
          <span className="field-label">
            <Tx id="pro.key" />
          </span>
          <input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            name="license"
          />
        </label>
        <div className="row">
          <button type="submit" className="btn" disabled={phase === "checking"}>
            <Tx id="pro.unlock" />
          </button>
          <button
            type="button"
            className="btn ghost"
            disabled={phase !== "valid"}
            onClick={() => {
              unlock();
              setDeviceNote(true);
            }}
          >
            <Tx id="pro.device" />
          </button>
        </div>
        <p className="hint">
          <Tx id="pro.note" />
        </p>
        {phase === "checking" ? (
          <p className="msg" role="status">
            <Tx id="pro.checking" />
          </p>
        ) : null}
        {phase === "empty" ? (
          <p className="msg bad" role="alert">
            <Tx id="pro.empty" />
          </p>
        ) : null}
        {phase === "invalid" ? (
          <p className="msg bad" role="alert">
            <Tx id="pro.invalid" />
          </p>
        ) : null}
        {phase === "error" ? (
          <p className="msg bad" role="alert">
            <Tx id="pro.error" />
          </p>
        ) : null}
        {phase === "valid" ? (
          <p className="msg ok" role="status">
            <Tx id="pro.ok" />
          </p>
        ) : null}
        {deviceNote ? (
          <p className="msg ok" role="status">
            <Tx id="pro.deviceOk" />
          </p>
        ) : null}
      </form>
      {pro ? (
        <div className="row">
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              lock();
              setRemoved(true);
              setDeviceNote(false);
              setPhase("idle");
            }}
          >
            <Tx id="pro.remove" />
          </button>
        </div>
      ) : null}
      {removed ? (
        <p className="msg" role="status">
          <Tx id="pro.removed" />
        </p>
      ) : null}
      <p className="lede">
        <Tx id="pro.bmc" />
      </p>
      <a className="bmc" href={BMC} target="_blank" rel="noreferrer">
        <Tx id="bmc" />
      </a>
    </div>
  );
}
