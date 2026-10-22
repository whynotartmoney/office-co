"use client";

import { copy, type CopyKey } from "@/lib/i18n";
import { useApp } from "@/components/Providers";

export function useCopy(): (typeof copy)[keyof typeof copy] {
  const { lang } = useApp();
  return copy[lang];
}

export function useText(id: CopyKey): string {
  return useCopy()[id];
}
