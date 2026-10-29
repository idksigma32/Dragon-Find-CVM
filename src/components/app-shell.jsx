"use client";

import { Box } from "@mui/material";
import { Navbar, SidebarProvider, useSidebar } from "@/components/navbar";

export function AppShell({ children }) {
  return (
    <SidebarProvider>
      <Navbar />
      <ShellMain>{children}</ShellMain>
    </SidebarProvider>
  );
}

function ShellMain({ children }) {
  const { collapsed } = useSidebar();

  return (
    <Box
      component="main"
      sx={{
        ml: { xs: 0, md: collapsed ? "76px" : "252px" },
        minHeight: "100vh",
        transition: "margin 180ms ease",
      }}
    >
      {children}
    </Box>
  );
}
