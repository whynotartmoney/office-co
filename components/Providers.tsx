"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  clearPro,
  nextTheme,
  readLang,
  readPro,
  readTheme,
  subscribeStore,
  writeLang,
  writePro,
  writeTheme,
  type Lang,
  type Theme,
} from "@/lib/storage";

type AppContextValue = {
  lang: Lang;
  pro: boolean;
  ready: boolean;
  theme: Theme;
  cycleTheme: () => void;
  setLanguage: (lang: Lang) => void;
  unlock: () => void;
  lock: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function applyDocument(theme: Theme, lang: Lang, pro: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.lang = lang;
  root.setAttribute("data-pro", pro ? "on" : "off");
}

function serverLang(): Lang {
  return "en";
}

function serverTheme(): Theme {
  return "silver";
}

function serverOff(): boolean {
  return false;
}

function clientOn(): boolean {
  return true;
}

function subscribeReady(): () => void {
  return () => {};
}

export function Providers({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeStore, readLang, serverLang);
  const pro = useSyncExternalStore(subscribeStore, readPro, serverOff);
  const theme = useSyncExternalStore(subscribeStore, readTheme, serverTheme);
  const ready = useSyncExternalStore(subscribeReady, clientOn, serverOff);

  useLayoutEffect(() => {
    applyDocument(readTheme(), readLang(), readPro());
  }, []);

  const cycleTheme = useCallback(() => {
    const upcoming = nextTheme(document.documentElement.getAttribute("data-theme"));
    document.documentElement.setAttribute("data-theme", upcoming);
    writeTheme(upcoming);
  }, []);

  const setLanguage = useCallback((upcoming: Lang) => {
    document.documentElement.lang = upcoming;
    writeLang(upcoming);
  }, []);

  const unlock = useCallback(() => {
    document.documentElement.setAttribute("data-pro", "on");
    writePro();
  }, []);

  const lock = useCallback(() => {
    document.documentElement.setAttribute("data-pro", "off");
    clearPro();
  }, []);

  const value = useMemo(
    () => ({ lang, pro, ready, theme, cycleTheme, setLanguage, unlock, lock }),
    [lang, pro, ready, theme, cycleTheme, setLanguage, unlock, lock],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within Providers");
  return value;
}
