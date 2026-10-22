"use client";

import { useState } from "react";
import { Tx } from "@/components/Tx";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

export function CopyButton({ text, id = "copy" }: { text: string; id?: "copy" | "uuid.copyAll" | "md.copyHtml" }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn ghost"
      disabled={text.length === 0}
      onClick={() => {
        void copyText(text).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1400);
        });
      }}
    >
      {done ? <Tx id="copied" /> : <Tx id={id} />}
    </button>
  );
}
