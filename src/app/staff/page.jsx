"use client";

import Link from "next/link";
import { Add, Archive, Assignment, Flag, Inventory2, OpenInNew, Replay, Verified } from "@mui/icons-material";
import { Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useMockData } from "@/lib/mock-store";

export default function StaffPage() {
  const { items, claims, moderation, archived, activity } = useMockData();
  const found = items.filter((item) => item.item_type === "found");
  const pending = claims.filter((claim) => claim.status === "pending");
  const flagged = items.filter((item) => item.flagged);
  const returned = items.filter((item) => item.status === "returned");
  const categories = [...new Set(items.map((item) => item.category))].map((category) => ({ category, count: items.filter((item) => item.category === category).length }));
  return <Box sx={{ maxWidth: 1250, mx: "auto", p: { xs: 2, md: 5 } }}>
    <PageHeader eyebrow="SIMULATED STAFF MODE" title="Staff overview" description="Demo controls model the future staff and admin workspace." actions={<Chip label="Demo controls only" color="warning" />} />
    <Grid container spacing={3} sx={{ mb: 3 }}>{[
      ["Active reports", items.length, <Assignment />], ["Pending claims", pending.length, <Verified />],
      ["Found awaiting pickup", found.filter((item) => !["returned", "claimed"].includes(item.status)).length, <Inventory2 />],
      ["Returned items", returned.length, <Replay />], ["Flagged reports", flagged.length, <Flag />], ["Archived reports", archived.length, <Archive />],
    ].map(([label, value, icon]) => <Grid key={label} size={{ xs: 6, md: 4, lg: 2 }}><StatCard label={label} value={value} icon={icon} /></Grid>)}</Grid>
    <Grid container spacing={3}><Grid size={{ xs: 12, md: 7 }}><Card sx={{ p: 3 }}><Typography variant="h6" fontWeight={800} mb={2}>Quick management actions</Typography><Stack direction="row" flexWrap="wrap" gap={1}><Button component={Link} href="/staff/claims" variant="contained">Review claims</Button><Button component={Link} href="/staff/inventory" variant="outlined">Manage inventory</Button><Button component={Link} href="/staff/moderation" variant="outlined">Review flags</Button><Button component={Link} href="/staff/archive" variant="outlined">Open archive</Button></Stack><Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>All actions are simulated and persist only in this browser.</Typography></Card><Card sx={{ p: 3, mt: 3 }}><Typography variant="h6" fontWeight={800} mb={2}>Category statistics</Typography>{categories.map(({ category, count }) => <Stack key={category} direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: 1, borderColor: "divider" }}><Typography>{category}</Typography><Typography fontWeight={700}>{count}</Typography></Stack>)}</Card></Grid><Grid size={{ xs: 12, md: 5 }}><Card sx={{ p: 3, mb: 3 }}><Typography variant="h6" fontWeight={800} mb={2}>Recent claim requests</Typography>{pending.slice(0, 4).map((claim) => { const item = items.find((entry) => entry.id === claim.item_id); return <Stack key={claim.id} direction="row" justifyContent="space-between" sx={{ py: 1 }}><Typography>{item?.title || "Unknown item"}</Typography><Button component={Link} href="/staff/claims" size="small">Review</Button></Stack>; })}{!pending.length && <Typography color="text.secondary">No pending claims.</Typography>}</Card><Card sx={{ p: 3 }}><Typography variant="h6" fontWeight={800} mb={2}>Recent staff activity</Typography>{activity.filter((event) => ["claim", "moderation", "archive", "status"].includes(event.type)).slice(0, 5).map((event) => <Stack key={event.id} direction="row" gap={1} sx={{ py: 1 }}><OpenInNew fontSize="small" color="primary" /><Box><Typography variant="body2" fontWeight={700}>{event.title}</Typography><Typography variant="caption" color="text.secondary">{new Date(event.created_at).toLocaleString()}</Typography></Box></Stack>)}{!moderation.length && !activity.some((event) => event.type === "claim") && <Typography color="text.secondary">Staff actions will appear here.</Typography>}</Card></Grid></Grid>
  </Box>;
}
