
"use client";

import Link from "next/link";
import {
  Box, Button, Card, CardContent, Chip,
  Grid, Stack, Typography, LinearProgress
} from "@mui/material";
import {
  Search, Add, Inventory2, Help,
  CheckCircle, AutoAwesome
} from "@mui/icons-material";
import { useMockData, findMatches } from "@/lib/mock-store";
import { ExpandableItemCard } from "@/components/items/expandable-item-card";

export default function LostFoundDashboard() {
  const { items } = useMockData();

  const visibleItems = items.filter((item) => !item.hidden);
  const lost = visibleItems.filter(i => i.item_type === "lost");
  const found = visibleItems.filter(i => i.item_type === "found");
  const returned = visibleItems.filter(i => i.status === "returned");

  const matches = lost.flatMap(item =>
    findMatches(item, visibleItems).slice(0, 1).map(match => ({
      lost: item,
      found: match
    }))
  );

  const stats = [
    { label: "Total Reports", value: visibleItems.length, icon: <Inventory2 />, color: "primary.main" },
    { label: "Lost Items", value: lost.length, icon: <Help />, color: "warning.main" },
    { label: "Found Items", value: found.length, icon: <Search />, color: "#2563EB" },
    { label: "Returned", value: returned.length, icon: <CheckCircle />, color: "#16A34A" }
  ];

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: "auto", p: { xs: 2, md: 5 } }}>
      <Stack direction={{ xs: "column", md: "row" }}
        justifyContent="space-between" gap={2} mb={5}>
        <Box>
          <Typography variant="overline" color="primary">
            SCHOOL OVERVIEW
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            Lost & Found Dashboard
          </Typography>
          <Typography color="text.secondary">
            Track belongings reported across campus.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={Link} href="/browse" variant="outlined"
            startIcon={<Search />}>Browse</Button>
          <Button component={Link} href="/report" variant="contained"
            startIcon={<Add />}>Report Item</Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {stats.map(s => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ color: s.color }}>{s.icon}</Box>
                <Typography variant="h3" fontWeight={800} mt={2}>
                  {s.value}
                </Typography>
                <Typography color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              Report Breakdown
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Lost versus found reports
            </Typography>

            {[
              { name: "Lost", count: lost.length, color: "warning" },
              { name: "Found", count: found.length, color: "success" }
            ].map(row => (
              <Box key={row.name} mb={3}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography>{row.name}</Typography>
                  <Typography fontWeight={700}>{row.count}</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  color={row.color}
                  value={visibleItems.length ? row.count / visibleItems.length * 100 : 0}
                  sx={{ height: 12, borderRadius: 8 }}
                />
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AutoAwesome color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Suggested Matches
              </Typography>
            </Stack>
            <Typography color="text.secondary" my={2}>
              Possible connections between lost and found reports.
            </Typography>

            {matches.length === 0 ? (
              <Typography color="text.secondary">
                No potential matches yet.
              </Typography>
            ) : matches.slice(0, 3).map((m, index) => (
              <Box key={index} sx={{ py: 1.5, borderBottom: "1px solid #eee" }}>
                <Typography fontWeight={600}>{m.lost.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Possible match: {m.found.title}
                </Typography>
                <Chip size="small" label="Possible match"
                  color="success" sx={{ mt: 1 }} />
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between"
        alignItems="center" mt={6} mb={3}>
        <Typography variant="h5" fontWeight={800}>
          Recent Reports
        </Typography>
        <Button component={Link} href="/browse">View All</Button>
      </Stack>

      <Grid container spacing={3}>
        {visibleItems.slice(0, 4).map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ExpandableItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
