"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Bi, Tx } from "@/components/Tx";
import { useCopy } from "@/components/useCopy";
import { getTool, tools, type Tool } from "@/lib/catalog";
import { readLastTool, subscribeStore } from "@/lib/storage";

type Filter = "all" | "free" | "pro";

function emptyLast(): string | null {
  return null;
}

function matches(tool: Tool, needle: string): boolean {
  if (!needle) return true;
  const haystack = `${tool.slug} ${tool.name.en} ${tool.name.zh} ${tool.blurb.en} ${tool.blurb.zh}`.toLowerCase();
  return haystack.includes(needle);
}

export function HomeView() {
  const t = useCopy();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const last = useSyncExternalStore(subscribeStore, readLastTool, emptyLast);

  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => {
    return tools.filter((tool) => (filter === "all" || tool.tier === filter) && matches(tool, needle));
  }, [filter, needle]);
  const counts = useMemo(
    () => ({
      all: tools.filter((tool) => matches(tool, needle)).length,
      free: tools.filter((tool) => tool.tier === "free" && matches(tool, needle)).length,
      pro: tools.filter((tool) => tool.tier === "pro" && matches(tool, needle)).length,
    }),
    [needle],
  );

  const resume = last ? getTool(last) : undefined;

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-kicker">
          <p className="kicker">
            <Tx id="kicker" />
          </p>
          <span className="hero-count" aria-hidden="true">
            16
          </span>
        </div>
        <h1 className="wordmark-hero">office-co</h1>
        <p className="lede">
          <Tx id="lede" />
        </p>
      </section>
      {resume ? (
        <p className="resume">
          <span>
            <Tx id="resume" />
          </span>
          <Link href={`/t/${resume.slug}`}>
            <Bi en={resume.name.en} zh={resume.name.zh} />
          </Link>
        </p>
      ) : null}
      <div className="controls">
        <label className="search">
          <span className="sr">
            <Tx id="search.label" />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t["search.placeholder"]}
            type="search"
            enterKeyHint="search"
          />
        </label>
        <div className="chips" role="group">
          {(
            [
              ["all", "filter.all"],
              ["free", "filter.free"],
              ["pro", "filter.pro"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              <Tx id={label} />
              <span className="chip-count">{counts[id]}</span>
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="empty">
          <Tx id="empty" />
        </p>
      ) : (
        <ul className="grid">
          {visible.map((tool) => {
            const index = tools.findIndex((item) => item.slug === tool.slug) + 1;
            return (
              <li key={tool.slug}>
                <Link href={`/t/${tool.slug}`} className={`card tier-${tool.tier}`}>
                  <span className="card-index">{String(index).padStart(2, "0")}</span>
                  <span className="card-body">
                    <h2>
                      <Bi en={tool.name.en} zh={tool.name.zh} />
                    </h2>
                    <p>
                      <Bi en={tool.blurb.en} zh={tool.blurb.zh} />
                    </p>
                  </span>
                  <span className="card-meta">
                    {tool.tier === "pro" ? (
                      <span className="badge pro">Pro</span>
                    ) : (
                      <span className="badge">
                        <Tx id="free" />
                      </span>
                    )}
                    {tool.tier === "pro" ? (
                      <span className="lock-mark">
                        <Tx id="lock" />
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
