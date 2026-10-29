"use client";

import { useMemo, useState } from "react";
import { Box, Card, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { useMockData } from "@/lib/mock-store";

export default function ActivityPage() {
  const { activity } = useMockData();
  const [type, setType] = useState("all");
  const filtered = useMemo(() => activity.filter((event) => type === "all" || event.type === type).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [activity, type]);
  return <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="COMMUNITY" title="Activity feed" description="A public timeline of report and claim events." actions={<TextField select label="Filter" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 150 }}><MenuItem value="all">All events</MenuItem><MenuItem value="report">Reports</MenuItem><MenuItem value="claim">Claims</MenuItem><MenuItem value="status">Status updates</MenuItem></TextField>} />
    <Stack spacing={2}>{filtered.map((event) => <Card key={event.id} sx={{ p: 2.5 }}><Stack direction="row" justifyContent="space-between" gap={2}><Box><Typography fontWeight={700}>{event.title}</Typography><Typography color="text.secondary">{event.message}</Typography></Box><Chip label={event.type} size="small" variant="outlined" /></Stack><Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>{new Date(event.created_at).toLocaleString()}</Typography></Card>)}</Stack>
  </Box>;
}
