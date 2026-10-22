"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useApp } from "@/components/Providers";
import { Bi, Tx } from "@/components/Tx";
import { tools } from "@/lib/catalog";

const BMC = "https://buymeacoffee.com/whynotartmoney";

export function Frame({ children }: { children: ReactNode }) {
  const { cycleTheme, setLanguage, lang } = useApp();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const toolsLabel = useId();

  useEffect(() => {
    if (!open) return;
    const button = menuButton.current;
    const previous = document.activeElement as HTMLElement | null;
    const root = panel.current;
    const items = root ? [...root.querySelectorAll<HTMLElement>("a, button")] : [];
    items[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      (previous ?? button)?.focus();
    };
  }, [open]);

  return (
    <div className="app">
      <div className="crops" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <a className="skip" href="#content">
        <Tx id="skip" />
      </a>
      <header className="topbar">
        <Link href="/" className="wordmark">
          office-co
        </Link>
        <div className="top-actions">
          <button
            ref={menuButton}
            type="button"
            className="text-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <Tx id="menu" />
          </button>
          <button type="button" className="theme-btn" onClick={cycleTheme}>
            <span className="sr">
              <Tx id="theme" />
            </span>
            <span className="bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
          <div className="lang" role="group">
            <span className="sr">
              <Tx id="language" />
            </span>
            <button type="button" className="opt-en" aria-pressed={lang === "en"} onClick={() => setLanguage("en")}>
              EN
            </button>
            <button type="button" className="opt-zh" aria-pressed={lang === "zh"} onClick={() => setLanguage("zh")}>
              中
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <>
          <button type="button" className="scrim" onClick={() => setOpen(false)}>
            <span className="sr">
              <Tx id="close" />
            </span>
          </button>
          <div
            ref={panel}
            id="site-menu"
            className="menu-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="menu-top">
              <p id={titleId} className="kicker">
                office-co
              </p>
              <button type="button" className="text-btn" onClick={() => setOpen(false)}>
                <Tx id="close" />
              </button>
            </div>
            <nav className="menu-nav">
              <Link href="/" onClick={() => setOpen(false)}>
                <Tx id="home" />
              </Link>
              <Link href="/pro" onClick={() => setOpen(false)}>
                <Tx id="pro" />
              </Link>
              <Link href="/about" onClick={() => setOpen(false)}>
                <Tx id="about" />
              </Link>
            </nav>
            <p className="kicker" id={toolsLabel}>
              <Tx id="menu.tools" />
              <span className="menu-count">{tools.length}</span>
            </p>
            <nav className="menu-tools" aria-labelledby={toolsLabel}>
              <ul>
                {tools.map((tool, index) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/t/${tool.slug}`}
                      className={`menu-tool tier-${tool.tier}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="menu-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="menu-tool-name tool-name">
                        <Bi en={tool.name.en} zh={tool.name.zh} />
                      </span>
                      {tool.tier === "pro" ? (
                        <span className="menu-tool-marks">
                          <span className="badge pro">
                            <Tx id="filter.pro" />
                          </span>
                          <span className="lock-mark">
                            <Tx id="lock" />
                          </span>
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a className="bmc" href={BMC} target="_blank" rel="noreferrer">
              <Tx id="bmc" />
            </a>
          </div>
        </>
      ) : null}
      <main id="content">{children}</main>
      <footer className="footer">
        <p>
          <Tx id="footer.rights" /> <Tx id="footer.local" />
        </p>
        <a href={BMC} target="_blank" rel="noreferrer">
          <Tx id="bmc" />
        </a>
      </footer>
    </div>
  );
}
