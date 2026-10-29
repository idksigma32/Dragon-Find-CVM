"use client";

import { useState } from "react";
import { RestartAlt } from "@mui/icons-material";
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { resetData, updateSettings, useMockData } from "@/lib/mock-store";
import { useThemeMode } from "@/components/mui-theme-provider";

export default function SettingsPage() {
  const { settings } = useMockData();
  const { mode, setMode } = useThemeMode();
  const [preferences, setPreferences] = useState(settings);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  function change(key, value) { const next = { ...preferences, [key]: value }; setPreferences(next); updateSettings({ [key]: value }); }
  return <Box sx={{ maxWidth: 850, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="PREFERENCES" title="Settings" description="Personalize FindIt for this browser." /><Card sx={{ p: { xs: 2, md: 4 } }}><Stack spacing={3}><Box><Typography variant="h6" fontWeight={800}>Appearance</Typography><Stack direction="row" gap={1} sx={{ mt: 1 }}><Button variant={mode === "light" ? "contained" : "outlined"} onClick={() => setMode("light")}>Light</Button><Button variant={mode === "dark" ? "contained" : "outlined"} onClick={() => setMode("dark")}>Dark</Button><Button variant={mode === "system" ? "contained" : "outlined"} onClick={() => setMode("system")}>System</Button></Stack></Box><Box><Typography variant="h6" fontWeight={800}>Notifications</Typography><FormControlLabel control={<Switch checked={preferences.notifications} onChange={(e) => change("notifications", e.target.checked)} />} label="Receive notification updates" /><FormControlLabel control={<Switch checked={preferences.matchAlerts} onChange={(e) => change("matchAlerts", e.target.checked)} />} label="Suggested match alerts" /></Box><Box><Typography variant="h6" fontWeight={800}>Accessibility</Typography><FormControlLabel control={<Switch checked={preferences.sidebarExpanded} onChange={(e) => change("sidebarExpanded", e.target.checked)} />} label="Keep sidebar expanded" /><FormControlLabel control={<Switch checked={preferences.reducedMotion} onChange={(e) => change("reducedMotion", e.target.checked)} />} label="Reduce motion" /><FormControlLabel control={<Switch checked={preferences.highContrast} onChange={(e) => change("highContrast", e.target.checked)} />} label="High contrast surfaces" /></Box><Alert severity="info">Preferences are stored locally for this demo. Secure account settings will be managed through authentication later.</Alert><Button color="error" variant="outlined" startIcon={<RestartAlt />} onClick={() => setConfirm(true)}>Reset demo data</Button>{message && <Alert severity="success">{message}</Alert>}</Stack></Card><Dialog open={confirm} onClose={() => setConfirm(false)}><DialogTitle>Reset demo data?</DialogTitle><DialogContent>This removes local reports, claims, saved items, and notifications.</DialogContent><DialogActions><Button onClick={() => setConfirm(false)}>Cancel</Button><Button color="error" variant="contained" onClick={() => { resetData(); setConfirm(false); setMessage("Demo data reset."); }}>Reset data</Button></DialogActions></Dialog></Box>;
}
