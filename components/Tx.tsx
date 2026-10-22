import { copy, type CopyKey } from "@/lib/i18n";

export function Tx({ id }: { id: CopyKey }) {
  return (
    <>
      <span className="en">{copy.en[id]}</span>
      <span className="zh">{copy.zh[id]}</span>
    </>
  );
}

export function Bi({ en, zh }: { en: string; zh: string }) {
  return (
    <>
      <span className="en">{en}</span>
      <span className="zh">{zh}</span>
    </>
  );
}
