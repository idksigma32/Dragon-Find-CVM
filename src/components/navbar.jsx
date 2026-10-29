"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { AccountCircle, Explore, Logout, Menu as MenuIcon, Close } from "@mui/icons-material";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Items" },
  { href: "/report", label: "Report Item" },
  { href: "/dashboard", label: "My Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [anchor, setAnchor] = useState(null);
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
    setAnchor(null);
  }
  const username = user?.email?.split("@")[0] || "Account";
  const initial = username.charAt(0).toUpperCase();
  return <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.default", backdropFilter: "blur(10px)" }}>
    <Toolbar sx={{ maxWidth: 1280, width: "100%", mx: "auto", px: { xs: 2, lg: 3 }, minHeight: 76 }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexGrow: 1 }}>
        <Box sx={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 3, bgcolor: "primary.main", color: "primary.contrastText" }}><Explore /></Box>
        <Typography variant="h6" fontWeight={800} color="primary.main">Find<span style={{ color: "inherit" }}>It</span></Typography>
      </Link>
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>{links.map((link) => <Button key={link.href} component={Link} href={link.href} color={pathname === link.href ? "primary" : "inherit"} variant={pathname === link.href ? "contained" : "text"} sx={{ borderRadius: 2 }}>{link.label}</Button>)}</Box>
      <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, gap: 1 }}>
        {user ? <><Button onClick={(e) => setAnchor(e.currentTarget)} startIcon={<Avatar sx={{ width: 26, height: 26, bgcolor: "secondary.main", color: "secondary.contrastText" }}>{initial}</Avatar>} color="inherit">{username}</Button><Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}><MenuItem disabled>{user.email}</MenuItem><Divider /><MenuItem component={Link} href="/dashboard" onClick={() => setAnchor(null)}><AccountCircle sx={{ mr: 1 }} />Dashboard</MenuItem><MenuItem onClick={signOut}><Logout sx={{ mr: 1 }} />Sign out</MenuItem></Menu></> : <><Button component={Link} href="/sign-in" color="inherit">Sign in</Button><Button component={Link} href="/sign-up" variant="contained">Get started</Button></>}
      </Box>
      <IconButton onClick={() => setDrawer(true)} sx={{ display: { xs: "inline-flex", md: "none" } }} aria-label="Open navigation"><MenuIcon /></IconButton>
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}><Box sx={{ width: 290, p: 2 }} role="presentation"><Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}><Typography variant="h6" color="primary" fontWeight={800}>FindIt</Typography><IconButton onClick={() => setDrawer(false)}><Close /></IconButton></Box><List>{links.map((link) => <ListItem key={link.href} disablePadding><ListItemButton component={Link} href={link.href} selected={pathname === link.href} onClick={() => setDrawer(false)}><ListItemText primary={link.label} /></ListItemButton></ListItem>)}</List><Divider sx={{ my: 2 }} />{user ? <Button fullWidth variant="outlined" startIcon={<Logout />} onClick={signOut}>Sign out</Button> : <Box sx={{ display: "flex", gap: 1 }}><Button fullWidth component={Link} href="/sign-in" variant="outlined">Sign in</Button><Button fullWidth component={Link} href="/sign-up" variant="contained">Join</Button></Box>}</Box></Drawer>
    </Toolbar>
  </AppBar>;
}
