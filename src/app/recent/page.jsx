"use client";

import { DeleteSweep } from "@mui/icons-material";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { ExpandableItemCard } from "@/components/items/expandable-item-card";
import { clearRecent, useMockData } from "@/lib/mock-store";

export default function RecentPage() {
  const { items, recent } = useMockData();
  const recentItems = recent.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  return <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="MY SPACE" title="Recently viewed" description="Your latest item reports, in viewing order." actions={recentItems.length ? <Button color="inherit" startIcon={<DeleteSweep />} onClick={clearRecent}>Clear history</Button> : null} />
    {recentItems.length ? <Grid container spacing={3}>{recentItems.map((item) => <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}><ExpandableItemCard item={item} /></Grid>)}</Grid> : <Card sx={{ p: 6, textAlign: "center" }}><Typography variant="h6">Nothing viewed yet</Typography><Typography color="text.secondary">Open an item report to see it here.</Typography></Card>}
  </Box>;
}
