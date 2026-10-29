"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import {
  Add, Brightness4, Brightness7, Dashboard, Explore, Help, Logout,
  Menu as MenuIcon, NotificationsNone, ChevronLeft, ChevronRight,
  BarChart, Bookmark, History, AutoAwesome, Assessment, Inventory2,
  Flag, Archive, Person, Settings, Home
} from "@mui/icons-material";
import {
  Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Tooltip, Typography, useMediaQuery
} from "@mui/material";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useThemeMode } from "@/components/mui-theme-provider";
import { useMockData } from "@/lib/mock-store";

const SidebarContext = createContext({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarContext);

const groups = [
  {
    label: "Explore",
    links: [
      { href: "/", label: "Home", icon: <Home /> },
      { href: "/lost-found", label: "School overview", icon: <Dashboard /> },
      { href: "/browse", label: "Browse items", icon: <Explore /> },
      { href: "/report", label: "Report an item", icon: <Add /> },
      { href: "/matches", label: "Suggested matches", icon: <AutoAwesome /> },
      { href: "/activity", label: "Activity feed", icon: <History /> },
      { href: "/statistics", label: "Statistics", icon: <BarChart /> },
    ],
  },
  {
    label: "My space",
    links: [
      { href: "/dashboard", label: "My dashboard", icon: <Person />, badgeKey: "notifications" },
      { href: "/claims", label: "My claims", icon: <Assessment /> },
      { href: "/saved", label: "Saved items", icon: <Bookmark /> },
      { href: "/recent", label: "Recently viewed", icon: <History /> },
      { href: "/notifications", label: "Notifications", icon: <NotificationsNone />, badgeKey: "notifications" },
      { href: "/profile", label: "Profile", icon: <Person /> },
      { href: "/settings", label: "Settings", icon: <Settings /> },
    ],
  },
  {
    label: "Staff management",
    links: [
      { href: "/staff", label: "Staff overview", icon: <Inventory2 /> },
      { href: "/staff/claims", label: "Claim verification", icon: <Assessment /> },
      { href: "/staff/inventory", label: "Inventory", icon: <Inventory2 /> },
      { href: "/staff/moderation", label: "Moderation", icon: <Flag /> },
      { href: "/staff/archive", label: "Archive", icon: <Archive /> },
    ],
  },
  {
    label: "Support",
    links: [
      { href: "/help", label: "Help center", icon: <Help /> },
      { href: "/sign-in", label: "Sign in", icon: <Person /> },
      { href: "/sign-up", label: "Create account", icon: <Add /> },
    ],
  },
];

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsedState] = useState(false);
  const { settings } = useMockData();
  useEffect(() => { setCollapsedState(settings.sidebarExpanded === false); }, [settings.sidebarExpanded]);
  function setCollapsed(value) {
    const next = typeof value === "function" ? value(collapsed) : value;
    setCollapsedState(next);
    if (typeof window !== "undefined") {
      try {
        const key = "findit-mock-v2";
        const data = JSON.parse(window.localStorage.getItem(key) || "{}");
        data.settings = { ...(data.settings || {}), sidebarExpanded: !next };
        window.localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new Event("findit-data-changed"));
      } catch {
        // The store remains the source of truth if local storage is unavailable.
      }
    }
  }
  return <SidebarContext.Provider value={{ collapsed, setCollapsed }}>{children}</SidebarContext.Provider>;
}

