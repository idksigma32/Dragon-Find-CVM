"use client";

import Link from "next/link";
import { useState } from "react";
import { AccountCircle, Bookmark, Edit, Save } from "@mui/icons-material";
import { Alert, Box, Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { updateProfile, useMockData } from "@/lib/mock-store";

export default function ProfilePage() {
  const { profile, items, claims, activity } = useMockData();
  const [name, setName] = useState(profile.displayName);
  const [saved, setSaved] = useState(false);
  function save() { if (!name.trim()) return; updateProfile({ displayName: name.trim() }); setSaved(true); }
  return <Box sx={{ maxWidth: 1050, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="MY ACCOUNT" title="Student profile" description="Manage your demo profile and see your FindIt activity." /><Grid container spacing={3}><Grid size={{ xs: 12, md: 5 }}><Card sx={{ p: 3 }}><Stack alignItems="center" spacing={2}><AccountCircle sx={{ fontSize: 80, color: "primary.main" }} /><Typography variant="h5" fontWeight={800}>{profile.displayName}</Typography><Typography color="text.secondary">{profile.email}</Typography></Stack><TextField fullWidth label="Display name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} sx={{ mt: 3 }} /><Button fullWidth variant="contained" startIcon={<Save />} onClick={save} sx={{ mt: 2 }}>Save profile</Button>{saved && <Alert severity="success" sx={{ mt: 2 }}>Profile saved locally.</Alert>}</Card></Grid><Grid size={{ xs: 12, md: 7 }}><Grid container spacing={2}><Grid size={6}><StatCard label="Reports" value={items.filter((item) => item.owner === "student-demo").length} icon={<Edit />} /></Grid><Grid size={6}><StatCard label="Claims" value={claims.length} icon={<Bookmark />} /></Grid></Grid><Card sx={{ p: 3, mt: 2 }}><Typography variant="h6" fontWeight={800} mb={2}>Account activity</Typography>{activity.slice(0, 5).map((event) => <Typography key={event.id} variant="body2" sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}>{event.title} · {new Date(event.created_at).toLocaleDateString()}</Typography>)}</Card><Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}><Button component={Link} href="/dashboard">My dashboard</Button><Button component={Link} href="/claims">My claims</Button><Button component={Link} href="/saved">Saved items</Button></Stack></Grid></Grid></Box>;
}
