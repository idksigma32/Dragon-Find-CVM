
"use client";

import { useMemo, useState } from "react";
import {
  Box, Card, Button, Grid, Stack,
  TextField, Typography, MenuItem, Chip
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { ExpandableItemCard } from "@/components/items/expandable-item-card";
import { useMockData } from "@/lib/mock-store";

export default function BrowsePage() {
  const { items } = useMockData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = [
    "all", ...new Set(items.map(i => i.category))
  ];

  const filtered = useMemo(() => items.filter(item => {
    if (item.hidden) return false;
    const matchesSearch =
      `${item.title} ${item.description} ${item.location}`
        .toLowerCase().includes(query.toLowerCase());

    return matchesSearch &&
      (type === "all" || item.item_type === type) &&
      (category === "all" || item.category === category);
  }), [items, query, type, category]);

  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", p: { xs: 2, md: 5 } }}>
      <Typography variant="overline" color="primary">
        FIND YOUR BELONGINGS
      </Typography>
      <Typography variant="h3" fontWeight={800}>
        Browse Items
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Search lost and found reports around campus.
      </Typography>

      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Search items"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or location..."
              slotProps={{
                input: {
                  startAdornment: <Search sx={{ mr: 1, color: "grey.500" }} />
                }
              }} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField select fullWidth label="Type"
              value={type} onChange={e => setType(e.target.value)}>
              <MenuItem value="all">All Items</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="found">Found</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField select fullWidth label="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}>
              {categories.map(c => (
                <MenuItem key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <Stack direction="row" justifyContent="space-between"
        alignItems="center" mb={3}>
        <Typography fontWeight={700}>
          {filtered.length} Items
        </Typography>
        <Chip label="Demo Mode" color="primary" variant="outlined" />
      </Stack>

      <Grid container spacing={3}>
        {filtered.map(item => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ExpandableItemCard item={item} />
          </Grid>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Card sx={{ p: 6, mt: 3, textAlign: "center" }}>
          <Typography variant="h6">No items found</Typography>
          <Typography color="text.secondary" mb={2}>
            Try changing your filters.
          </Typography>
          <Button onClick={() => {
            setQuery("");
            setType("all");
            setCategory("all");
          }}>Clear Filters</Button>
        </Card>
      )}
    </Box>
  );
}