export function Navbar() {
  const pathname = usePathname();
  const mobile = useMediaQuery("(max-width:899px)");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { mode, setMode } = useThemeMode();
  const { collapsed, setCollapsed } = useSidebar();
  const { notifications } = useMockData();
  const unread = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }

  const username = user?.email?.split("@")[0] || "Guest account";
  const drawerWidth = collapsed ? 76 : 252;
  const content = <Box sx={{ width: mobile ? 252 : drawerWidth, height: "100%", display: "flex", flexDirection: "column", p: 1.5 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", minHeight: 58, px: 1 }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
        <Box sx={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 2.5, bgcolor: "primary.main", color: "primary.contrastText" }}><Explore /></Box>
        {!collapsed && <Typography variant="h6" fontWeight={800}>FindIt</Typography>}
      </Link>
      {!mobile && <IconButton size="small" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</IconButton>}
    </Box>
    <Divider sx={{ my: 1.5 }} />
    {groups.map((group) => <Box key={group.label} sx={{ mb: 1 }}>
      {!collapsed && <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, mt: 1, mb: 1, display: "block", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{group.label}</Typography>}
      <List disablePadding>{group.links.map((link) => <NavItem key={link.label} link={link} active={pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`))} collapsed={collapsed} close={() => setOpen(false)} badge={link.badgeKey === "notifications" ? unread : 0} />)}</List>
    </Box>)}
    <Box sx={{ mt: "auto" }}>
      <Divider sx={{ my: 1.5 }} />
      <Tooltip title={`Theme: ${mode}`} placement="right">
        <ListItemButton onClick={() => setMode(mode === "system" ? "light" : mode === "light" ? "dark" : "system")} sx={{ borderRadius: 2, justifyContent: collapsed ? "center" : "initial" }}>
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, color: "inherit" }}>{mode === "dark" ? <Brightness7 /> : <Brightness4 />}</ListItemIcon>
          {!collapsed && <ListItemText primary={`${mode[0].toUpperCase()}${mode.slice(1)} theme`} />}
        </ListItemButton>
      </Tooltip>
      <ListItemButton component={Link} href={user ? "/dashboard" : "/sign-in"} sx={{ borderRadius: 2, mt: .5, justifyContent: collapsed ? "center" : "initial" }}>
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, color: "inherit" }}><Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main", color: "secondary.contrastText", fontSize: 14 }}>{username[0].toUpperCase()}</Avatar></ListItemIcon>
        {!collapsed && <ListItemText primary={username} secondary={user ? "Account" : "Sign in"} />}
      </ListItemButton>
      {user && !collapsed && <ListItemButton onClick={signOut} sx={{ borderRadius: 2, mt: .5 }}><ListItemIcon sx={{ minWidth: 38 }}><Logout /></ListItemIcon><ListItemText primary="Sign out" /></ListItemButton>}
    </Box>
  </Box>;

  return <>
    {mobile && <Box sx={{ position: "fixed", zIndex: 1100, top: 12, left: 12 }}><IconButton onClick={() => setOpen(true)} aria-label="Open navigation" sx={{ bgcolor: "background.paper", boxShadow: 2 }}><MenuIcon /></IconButton></Box>}
    <Drawer variant={mobile ? "temporary" : "permanent"} open={mobile ? open : true} onClose={() => setOpen(false)} sx={{ "& .MuiDrawer-paper": { width: mobile ? 252 : drawerWidth, boxSizing: "border-box", borderRight: 1, borderColor: "divider", transition: "width 180ms ease" } }}>{content}</Drawer>
  </>;
}

function NavItem({ link, active, collapsed, close, badge = 0 }) {
  const item = <ListItemButton component={Link} href={link.href} selected={active} onClick={close} sx={{ borderRadius: 2, mb: .5, justifyContent: collapsed ? "center" : "initial", "&.Mui-selected": { bgcolor: "primary.main", color: "primary.contrastText", "& .MuiListItemIcon-root": { color: "inherit" } }, "&.Mui-selected:hover": { bgcolor: "primary.dark" } }}>
    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 38, color: active ? "inherit" : "text.secondary" }}>{link.icon}</ListItemIcon>
    {!collapsed && <ListItemText primary={link.label} />}
  </ListItemButton>;
  const withBadge = badge > 0 ? <Box sx={{ position: "relative", width: "100%" }}>{item}<Box sx={{ position: "absolute", right: collapsed ? 4 : 12, top: 4, minWidth: 17, height: 17, px: .4, borderRadius: 9, bgcolor: "error.main", color: "error.contrastText", fontSize: 10, display: "grid", placeItems: "center" }}>{badge > 9 ? "9+" : badge}</Box></Box> : item;
  return collapsed ? <Tooltip title={link.label} placement="right">{withBadge}</Tooltip> : withBadge;
}
