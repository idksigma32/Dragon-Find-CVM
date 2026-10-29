import { createTheme } from "@mui/material/styles";

export function getTheme(mode = "light") {
  const dark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? "#8DBFA7" : "#246856", contrastText: dark ? "#19312C" : "#FFFFFF" },
      secondary: { main: "#8DBFA7", contrastText: "#19312C" },
      background: { default: dark ? "#10251F" : "#F8FAF8", paper: dark ? "#17352D" : "#FFFFFF" },
      text: { primary: dark ? "#EDF7F2" : "#19312C", secondary: dark ? "#A9C5B9" : "#648078" },
    },
    shape: { borderRadius: 14 },
    typography: { fontFamily: "var(--font-plus-jakarta), Arial, sans-serif", button: { textTransform: "none", fontWeight: 700 } },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 12, boxShadow: "none" } } },
      MuiCard: { styleOverrides: { root: { border: "1px solid", borderColor: dark ? "#315D4F" : "#DEEBE4", boxShadow: "0 8px 30px rgba(27,75,61,.06)" } } },
      MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });
}
