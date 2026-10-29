"use client";

import { useMemo, useState } from "react";
import { Archive, Restore } from "@mui/icons-material";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { archiveItem, restoreItem, useMockData } from "@/lib/mock-store";

export default function StaffArchivePage() {
  const { archived, items } = useMockData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const categories = [...new Set(archived.map((item) => item.category))];
  const filtered = useMemo(() => archived.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()) && (category === "all" || item.category === category) && (type === "all" || item.item_type === type)), [archived, query, category, type]);
  return <Box sx={{ maxWidth: 1050, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="SIMULATED STAFF MODE" title="Archived reports" description="Manage reports removed from active listings." /><Stack direction={{ xs: "column", md: "row" }} gap={2} mb={3}><TextField label="Search archive" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth /><TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: 180 }}><MenuItem value="all">All categories</MenuItem>{categories.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField><TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 150 }}><MenuItem value="all">All types</MenuItem><MenuItem value="lost">Lost</MenuItem><MenuItem value="found">Found</MenuItem></TextField></Stack><Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Archived reports</Typography><Stack spacing={2}>{filtered.length ? filtered.map((item) => <Card key={item.id} sx={{ p: 3 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Box><Typography variant="h6" fontWeight={800}>{item.title}</Typography><Typography color="text.secondary">{item.category} · {item.item_type} · archived {new Date(item.archived_at).toLocaleString()}</Typography><Typography sx={{ mt: 1 }}>{item.archive_reason || "No reason recorded"}</Typography></Box><Button variant="contained" startIcon={<Restore />} onClick={() => restoreItem(item.id)}>Restore report</Button></Stack></Card>) : <Card sx={{ p: 4 }}><Typography color="text.secondary">No archived reports match these filters.</Typography></Card>}</Stack><Typography variant="h6" fontWeight={800} sx={{ mt: 4, mb: 2 }}>Archive an active report</Typography><Stack spacing={2}>{items.slice(0, 8).map((item) => <Card key={item.id} variant="outlined" sx={{ p: 2 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography>{item.title}</Typography><Button startIcon={<Archive />} onClick={() => { setSelected(item); setReason(""); }}>Archive</Button></Stack></Card>)}</Stack><Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth><DialogTitle>Archive report</DialogTitle><DialogContent><TextField autoFocus fullWidth label="Archive reason" value={reason} onChange={(e) => setReason(e.target.value)} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setSelected(null)}>Cancel</Button><Button variant="contained" onClick={() => { archiveItem(selected.id, reason || "Staff archived report"); setSelected(null); }}>Archive report</Button></DialogActions></Dialog></Box>;
}
