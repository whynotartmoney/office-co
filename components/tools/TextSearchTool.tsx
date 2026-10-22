"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import { highlightSpans, matchCount } from "@/lib/highlight";

const LIMIT = 200_000;
const DEFAULT_COLOR = "#ffe14a";

export default function TextSearchTool() {
  const t = useCopy();
  const back = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  function align() {
    const layer = back.current;
    const field = area.current;
    if (!layer || !field) return;
    const bar = field.offsetWidth - field.clientWidth;
    layer.style.paddingRight = `${12 + bar}px`;
    layer.scrollTop = field.scrollTop;
    layer.scrollLeft = field.scrollLeft;
  }

  useLayoutEffect(() => {
    align();
  });
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [sensitive, setSensitive] = useState(false);
  const trimmed = text.length > LIMIT;
  const source = trimmed ? text.slice(0, LIMIT) : text;
  const spans = useMemo(() => highlightSpans(source, query, sensitive), [source, query, sensitive]);
  const count = matchCount(spans);
  const mark = `color-mix(in srgb, ${color} 78%, transparent)`;

  return (
    <div className="stack">
      <div className="row">
        <label className="field">
          <span className="field-label">
            <Tx id="search.query" />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t["search.find"]}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="field inline">
          <span className="field-label">
            <Tx id="search.color" />
          </span>
          <span className="color-row">
            <input
              type="color"
              value={color}
              aria-label={t["search.color"]}
              onChange={(event) => setColor(event.target.value)}
            />
            <output>{color}</output>
          </span>
        </label>
        <button type="button" className="chip" aria-pressed={sensitive} onClick={() => setSensitive((value) => !value)}>
          <Tx id="search.case" />
        </button>
      </div>
      <p className="hint" aria-live="polite">
        {query ? (
          count === 0 ? (
            <Tx id="search.none" />
          ) : (
            <>
              <Tx id="search.matches" /> {count}
            </>
          )
        ) : (
          <Tx id="search.hint" />
        )}
      </p>
      {trimmed ? (
        <p className="hint">
          <Tx id="search.trimmed" />
        </p>
      ) : null}
      <label className="field">
        <span className="field-label">
          <Tx id="search.input" />
        </span>
        <div className="search-editor">
          <div className="search-back" ref={back} aria-hidden="true">
            {spans.map((span, index) =>
              span.match ? (
                <mark key={index} style={{ backgroundColor: mark }}>
                  {span.text}
                </mark>
              ) : (
                <span key={index}>{span.text}</span>
              ),
            )}
            {"\n"}
          </div>
          <textarea
            ref={area}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onScroll={align}
            placeholder={t["search.paste"]}
            spellCheck={false}
          />
        </div>
      </label>
    </div>
  );
}
