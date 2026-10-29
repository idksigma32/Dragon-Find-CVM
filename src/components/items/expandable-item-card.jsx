"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookmarkBorder, CalendarMonth, ExpandLess, ExpandMore, LocationOn } from "@mui/icons-material";
import { Card, CardActions, CardContent, CardActionArea, Chip, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { formatDate } from "@/lib/utils";
import { toggleSaved, trackRecent, useMockData } from "@/lib/mock-store";

export function ExpandableItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const { saved } = useMockData();
  const isSaved = saved.includes(item.id);

  function openDetails() {
    trackRecent(item.id);
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea component={Link} href={`/items/${item.id}`} onClick={openDetails} sx={{ p: 2, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="start" gap={1}>
          <Typography fontWeight={800}>{item.title}</Typography>
          <Chip size="small" label={item.item_type} color={item.item_type === "lost" ? "warning" : "success"} />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: .75 }}>{item.category}</Typography>
      </CardActionArea>
      <CardContent sx={{ pt: 1.5, pb: 1 }}>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary"><LocationOn sx={{ fontSize: 14, verticalAlign: "middle" }} /> {item.location}</Typography>
          <Typography variant="caption" color="text.secondary"><CalendarMonth sx={{ fontSize: 14, verticalAlign: "middle" }} /> {formatDate(item.created_at)}</Typography>
        </Stack>
        <Collapse in={expanded}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>{item.description}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>Status: {item.status || "open"}</Typography>
        </Collapse>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 1.5, pt: 0 }}>
        <IconButton aria-label={isSaved ? "Unsave item" : "Save item"} onClick={() => toggleSaved(item.id)} color={isSaved ? "primary" : "default"}>{isSaved ? <Bookmark /> : <BookmarkBorder />}</IconButton>
        <IconButton aria-label={expanded ? "Collapse item" : "Expand item"} onClick={() => setExpanded(!expanded)}>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </CardActions>
    </Card>
  );
}
