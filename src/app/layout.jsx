import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { MuiThemeProvider } from "@/components/mui-theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
export const metadata = { title: "FindIt — School Lost & Found", description: "A simpler way to reconnect students with their lost belongings." };
export default function RootLayout({ children }) {
  return <html lang="en"><body className={jakarta.variable}><AppRouterCacheProvider options={{ enableCssLayer: true }}><MuiThemeProvider><Navbar />{children}</MuiThemeProvider></AppRouterCacheProvider></body></html>;
}
