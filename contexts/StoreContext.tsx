"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type StoreFilter = "2064" | "2056" | "both";

export const THEME_COLORS: Record<StoreFilter, string> = {
  "2064": "#0066CC",
  "2056": "#00A651",
  both: "#818cf8",
};

interface StoreContextType {
  store: StoreFilter;
  setStore: (s: StoreFilter) => void;
  themeColor: string;
}

const StoreContext = createContext<StoreContextType>({
  store: "2064",
  setStore: () => {},
  themeColor: THEME_COLORS["2064"],
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStoreRaw] = useState<StoreFilter>("2064");

  useEffect(() => {
    const saved = localStorage.getItem("store") as StoreFilter | null;
    if (saved && ["2064", "2056", "both"].includes(saved)) setStoreRaw(saved);
  }, []);

  const setStore = (s: StoreFilter) => {
    setStoreRaw(s);
    localStorage.setItem("store", s);
  };

  return (
    <StoreContext.Provider value={{ store, setStore, themeColor: THEME_COLORS[store] }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
