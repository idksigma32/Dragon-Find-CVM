"use client";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme/theme";

export function MuiThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => getTheme(mode), [mode]);
  return <ThemeProvider theme={theme}><CssBaseline /><div data-theme-mode={mode} style={{ minHeight: "100vh" }}>{children}</div></ThemeProvider>;
}
