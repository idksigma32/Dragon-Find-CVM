"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme/theme";

const ThemeModeContext = createContext({ mode: "light", setMode: () => {} });

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function MuiThemeProvider({ children }) {
  const [preference, setPreference] = useState("system");
  const [systemMode, setSystemMode] = useState("light");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("findit-theme");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemMode = () => setSystemMode(media.matches ? "dark" : "light");
    updateSystemMode();
    media.addEventListener("change", updateSystemMode);
    if (saved === "light" || saved === "dark" || saved === "system") setPreference(saved);
    setReady(true);
    return () => media.removeEventListener("change", updateSystemMode);
  }, []);
  useEffect(() => {
    if (ready) window.localStorage.setItem("findit-theme", preference);
  }, [preference, ready]);
  const mode = preference === "system" ? systemMode : preference;
  const theme = useMemo(() => getTheme(mode), [mode]);
  return <ThemeModeContext.Provider value={{ mode: preference, setMode: setPreference }}>
    <ThemeProvider theme={theme}><CssBaseline /><div data-theme-mode={mode} style={{ minHeight: "100vh" }}>{children}</div></ThemeProvider>
  </ThemeModeContext.Provider>;
}
