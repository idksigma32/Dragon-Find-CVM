import { createTheme } from "@mui/material/styles";

export function getTheme(mode = "light") {
  const dark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? "#FFB454" : "#F28C28", contrastText: dark ? "#202124" : "#FFFFFF" },
      secondary: { main: dark ? "#F28C28" : "#FFB454", contrastText: "#202124" },
      background: { default: dark ? "#202124" : "#F7F7F5", paper: dark ? "#2C2D31" : "#FFFFFF" },
      text: { primary: dark ? "#F3F4F6" : "#202124", secondary: dark ? "#A9ABB2" : "#666A70" },
      divider: dark ? "#45464B" : "#E4E5E2",
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: "var(--font-plus-jakarta), Arial, sans-serif", button: { textTransform: "none", fontWeight: 700 } },
    components: {
      MuiCssBaseline: { styleOverrides: { "*:focus-visible": { outline: `3px solid ${dark ? "#FFB454" : "#C96A00"}`, outlineOffset: 2 }, "@media (prefers-reduced-motion: reduce)": { "*, *::before, *::after": { animationDuration: "0.01ms !important", animationIterationCount: "1 !important", transitionDuration: "0.01ms !important", scrollBehavior: "auto !important" } } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 12, boxShadow: "none" } } },
      MuiCard: { styleOverrides: { root: { border: "1px solid", borderColor: dark ? "#45464B" : "#E4E5E2", boxShadow: dark ? "0 8px 30px rgba(0,0,0,.18)" : "0 8px 30px rgba(32,33,36,.06)" } } },
      MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiDrawer: { styleOverrides: { paper: { backgroundImage: "none" } } },
    },
  });
}
