"use client";

import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { ExpandableItemCard } from "@/components/items/expandable-item-card";
import { useMockData, toggleSaved } from "@/lib/mock-store";

export default function SavedPage() {
  const { items, saved } = useMockData();
  const savedItems = saved.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  return <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="MY SPACE" title="Saved items" description="Keep reports you want to revisit close by." />
    {savedItems.length ? <Grid container spacing={3}>{savedItems.map((item) => <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}><ExpandableItemCard item={item} /></Grid>)}</Grid> : <Card sx={{ p: 6, textAlign: "center" }}><Typography variant="h6">No saved items</Typography><Typography color="text.secondary" mb={2}>Use the bookmark button while browsing reports.</Typography><Button href="/browse">Browse items</Button></Card>}
  </Box>;
}
