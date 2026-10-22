"use client";

import { useMemo, useState } from "react";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import { readingLabel, textStats } from "@/lib/text";

const LIMIT = 200_000;

export default function WordCounter() {
  const [text, setText] = useState("");
  const t = useCopy();
  const limited = text.length > LIMIT ? text.slice(0, LIMIT) : text;
  const stats = useMemo(() => textStats(limited), [limited]);

  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">
          <Tx id="word.input" />
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t["word.placeholder"]}
          rows={8}
        />
      </label>
      {text.length > LIMIT ? (
        <p className="hint">
          <Tx id="word.trimmed" />
        </p>
      ) : null}
      <dl className="stats">
        <div>
          <dt>
            <Tx id="word.words" />
          </dt>
          <dd>{stats.words}</dd>
        </div>
        <div>
          <dt>
            <Tx id="word.chars" />
          </dt>
          <dd>
            {stats.chars}
            <small>
              <Tx id="word.noSpace" /> {stats.charsNoSpace}
            </small>
          </dd>
        </div>
        <div>
          <dt>
            <Tx id="word.lines" />
          </dt>
          <dd>{stats.lines}</dd>
        </div>
        <div>
          <dt>
            <Tx id="word.reading" />
          </dt>
          <dd>
            {readingLabel(stats.minutes)} <small><Tx id="word.min" /></small>
          </dd>
        </div>
      </dl>
    </div>
  );
}
