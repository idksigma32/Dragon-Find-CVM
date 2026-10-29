"use client";

import Link from "next/link";
import { AutoAwesome, ArrowForward } from "@mui/icons-material";
import { Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { useMockData, findMatches } from "@/lib/mock-store";

export default function MatchesPage() {
  const { items } = useMockData();
  const matches = items.filter((item) => item.item_type === "lost" && !item.hidden).flatMap((lost) => findMatches(lost, items).map((found) => ({ lost, found }))).sort((a, b) => b.found.matchScore - a.found.matchScore);
  return <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 5 } }}>
    <PageHeader eyebrow="SMART SUGGESTIONS" title="Suggested matches" description="Potential connections ranked from report details." />
    {matches.length ? <Grid container spacing={3}>{matches.map(({ lost, found }) => <Grid key={`${lost.id}-${found.id}`} size={{ xs: 12, md: 6 }}>
      <Card sx={{ p: 3 }}><Stack direction="row" justifyContent="space-between" gap={2}><Box><Typography variant="caption" color="text.secondary">Lost report</Typography><Typography variant="h6" fontWeight={800}>{lost.title}</Typography><Typography color="text.secondary">{lost.location} · {lost.category}</Typography></Box><AutoAwesome color="primary" /></Stack>
        <Box sx={{ borderLeft: 3, borderColor: "primary.main", pl: 2, my: 2 }}><Typography variant="caption" color="text.secondary">Possible found match</Typography><Typography fontWeight={800}>{found.title}</Typography><Typography variant="body2" color="text.secondary">{found.location} · {found.category}</Typography></Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center"><Chip label={`${found.matchScore}/8 match`} color="success" size="small" /><Button component={Link} href={`/items/${found.id}`} endIcon={<ArrowForward />}>View report</Button></Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Suggested because of {found.matchReason}.</Typography>
      </Card>
    </Grid>)}</Grid> : <Card sx={{ p: 6, textAlign: "center" }}><Typography variant="h6">No matches yet</Typography><Typography color="text.secondary">New reports will be compared automatically.</Typography></Card>}
  </Box>;
}
