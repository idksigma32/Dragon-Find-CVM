"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, EditLocation, Inventory2 } from "@mui/icons-material";
import { Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { addInventory, markItemReturned, useMockData } from "@/lib/mock-store";

export default function StaffInventoryPage() {
  const { items, inventory } = useMockData();
  const found = items.filter((item) => item.item_type === "found");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [location, setLocation] = useState("");
  const filtered = useMemo(() => found.filter((item) => `${item.title} ${item.location}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || (item.status || "open") === status)), [found, query, status]);
  function saveLocation() { addInventory(editing.id, location.trim() || "Unassigned"); setEditing(null); setLocation(""); }
  return <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="SIMULATED STAFF MODE" title="Inventory management" description="Internal storage tracking for found items." /><Stack direction={{ xs: "column", sm: "row" }} gap={2} mb={3}><TextField label="Search inventory" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth /><TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 180 }}><MenuItem value="all">All statuses</MenuItem><MenuItem value="open">Awaiting pickup</MenuItem><MenuItem value="claimed">Claimed</MenuItem><MenuItem value="returned">Returned</MenuItem></TextField></Stack><Stack spacing={2}>{filtered.map((item) => { const record = inventory.find((entry) => entry.item_id === item.id); return <Card key={item.id} sx={{ p: 3 }}><Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}><Box><Stack direction="row" gap={1} alignItems="center"><Inventory2 color="primary" /><Typography variant="h6" fontWeight={800}>{item.title}</Typography></Stack><Typography color="text.secondary">{item.category} · public location: {item.location}</Typography><Typography sx={{ mt: 1 }}>Storage location: <b>{record?.location || "Not assigned"}</b></Typography>{record?.history?.length > 1 && <Typography variant="caption" color="text.secondary">Updated {new Date(record.updated_at).toLocaleString()}</Typography>}</Box><Stack direction="row" gap={1} alignItems="center"><Chip label={item.status || "open"} color={item.status === "returned" ? "success" : "warning"} /><Button startIcon={<EditLocation />} onClick={() => { setEditing(item); setLocation(record?.location || ""); }}>Storage</Button>{item.status !== "returned" && <Button color="success" startIcon={<CheckCircle />} onClick={() => markItemReturned(item.id)}>Returned</Button>}<Button component={Link} href={`/items/${item.id}`}>Details</Button></Stack></Stack></Card>})}</Stack><Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth><DialogTitle>Update storage location</DialogTitle><DialogContent><TextField autoFocus fullWidth label="Internal location" placeholder="Cabinet B · Shelf 2" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="contained" onClick={saveLocation}>Save location</Button></DialogActions></Dialog></Box>;
}
