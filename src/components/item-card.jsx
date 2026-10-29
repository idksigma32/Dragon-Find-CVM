"use client";
import Image from "next/image";
import { CalendarMonth, LocationOn } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { formatDate } from "@/lib/utils";

export function ItemCard({ item, onSelect }) {
  return <Card sx={{ height: "100%", transition: "transform .2s, box-shadow .2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}><CardActionArea onClick={() => onSelect?.(item)} sx={{ height: "100%" }}>
    {item.image_url ? <CardMedia component="img" height="190" image={item.image_url} alt="" /> : <CardMedia sx={{ height: 190, bgcolor: "secondary.light" }} />}
    <CardContent><Stack direction="row" justifyContent="space-between" alignItems="start" gap={1}><Typography variant="h6" fontWeight={700} fontSize="1rem">{item.title}</Typography><Chip size="small" label={item.item_type} color={item.item_type === "lost" ? "warning" : "success"} /></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{item.category}</Typography><Stack direction="row" spacing={1.5} mt={2}><Typography variant="caption" color="text.secondary"><LocationOn sx={{ fontSize: 14, verticalAlign: "middle" }} /> {item.location}</Typography><Typography variant="caption" color="text.secondary"><CalendarMonth sx={{ fontSize: 14, verticalAlign: "middle" }} /> {formatDate(item.created_at)}</Typography></Stack></CardContent>
  </CardActionArea></Card>;
}
