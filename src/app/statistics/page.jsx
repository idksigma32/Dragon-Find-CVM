"use client";

import { Box, Card, LinearProgress, Grid, Stack, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { useMockData } from "@/lib/mock-store";

export default function StatisticsPage() {
  const { items } = useMockData();
  const lost = items.filter((item) => item.item_type === "lost").length;
  const found = items.filter((item) => item.item_type === "found").length;
  const returned = items.filter((item) => ["returned", "claimed"].includes(item.status)).length;
  const categories = [...new Set(items.map((item) => item.category))].map((category) => ({ category, count: items.filter((item) => item.category === category).length }));
  const statuses = [...new Set(items.map((item) => item.status || "open"))].map((status) => ({ status, count: items.filter((item) => (item.status || "open") === status).length }));
  return <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="COMMUNITY INSIGHTS" title="School statistics" description="Live totals calculated from the shared demo data." />
    <Grid container spacing={3} sx={{ mb: 3 }}>{[{ label: "Total reports", value: items.length }, { label: "Lost reports", value: lost }, { label: "Found reports", value: found }, { label: "Returned items", value: returned }].map((stat) => <Grid key={stat.label} size={{ xs: 6, md: 3 }}><StatCard {...stat} /></Grid>)}</Grid>
    <Grid container spacing={3}><Grid size={{ xs: 12, md: 6 }}><Card sx={{ p: 3 }}><Typography variant="h6" fontWeight={800} mb={3}>Category breakdown</Typography>{categories.map(({ category, count }) => <Box key={category} mb={2}><Stack direction="row" justifyContent="space-between"><Typography>{category}</Typography><Typography fontWeight={700}>{count}</Typography></Stack><LinearProgress variant="determinate" value={items.length ? count / items.length * 100 : 0} sx={{ mt: .75, height: 8, borderRadius: 4 }} /></Box>)}</Card></Grid><Grid size={{ xs: 12, md: 6 }}><Card sx={{ p: 3 }}><Typography variant="h6" fontWeight={800} mb={3}>Status distribution</Typography>{statuses.map(({ status, count }) => <Stack key={status} direction="row" justifyContent="space-between" sx={{ py: 1.5, borderBottom: 1, borderColor: "divider" }}><Typography sx={{ textTransform: "capitalize" }}>{status}</Typography><Typography fontWeight={700}>{count}</Typography></Stack>)}</Card></Grid></Grid>
  </Box>;
}
